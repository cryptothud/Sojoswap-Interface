import { ChainId } from '@uniswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
//import { darken } from 'polished'
//import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/images/sojo/logo.png'
//import LogoDark from '../../assets/images/sojo/logo.png'
import { useActiveWeb3React } from '../../hooks'
//import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances /*useAggregateUniBalance*/ } from '../../state/wallet/hooks'
//import { CardNoise } from '../earn/styled'
//import { CountUp } from 'use-count-up'
//import { /*TYPE,*/ ExternalLink } from '../../theme'

import { YellowCard } from '../Card'
//import { Moon, Sun } from 'react-feather'
//import Menu from '../Menu'

import { /*Row,*/ RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
//import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
//import { useUserHasAvailableClaim } from '../../state/claim/hooks'
//import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
//import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
//import usePrevious from '../../hooks/usePrevious'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 0 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const Socials = styled.div`
  display: flex;
  column-gap: 5px;
  margin: 5px;
  width: 100%;
  justify-content: space-evenly;
  img {
    width: 23px;
    cursor: pointer;
    filter: invert(100%);
    transition: 0.2s ease-in-out;
    &:hover {
      opacity: 0.2;
    }
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  column-gap: 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: #0C0C0C;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`
/*
const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`
*/
const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`
/*
const HeaderLinks = styled(Row)`
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 50px !important;
  width: auto !important;
  height: 40px;
  border: 3px solid #00000026 !important;
  @media only screen and (max-width: 960px) {
    position: fixed;
    bottom: 72px;
    top: auto;
    padding: 0 !important;
    box-shadow: 0 0 20px #00000050;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`
*/
const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: none;
  border-radius: 50px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`
/*
const NavigationTabs = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff20;
  border-radius: 50px;
  h1 {
    font-size: 16px;
    padding: 0 25px;
    cursor: pointer;
    border-radius: 50px;
  }
`
*/
/*
const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`
*/
const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  text-decoration: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 25px;
  h1 {
    color: #fff;
    text-decoration: none !important;
  }
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'
/*
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #00000090 !important;
  font-size: 1rem;
  width: fit-content;
  height: -webkit-fill-available;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 50px !important;

  &.${activeClassName} {
    font-weight: 600;
    color: #fff !important;
    background: #0c0c0c !important;
    border: 2px solid #fff !important;
    :hover {
      color: #ffffff80 !important;
    }
  }

  :hover {
    color: #00000050 !important;
  }
`
*/
const StyledNavLink2 = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  color: #0c0c0c;
  width: 100%;
  padding: 10px 0;
  transition: 0.2s ease-in-out;
  justify-content: center;
  text-decoration: none;
  &:hover {
    opacity: 0.4;
  }
  &.${activeClassName} {
    font-weight: 600;
    color: #0c0c0c;
    background: #0c0c0c27;
  }
<<<<<<< HEAD
`
const StyledNavLink3 = styled.a`
  padding: 0;
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  cursor: not-allowed;
  color: #0c0c0c;
  width: 100%;
  padding: 10px 0;
  transition: 0.2s ease-in-out;
  justify-content: center;
  text-decoration: none;
  opacity: 0.4
  &:hover {
    opacity: 0.4;
  }
=======
>>>>>>> 1b5e2ec (Fix code style issues with ESLint)
`
/*
const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`
*/
export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`
export const MenuIcon = styled.h1`
  cursor: pointer;
  font-weight: 30px;
  font-weight: 700;
  color: #fff;
  &:hover {
    opacity: 0.7;
  }
`
export const TheMenu = styled.div`
  position: absolute;
  top: calc(100% - 1rem);
  right: 15px;
  background: #ffffff;
  row-gap: 5px;
  padding: 5px 0;
  width: 200px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.2s ease-in-out;
  box-shadow: 0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%),
    0px 24px 32px rgb(0 0 0 / 1%), 0 0 5px #5e5e5e;
  @media only screen and (max-width: 960px) {
    top: auto;
    bottom: calc(100% + 5px);
    right: 5px;
  }
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  //const { t } = useTranslation()

  const [showMenu, setShowMenu] = useState({ opacity: '0', pointerEvents: 'none' as 'auto' })

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()
  //const [darkMode, toggleDarkMode] = useDarkModeManager()

  //const toggleClaimModal = useToggleSelfClaimModal()

  //const availableClaim: boolean = useUserHasAvailableClaim(account)

  //const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  //const aggregateBalance: CurrencyAmount<Token> | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  //const showClaimPopup = useShowClaimPopup()

  //const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  //const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href="/#/">
          <UniIcon>
            <img width={'80px'} style={{ margin: '5px' }} src={Logo} alt="logo" />
            <h1>SOJOswap</h1>
          </UniIcon>
        </Title>
        {/*
        <HeaderLinks>
          <StyledNavLink id={`home-nav-link`} to={''} isActive={(match, { pathname }) => pathname.length === 1}>
            Home
          </StyledNavLink>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            Swap
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            Pool
          </StyledNavLink>
          {/*
          <StyledNavLink id={`stake-nav-link`} to={'/uni'}>
            UNI
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
            Vote
          </StyledNavLink>
          <StyledExternalLink id={`stake-nav-link`} href={'https://uniswap.info'}>
            Charts <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
          
        </HeaderLinks>
        */}
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {/*
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          {!availableClaim && aggregateBalance && (
            <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                UNI
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
                    )}*/}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} ETH
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        {/*
        <HeaderElementWrap>
          <StyledMenuButton onClick={() => toggleDarkMode()}>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </StyledMenuButton>
          <Menu />
        </HeaderElementWrap>
        */}
        <MenuIcon
          onClick={() =>
            showMenu.opacity === '0'
              ? setShowMenu({ opacity: '1', pointerEvents: 'auto' as 'auto' })
              : setShowMenu({ opacity: '0', pointerEvents: 'none' as 'auto' })
          }
        >
          MENU
        </MenuIcon>
        <TheMenu style={showMenu}>
          <StyledNavLink2 id={`home-nav-link`} to={''} isActive={(match, { pathname }) => pathname.length === 1}>
            Home
          </StyledNavLink2>
          <StyledNavLink2 id={`swap-nav-link`} to={'/swap'}>
            Swap
          </StyledNavLink2>
          <StyledNavLink2
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            Pool
          </StyledNavLink2>
          <StyledNavLink3
            id={`whitepaper-nav-link`}
          >
            Whitepaper
          </StyledNavLink3>
          <Socials>
            <img src="/images/sojo/twitter.png" alt="" />
            <img src="/images/sojo/discord.png" alt="" />
            <img src="/images/sojo/telegram.png" alt="" />
            <img src="/images/sojo/email.png" alt="" />
          </Socials>
        </TheMenu>
      </HeaderControls>
    </HeaderFrame>
  )
}
