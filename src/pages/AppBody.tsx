import React from 'react'
//import { Flex } from 'rebass'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  min-width: 600px;
  max-width: 600px;
  width: 100%;
  border-radius: 15px;
  background: linear-gradient(45deg,#0c0c0c52,transparent);
  box-shadow: 0 0 2px #ffffff59, 0 0 100px #0000001c, 0 0 100px #0000002e;
  backdrop-filter: blur(10px);
  @media only screen and (max-width: 720px) {
    min-width: 0px;
    max-width: 100%;
  }
`
const Trading = styled.div`
  position: relative;
  max-width: 250px;
  width: 100%;
  border-radius: 15px;
  background: linear-gradient(45deg,#0c0c0c52,transparent);
  box-shadow: 0 0 2px #ffffff59, 0 0 100px #0000001c, 0 0 100px #0000002e;
  backdrop-filter: blur(10px);
  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    font-weight: 100;
    color: #fff !important;
  }
  @media only screen and (max-width: 1400px) {
    display: none;
    height: 200px;
  }
`
const Wrapper = styled.div`
  display: flex;
  column-gap: 50px;
  min-width: 60vw;
  justify-content: center;
  @media only screen and (max-width: 1400px) {
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
    margin-top: -50px;
  }
  @media only screen and (max-width: 720px) {
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
    margin-top: 0;
    width: 90%;
  }
`
const Text = styled.h1`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 100%;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  opacity: 0.1;
`
/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <BodyWrapper>{children}</BodyWrapper>
      <Trading>
        <h2>Coming Soon...</h2>
        <Text>Live Trades</Text>
      </Trading>
    </Wrapper>
  )
}
