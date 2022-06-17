import React, { useEffect, useState } from 'react'
import AppBody from "pages/AppBody";
import { RouteComponentProps } from "react-router-dom";
import Card from 'components/Card';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { Currency, CurrencyAmount } from '@uniswap/sdk';
import { AutoColumn } from 'components/Column';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { AddressCurrencyInputPanel } from 'components/AddressInputPanel';
import { AutoRow } from 'components/Row';
import { tryParseAmount } from 'state/swap/hooks';
import { useActiveWeb3React } from 'hooks';
//const DISPERSE_CONTRACT_ADDRESS = "0xD152f549545093347A162Dce210e7293f1452150"

interface DisperseTarget {
    address: string,
    amount: string,
}

const defaultDisperseTarget = (): DisperseTarget => {
    return {
        address: "",
        amount: "0"
    }
}

const DisplayDisperseTarget = ({ currency, index, getDisperseTarget, setDisperseTarget, selected, onCollapseClick, onCloseClick }: { currency: Currency, index: number, getDisperseTarget: () => DisperseTarget, setDisperseTarget: (arg0: DisperseTarget) => void, selected: boolean, onCollapseClick: () => void, onCloseClick: () => void }) => {
    //TODO: this should be a dropdown
    //TODO: this needs a delete button (with modal confirmation?)
    return (
        <>
            <AutoRow>
                <AddressCurrencyInputPanel onCloseClick={onCloseClick} expanded={selected} toggleCollapse={onCollapseClick}  currencyValue={getDisperseTarget().amount} currencyInputOnChange={(amount) => setDisperseTarget({...getDisperseTarget(), amount: amount})} addressValue={getDisperseTarget().address} addressOnChange={(value: string) => setDisperseTarget({ ...getDisperseTarget(), address: value })} />
            </AutoRow>
        </>
    )
}

export default function Disperse({ history }: RouteComponentProps) {
    const {chainId} = useActiveWeb3React()
    const [currency, setCurrency] = useState<Currency | undefined>(undefined)
    const [disperseTargets, setDisperseTargets] = useState<Array<DisperseTarget>>([])
    const [selected, setSelected] = useState<number | null>(null);
    const [sum, setSum] = useState<string>("0")
    const setDisperseTarget = (index: number) => {
        return (newValue: DisperseTarget) => {
            const newArray = Array.from(disperseTargets)
            while (newArray.length <= index) {
                newArray.push(defaultDisperseTarget())
            }
            newArray[index] = newValue
            setDisperseTargets(newArray)
        }
    }
    const addNewDisperseTarget = () => {
        setDisperseTarget(disperseTargets.length)(defaultDisperseTarget());
        if(disperseTargets.length === 0) {
            setSelected(0)
        }
    }
    const getDisperseTarget = (index: number) => {
        return () => disperseTargets[index]
    }

    const onCloseClick = (index: number) => {
        return () => {
            if(selected === index) {
                setSelected(null);
            }
            setDisperseTargets(disperseTargets.filter((_, i) => i !== index))
        }
    }

    const onCollapseClick = (index: number) => {
        return () => {
            if(selected === index) {
                setSelected(null);
            } else {
                setSelected(index)
            }
        }
    }

    useEffect(() => {
        setDisperseTargets([])
    }, [currency])

    useEffect(() => {
        if (currency && disperseTargets.length > 0 && chainId) {
            const ZERO_CURRENCY = CurrencyAmount.fromRawAmount(currency, "0")
            const sumOfTargets = disperseTargets.map((x) => tryParseAmount(chainId, x.amount, currency)).reduce((x,y) => (x || ZERO_CURRENCY).add(y || ZERO_CURRENCY), ZERO_CURRENCY) || ZERO_CURRENCY
            setSum(sumOfTargets.toExact())
        } else {
            setSum("0")
        }
    }, [disperseTargets])

    return (<>
        <AppBody>
            <Card width="100%">
                <AutoColumn gap={'md'}>
                    <CurrencyInputPanel inputDisabled={true} hideBorder={true} id="disperse-currency" showMaxButton={false} onUserInput={(v: string) => null} value={sum} disableCurrencySelect={false} hideBalance={false} hideInput={!currency} onCurrencySelect={setCurrency} currency={currency} label="" />
                </AutoColumn>
                <AutoColumn gap={'md'}>
                    {currency && disperseTargets.map((_element, index) => <DisplayDisperseTarget onCollapseClick={onCollapseClick(index)} onCloseClick={onCloseClick(index)} selected={index === selected} currency={currency} index={index} getDisperseTarget={getDisperseTarget(index)} setDisperseTarget={setDisperseTarget(index)} />)}
                </AutoColumn>
                <AutoColumn>
                    <ButtonSecondary onClick={addNewDisperseTarget} disabled={!currency}>Add recipient</ButtonSecondary>
                    <ButtonPrimary onClick={() => { }} disabled={!currency}>Disperse</ButtonPrimary>
                </AutoColumn>
            </Card>
        </AppBody>
    </>
    )
}