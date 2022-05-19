import { ChainId, Currency, CurrencyAmount, Ether, NativeCurrency, Token, WETH9 } from '@uniswap/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency instanceof NativeCurrency ? WETH9[chainId] : currency?.isToken ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH9[token.chainId])) return Ether.onChain(token.chainId)
  return token
}
