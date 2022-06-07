import React from 'react'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Container = styled.div`
  position: relative;
  z-index: 10000;
  width: 60vw;
  display: flex;
  flex-wrap: wrap;
  row-gap: 30px;
  column-gap: 30px;
  justify-content: center;
  align-items: center;
  margin: 0 100px 0 auto;
  @media only screen and (max-width: 1650px) {
    width: 75vw;
  }
  @media only screen and (max-width: 1100px) {
    width: 90vw;
  }
`
const TheCard = styled.a`
  width: 40%;
  min-height: 250px;
  background: linear-gradient(45deg, #00000080, #00000040);
  box-shadow: 0 0 2px #ffffff59, 0 0 10px inset #00000080;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: not-allowed;
  transition: 0.4s ease-in-out;
  text-decoration: none;
  color: #fff;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    z-index: -1;
    transform: rotate(45deg);
    right: 0;
    bottom: -30%;
    filter: invert(1);
    opacity: 0.06;
    transition: 1s ease-in-out;
  }
  &:hover {
    transform: translateY(-6px);
    filter: brightness(1.2);
    background: linear-gradient(45deg, #00000040, #00000080);
    box-shadow: 0 0 30px #ffffff40, 0 0 10px inset #00000080;
    img {
      transform: rotate(45deg) rotateY(-180deg);
    }
  }
  h1 {
    font-weight: 800;
    font-size: 32px;
    color: #e1e1e1;
  }
  h2 {
    font-weight: 200;
    font-size: 16px;
    color: #e1e1e199;
  }
  h3 {
    font-weight: 600;
    font-size: 16px;
    text-decoration: underline;
    color: #e1e1e1;
    background: #0000001a;
    margin-right: auto;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 0 10px inset #00000045;
  }
  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`
const Card = styled(NavLink)`
  width: 40%;
  min-height: 250px;
  background: linear-gradient(45deg, #00000080, #00000040);
  box-shadow: 0 0 2px #ffffff59, 0 0 100px #0000001c, 0 0 100px #0000002e;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: 0.4s ease-in-out;
  text-decoration: none;
  color: #fff;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    z-index: -1;
    transform: rotate(45deg);
    right: 0;
    bottom: -30%;
    filter: invert(1);
    opacity: 0.06;
    transition: 1s ease-in-out;
  }
  &:hover {
    transform: translateY(-6px);
    filter: brightness(1.2);
    background: linear-gradient(45deg, #00000040, #00000080);
    box-shadow: 0 0 30px #ffffff40;
    img {
      transform: rotate(45deg) rotateY(-180deg);
    }
  }
  h1 {
    font-weight: 800;
    font-size: 32px;
    color: #e1e1e1;
  }
  h2 {
    font-weight: 200;
    font-size: 16px;
    color: #e1e1e199;
  }
  h3 {
    font-weight: 600;
    font-size: 16px;
    text-decoration: underline;
    color: #e1e1e1;
    background: #0000001a;
    margin-right: auto;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 0 10px inset #00000045;
  }
  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`
/*
const DisabledCard = styled.div`
  width: 40%;
  min-height: 250px;
  background: linear-gradient(45deg, #00000020, #00000010);
  box-shadow: 0 0 2px #ffffff59, 0 0 10px inset #00000030;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: 0.4s ease-in-out;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    z-index: -1;
    transform: rotate(45deg);
    right: 0;
    bottom: -30%;
    filter: invert(1);
    opacity: 0.06;
    transition: 1s ease-in-out;
  }
  &:hover {
    transform: translateY(-6px);
    filter: brightness(1.2);
    background: linear-gradient(45deg, #00000040, #00000080);
    box-shadow: 0 0 30px #ffffff40;
    img {
      transform: rotate(45deg) rotateY(-180deg);
    }
  }
  a {
    text-decoration: none;
    color: #fff;
    cursor: not-allowed;
  }
  h1 {
    font-weight: 800;
    font-size: 32px;
    cursor: not-allowed;
    color: #e1e1e170;
  }
  h2 {
    font-weight: 200;
    font-size: 16px;
    color: #e1e1e140;
    cursor: not-allowed;
  }
  h3 {
    color: #e1e1e170;
    font-weight: 600;
    font-size: 16px;
    text-decoration: underline;
    cursor: not-allowed;
    background: #0000001a;
    margin-right: auto;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 0 10px inset #00000025;
  }
  cursor: not-allowed;
  opacity: 0.8;
  @media only screen and (max-width: 800px) {
    width: 100%;
  }
`
*/

export default function Home({ history }: RouteComponentProps) {
  return (
    <>
      <SwapPoolTabs active={'/'} />
      <Container>
        <Card to={'/swap'}>
          <img src="https://img.icons8.com/glyph-neue/344/swap.png" alt="" />
          <div>
            <h1>Swap</h1>
            <h2>Swap your way to Mars! Trade tokens for other tokens.</h2>
          </div>
          <h3>Swap Now {'→'}</h3>
        </Card>
        <Card to={'/pool'}>
          <img
            src="https://img.icons8.com/external-phatplus-solid-phatplus/344/external-liquidity-global-crisis-phatplus-solid-phatplus.png"
            alt=""
          />
          <div>
            <h1>Launchpad</h1>
            <h2>Add liquidity to create your own Martian project!</h2>
          </div>
          <h3>Add Liquidity {'→'}</h3>
        </Card>
        <TheCard>
          <img src="https://img.icons8.com/ios/344/safe.png" alt="" />
          <div>
            <a>
              <h1>Vault</h1>
            </a>
            <h2>View current ledger of gold in storage.</h2>
          </div>
          <h3>Enter Vault {'→'}</h3>
        </TheCard>
        <TheCard>
          <img src="https://img.icons8.com/ios-filled/344/treasure-chest.png" alt="" />
          <div>
            <a>
              <h1>FarmUp</h1>
            </a>
            <h2>Purchase treasury notes, backed by physical gold and earn royalties.</h2>
          </div>
          <h3>Purchase Now {'→'}</h3>
        </TheCard>
        <TheCard>
          <img src="https://img.icons8.com/material/344/bullish--v1.png" alt="" />
          <div>
            <a>
              <h1>MetaVerse</h1>
            </a>
            <h2>Terraform Mars by purchasing NFT land plots.</h2>
          </div>
          <h3>Provide Now {'→'}</h3>
        </TheCard>
        <TheCard>
          <img src="https://img.icons8.com/pastel-glyph/344/nft-node--v1.png" alt="" />
          <div>
            <a>
              <h1>NFTs</h1>
            </a>
            <h2>Digital art marketplace</h2>
          </div>
          <h3>Visit Marketplace {'→'}</h3>
        </TheCard>
        <TheCard>
          <img
            src="https://img.icons8.com/external-glyph-wichaiwi/344/external-business-business-glyph-wichaiwi-10.png"
            alt=""
          />
          <div>
            <a>
              <h1>Claim Tokens</h1>
            </a>
            <h2>Connect your wallet to claim your rewards.</h2>
          </div>
          <h3>Claim Tokens {'→'}</h3>
        </TheCard>
        <TheCard>
          <img src="https://img.icons8.com/ios-filled/344/dots-loading--v2.png" alt="" />
          <div>
            <a>
              <h1>SOJO Disperse</h1>
            </a>
            <h2>Airdrop tokens across the solar system.</h2>
          </div>
          <h3>Airdrop Now {'→'}</h3>
        </TheCard>
      </Container>
    </>
  )
}
