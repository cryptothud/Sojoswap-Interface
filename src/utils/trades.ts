import { ZERO_PERCENT, ONE_HUNDRED_PERCENT } from './../constants/index'
import { Trade, Percent, Currency, TradeType } from '@uniswap/sdk'
import JSBI from 'jsbi'

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: Trade<Currency, Currency, TradeType> | undefined | null,
  tradeB: Trade<Currency, Currency, TradeType> | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT
): boolean | undefined {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeB.outputAmount.currency.equals(tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  } else {
    const val = minimumDelta.add(ONE_HUNDRED_PERCENT)
    const numerator = val.numerator
    const denominator = val.denominator

    const cmp = JSBI.divide(JSBI.multiply(tradeA.executionPrice.quotient, numerator), denominator)
    return JSBI.lessThan(cmp, tradeB.executionPrice.quotient)
  }
}
