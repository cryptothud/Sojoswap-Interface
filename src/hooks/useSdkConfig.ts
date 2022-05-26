import { FACTORY_CONFIG } from '@uniswap/sdk'

export const useSdkConfig: () => FACTORY_CONFIG = () => {
  return {
    FACTORY_ADDRESS: '0x9BF82b33e3451bF3F6652301a5F5AD71Ac8A49B0',
    INIT_CODE_HASH: '0x94fec971f291125ba989ae14a2fa659e5a3891fdec339366a41794f58d26e267'
  }
}
