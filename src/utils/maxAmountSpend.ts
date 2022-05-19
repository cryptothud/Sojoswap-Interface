import { Currency, CurrencyAmount, Ether, NativeCurrency } from '@uniswap/sdk'
import JSBI from 'jsbi'
import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount<Currency>, chainId?: number): CurrencyAmount<Currency> | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency instanceof NativeCurrency) {
    if (JSBI.greaterThan(currencyAmount.quotient, MIN_ETH)) {
      return CurrencyAmount.fromRawAmount(Ether.onChain(chainId || 0), JSBI.subtract(currencyAmount.quotient, MIN_ETH))
    } else {
      return CurrencyAmount.fromRawAmount(Ether.onChain(chainId || 0), JSBI.BigInt(0))
    }
  }
  return currencyAmount
}
