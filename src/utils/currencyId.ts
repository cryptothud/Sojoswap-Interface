import { Currency, NativeCurrency, Token } from '@uniswap/sdk'

export function currencyId(currency: Currency): string {
  if (currency instanceof NativeCurrency) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
