import React, { useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink, TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { getEtherscanLink } from '../../utils'
import { Input as NumericalInput } from '../NumericalInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Currency } from '@uniswap/sdk'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`

const InputPanelTopSquare = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 0 0 1.25rem 1.25rem;
  z-index: 1;
  width: 100%;
`
const InputPanelDropdownHeader = styled.div<{ expanded?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  position: relative;
  border-radius: ${({ expanded }) => (expanded ? '1.25rem 1.25rem 0 0' : '1.25rem')};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.bg1};
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const NumericalInputContainer = styled.div`
  display: inline-flex;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.primary1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export default function AddressInputPanel({
  id,
  value,
  onChange
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const { address, loading, name } = useENS(value)

  const handleInput = useCallback(
    event => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange]
  )

  const error = Boolean(value.length > 0 && !loading && !address)

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.black color={theme.text2} fontWeight={500} fontSize={14}>
                Recipient
              </TYPE.black>
              {address && chainId && (
                <ExternalLink href={getEtherscanLink(chainId, name ?? address, 'address')} style={{ fontSize: '14px' }}>
                  (View on Etherscan)
                </ExternalLink>
              )}
            </RowBetween>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Wallet Address or ENS name"
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  )
}

const InputPanelSummaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-shrink: 1;
  flex-grow: 1;
  margin: 8px;
`
const InputPanelControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding-right: 20px;
  margin-left: auto;
  flex-shrink: 1;
  flex-grow: 0;
  margin-right: 0px;
`

const IconContainer = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: -4px;
  margin-right: -4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SummaryTextbox = styled.div`
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 100%;
  color: #0c0c0c !important;
`

export function AddressCurrencyInputPanel({
  id,
  addressValue,
  addressOnChange,
  currencyValue,
  currencyInputOnChange,
  currencyError,
  expanded,
  currency,
  toggleCollapse,
  onCloseClick
}: {
  id?: string
  // the typed string value
  addressValue: string
  // triggers whenever the typed value changes
  addressOnChange: (value: string) => void
  currencyValue: string
  currencyInputOnChange: (value: string) => void
  currencyError?: boolean
  expanded?: boolean
  currency?: Currency
  toggleCollapse: () => void
  onCloseClick: () => void
}) {
  const { chainId } = useActiveWeb3React()

  const { address, loading, name } = useENS(addressValue)

  const handleInput = useCallback(
    event => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      addressOnChange(withoutSpaces)
    },
    [addressOnChange]
  )

  const error = Boolean(addressValue.length > 0 && !loading && !address)

  return (
    <> {!expanded &&
        <InputPanelDropdownHeader expanded={expanded}>
          {!expanded && (
            <InputPanelSummaryContainer>
              <SummaryTextbox>Recipient: {addressValue}</SummaryTextbox>
              <SummaryTextbox>
                Amount: {currencyValue} {currency ? currency.symbol : ''}
              </SummaryTextbox>
            </InputPanelSummaryContainer>
          )}
          <InputPanelControls>
            <IconContainer onClick={onCloseClick} aria-label="Delete row">
              <FontAwesomeIcon icon={faXmark} size="2x" fixedWidth color="#0c0c0c" cursor="pointer" />
            </IconContainer>
          </InputPanelControls>
        </InputPanelDropdownHeader> }
      {expanded && (
        <InputPanelTopSquare id={id} className="disperseBox">
          <ContainerRow error={error}>
            <InputContainer>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.black color={'#0c0c0c'} fontWeight={500} fontSize={14}>
                    Recipient
                  </TYPE.black>
                  {address && chainId && (
                    <ExternalLink
                      href={getEtherscanLink(chainId, name ?? address, 'address')}
                      style={{ fontSize: '14px' }}
                    >
                      (View on Etherscan)
                    </ExternalLink>
                  )}
                </RowBetween>
                <Input
                  className="recipient-address-input"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Wallet Address or ENS name"
                  error={error}
                  pattern="^(0x[a-fA-F0-9]{40})$"
                  onChange={handleInput}
                  value={addressValue}
                />
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.black color={'#0c0c0c'} fontWeight={500} fontSize={14}>
                    Amount
                  </TYPE.black>
                </RowBetween>
                <NumericalInputContainer id="disperseInput">
                  <NumericalInput placeholder={'0'} value={currencyValue} onUserInput={currencyInputOnChange} error={currencyError} />
                </NumericalInputContainer>
              </AutoColumn>
            </InputContainer>
          </ContainerRow>
        </InputPanelTopSquare>
      )}
    </>
  )
}
