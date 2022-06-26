import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AppBody from 'pages/AppBody'
import { RouteComponentProps } from 'react-router-dom'
import Card from 'components/Card'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Currency, CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk'
import { AutoColumn } from 'components/Column'
import { ButtonPrimary, ButtonSecondary } from 'components/Button'
import { AddressCurrencyInputPanel } from 'components/AddressInputPanel'
import { AutoRow } from 'components/Row'
import { tryParseAmount } from 'state/swap/hooks'
import { useActiveWeb3React } from 'hooks'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import useENS from 'hooks/useENS'
import DisperseABI from './Disperse.json'
import { useContract } from 'hooks/useContract'
import { DisperseContractAddress } from '../../constants'
import { useTransactionAdder } from 'state/transactions/hooks'
import { BigNumber, BigNumberish } from 'ethers'
import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import styled from 'styled-components'

const ErrorWindow = styled.div`
  background: rgba(255, 0, 0, 0.3);
  margin: 20px 0;
  border: 1px solid red;
  border-radius: 20px;
  padding: 6px;
`

const useDisperseContract = () => {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && DisperseContractAddress[chainId], DisperseABI, true)
}

interface DisperseTarget {
  address: string
  amount: string
  resolvedAddress?: string
}

const defaultDisperseTarget = (): DisperseTarget => {
  return {
    address: '',
    amount: '0'
  }
}

const DisplayDisperseTarget = ({
  currency,
  index,
  getDisperseTarget,
  setDisperseTarget,
  selected,
  onCollapseClick,
  onCloseClick
}: {
  currency: Currency
  index: number
  getDisperseTarget: () => DisperseTarget
  setDisperseTarget: (arg0: DisperseTarget) => void
  selected: boolean
  onCollapseClick: () => void
  onCloseClick: () => void
}) => {
  //TODO: this should be a dropdown
  //TODO: this needs a delete button (with modal confirmation?)
  const target = getDisperseTarget()
  const { loading, address } = useENS(target.address)
  useEffect(() => {
    if (loading) return
    if (address && target.resolvedAddress !== address) {
      setDisperseTarget({ ...target, resolvedAddress: address })
    } else if (!address && target.resolvedAddress) {
      setDisperseTarget({ ...target, resolvedAddress: undefined })
    }
  }, [loading, address, target, setDisperseTarget])
  return (
    <>
      <AutoRow>
        <AddressCurrencyInputPanel
          onCloseClick={onCloseClick}
          expanded={selected}
          toggleCollapse={onCollapseClick}
          currencyValue={getDisperseTarget().amount}
          currencyInputOnChange={amount => setDisperseTarget({ ...getDisperseTarget(), amount: amount })}
          addressValue={getDisperseTarget().address}
          addressOnChange={(value: string) => setDisperseTarget({ ...getDisperseTarget(), address: value })}
        />
      </AutoRow>
    </>
  )
}

interface IDisperseError {
  sayError: () => string
  error: boolean
  showSayError: boolean
  type: string
}

const formatCurrency = (currencyAmount: CurrencyAmount<Currency>) => {
  const symbol = currencyAmount.currency.symbol
  return currencyAmount.toSignificant() + (symbol ? ' ' + symbol : '')
}

class DisperseBalanceError implements IDisperseError {
  expectedBalance: CurrencyAmount<Currency>
  actualBalance: CurrencyAmount<Currency>
  error = true
  showSayError = true
  type = 'DisperseBalanceError'

  constructor(expectedBalance: CurrencyAmount<Currency>, actualBalance: CurrencyAmount<Currency>) {
    this.expectedBalance = expectedBalance
    this.actualBalance = actualBalance
  }

  sayError = () =>
    `Amount (${formatCurrency(this.expectedBalance)}) exceeds balance (${formatCurrency(this.actualBalance)})`
}

class DisperseAddressError implements IDisperseError {
  type = 'DisperseAddressError'
  entry: number
  error = true
  showSayError = true
  constructor(entry: number) {
    this.entry = entry
  }
  sayError = () => `Invalid address in entry #${this.entry + 1}`
}

class DisperseNoError implements IDisperseError {
  type = 'DisperseNoError'
  error = false
  showSayError = false
  sayError = () => ''
}

class DisperseNoTargets implements IDisperseError {
  type = 'DisperseNoTargets'
  error = false
  showSayError = false
  sayError = () => ''
}

class DisperseNoChain implements IDisperseError {
  type = 'DisperseNoChain'
  error = true
  showSayError = true
  sayError = () => 'Not connected to wallet'
}

class DisperseAmountZero implements IDisperseError {
  type = 'DisperseAmountZero'
  entry: number
  error = true
  showSayError = true
  constructor(entry: number) {
    this.entry = entry
  }
  sayError = () => `Send amount must be greater than 0 in entry #${this.entry + 1}`
}
class DisperseNotEnough implements IDisperseError {
  type = 'DisperseNotEnough'
  error = true
  showSayError = true
  sayError = () => 'Not enough balance!'
}
class DisperseNormalError implements IDisperseError {
  type = 'DisperseNormalError'
  error = true
  showSayError = true
  sayError = () => 'Error!'
}
class DisperseAccountError implements IDisperseError {
  type = 'DisperseAccountError'
  error = true
  showSayError = true
  sayError = () => 'Connect your wallet!'
}

export default function Disperse({ history }: RouteComponentProps) {
  const { chainId, account } = useActiveWeb3React()
  const [currency, setCurrency] = useState<Currency | undefined>(undefined)
  const [disperseTargets, setDisperseTargets] = useState<Array<DisperseTarget>>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [error, setError] = useState<IDisperseError>(new DisperseNoError())
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const disperseContract = useDisperseContract()
  const addTransaction = useTransactionAdder()

  const currencyAsToken = currency instanceof Token ? (currency as Token) : undefined
  const currencyAsNative = currency instanceof NativeCurrency ? (currency as NativeCurrency) : undefined

  const tokenBalance = useTokenBalance(account || undefined, currencyAsToken)
  const ethBalance = useETHBalances([account || undefined])[0]
  console.log(ethBalance)
  const balance = currencyAsNative ? ethBalance : tokenBalance
  const setDisperseTarget = useCallback(
    (index: number) => {
      return (newValue: DisperseTarget) => {
        const newArray = Array.from(disperseTargets)
        while (newArray.length <= index) {
          newArray.push(defaultDisperseTarget())
        }
        newArray[index] = newValue
        setDisperseTargets(newArray)
      }
    },
    [disperseTargets]
  )
  const addNewDisperseTarget = useCallback(() => {
    setDisperseTarget(disperseTargets.length)(defaultDisperseTarget())
    setSelected(disperseTargets.length)
  }, [disperseTargets, setDisperseTarget])
  const getDisperseTarget = useCallback(
    (index: number) => {
      return () => disperseTargets[index]
    },
    [disperseTargets]
  )

  const onCloseClick = useCallback(
    (index: number) => {
      return () => {
        if (selected === index) {
          if (selected < disperseTargets.length + 1) {
            //intentionally left blank
          } else if (index > 0) {
            setSelected(index - 1)
          } else {
            setSelected(null)
          }
        }
        setDisperseTargets(disperseTargets.filter((_, i) => i !== index))
      }
    },
    [disperseTargets, selected]
  )

  const onCollapseClick = useCallback(
    (index: number) => {
      return () => {
        if (selected === index) {
          setSelected(null)
        } else {
          setSelected(index)
        }
      }
    },
    [selected]
  )

  const sum = useMemo(() => {
    if (currency && disperseTargets.length > 0 && chainId) {
      const ZERO_CURRENCY = CurrencyAmount.fromRawAmount(currency, '0')
      const sumOfTargets =
        disperseTargets
          .map(x => tryParseAmount(chainId, x.amount, currency))
          .reduce((x, y) => (x || ZERO_CURRENCY).add(y || ZERO_CURRENCY), ZERO_CURRENCY) || ZERO_CURRENCY
      return sumOfTargets.toExact()
    } else {
      return '0'
    }
  }, [disperseTargets, chainId, currency])

  const [balanceError, setBalanceError] = useState(false)
  const [normalError, setNormalError] = useState(false)

  //error checking
  useEffect(() => {
    let localError = new DisperseNoError()
    if (account === null) {
      localError = new DisperseAccountError()
    }
    if (normalError === true) {
      localError = new DisperseNormalError()
      setTimeout(() => {
        setNormalError(false)
      }, 3000)
    }
    if (balanceError === true) {
      localError = new DisperseNotEnough()
      setTimeout(() => {
        setBalanceError(false)
      }, 3000)
    }
    disperseTargets.forEach((i, index) => {
      if (Number(i.amount) === 0) {
        localError = new DisperseAmountZero(index)
      }
    })
    if (!chainId) {
      localError = new DisperseNoChain()
    } else {
      if (normalError === true) {
        localError = new DisperseNormalError()
        setTimeout(() => {
          setNormalError(false)
        },3000)
      }
      if (balanceError === true) {
        localError = new DisperseNotEnough()
        setTimeout(() => {
          setBalanceError(false)
        },3000)
      }
      disperseTargets.forEach((i,index) => {
        if (Number(i.amount) === 0) {
          localError = new DisperseAmountZero(index)
        }
      })
      if (!chainId) {
        localError = new DisperseNoChain()
      } else {
        const parsedSum = tryParseAmount(chainId, sum, currency)
        if (localError instanceof DisperseNoChain) {
        } else if (balance && parsedSum?.greaterThan(balance.asFraction)) {
          localError = new DisperseBalanceError(parsedSum, balance)
        } else if (disperseTargets.length === 0) {
          localError = new DisperseNoTargets()
        } else {
          for (let i = 0; i < disperseTargets.length; i++) {
            const target = disperseTargets[i]
            if (!target.resolvedAddress) {
              localError = new DisperseAddressError(i)
            }
          }
        }
      }
    }
    if (JSON.stringify(localError) !== JSON.stringify(error)) {
      setError(localError)
    }
  }, [balance, chainId, currency, disperseTargets, sum, error, balanceError, account])
  const txnSum = chainId && tryParseAmount(chainId, sum, currency)
  const [approval, approvalCallback] = useApproveCallback(currencyAsToken && txnSum, disperseContract?.address)

  const disperseButtonText = useMemo(() => {
    if (currencyAsNative) {
      return 'Disperse'
    } else {
      if (approval === ApprovalState.APPROVED) {
        return 'Disperse'
      } else if (approval === ApprovalState.PENDING) {
        return 'Approval pending...'
      } else if (approval === ApprovalState.NOT_APPROVED) {
        return 'Approve'
      } else {
        return 'Disperse'
      }
    }
  }, [approval, currencyAsNative])

  const disperseButtonDisabled = useMemo(() => {
    if (!currency || !disperseContract) {
      return true
    }
    if (currencyAsToken) {
      if (approval === ApprovalState.APPROVED || approval === ApprovalState.NOT_APPROVED) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }, [approval, currency, currencyAsToken, disperseContract])

  const onDisperseClick = useCallback(async () => {
    if (attemptingTxn) return
    if (!disperseContract) {
      throw 'Unsupported chain'
    }
    if (!chainId) {
      throw 'Bad chain'
    }
    if ((!currencyAsNative && !currencyAsToken) || !currency) {
      throw 'Unknown currency'
    }
    if (error && error.error) {
      console.log('Error while dispersing: ', error.sayError())
    }
    if (error) {
      console.log('Error while dispersing: ', error.sayError())
    }

    if (currencyAsToken) {
      if (approval === ApprovalState.NOT_APPROVED) {
        setAttemptingTxn(true)
        approvalCallback()
          .then(() => {
            setAttemptingTxn(false)
          })
          .catch(e => {
            setAttemptingTxn(false)
            console.error(e)
          })
        return
      }

      if (approval !== ApprovalState.APPROVED) {
        return
      }
    }

    const argsTmpl: { recipients: string[]; values: BigNumberish[] } = { recipients: [], values: [] }
    const methodName = currencyAsNative ? 'disperseEther' : 'disperseToken'
    disperseTargets.forEach(x => {
      if (!x.resolvedAddress) {
        throw 'Address resolution error'
      }
      argsTmpl.recipients.push(x.resolvedAddress)
      const amt = tryParseAmount(chainId, x.amount, currency)?.quotient.toString()
      if (!amt) {
        throw `Failed to parse amount ${amt} -- ${x.amount} ${currency}`
      }
      argsTmpl.values.push(BigNumber.from(amt))
    })

    const args = currencyAsNative
      ? [argsTmpl.recipients, argsTmpl.values]
      : [currency.wrapped.address, argsTmpl.recipients, argsTmpl.values]
    if (!txnSum) {
      throw 'Failed to parse total txn value'
    }
    const txnValueIfNative = txnSum.quotient.toString()

    const value: BigNumber = currencyAsNative ? BigNumber.from(txnValueIfNative) : BigNumber.from(0)
    const safeGasEstimate = await disperseContract?.estimateGas[methodName](...args, { value })
      .then(calculateGasMargin)
      .catch(error => {
        setNormalError(true)
        console.error(`estimateGas failed`, methodName, args, error)
        return undefined
      })
    setAttemptingTxn(true)
    await disperseContract[methodName](...args, { value, gasLimit: safeGasEstimate })
      .then((response: TransactionResponse) => {
        setAttemptingTxn(false)
        addTransaction(response, {
          summary: `Disperse ${formatCurrency(txnSum)} to ${disperseTargets.length} addresses`
        })
      })
      .catch((e: any) => {
        setAttemptingTxn(false)
        setBalanceError(true)
        console.error('here' + e)
      })
  }, [
    approval,
    approvalCallback,
    txnSum,
    addTransaction,
    attemptingTxn,
    chainId,
    currency,
    currencyAsNative,
    currencyAsToken,
    disperseContract,
    disperseTargets,
    error
  ])
  return (
    <>
      <AppBody>
        <Card width="100%" style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 400 }}>Disperse</h1>
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              inputDisabled={true}
              hideBorder={true}
              id="disperse-currency"
              showMaxButton={false}
              onUserInput={(v: string) => null}
              value={sum}
              disableCurrencySelect={false}
              hideBalance={false}
              hideInput={!currency}
              onCurrencySelect={setCurrency}
              currency={currency}
              label=""
            />
          </AutoColumn>
          <AutoColumn>{error.error && error.showSayError && <ErrorWindow>{error.sayError()}</ErrorWindow>}</AutoColumn>
          <AutoColumn gap={'md'}>
            {currency &&
              disperseTargets.map((_element, index) => (
                <DisplayDisperseTarget
                  onCollapseClick={onCollapseClick(index)}
                  onCloseClick={onCloseClick(index)}
                  selected={index === selected}
                  currency={currency}
                  index={index}
                  getDisperseTarget={getDisperseTarget(index)}
                  setDisperseTarget={setDisperseTarget(index)}
                />
              ))}
          </AutoColumn>
          <AutoColumn style={{ rowGap: '10px' }}>
            <ButtonSecondary id="addRecipent" onClick={addNewDisperseTarget} disabled={!currency}>
              {!currency ? 'Please select a token to disperse.' : 'Add recipient'}
            </ButtonSecondary>
            <ButtonPrimary onClick={onDisperseClick} disabled={disperseButtonDisabled}>
              {disperseButtonText}
            </ButtonPrimary>
          </AutoColumn>
        </Card>
      </AppBody>
    </>
  )
}
