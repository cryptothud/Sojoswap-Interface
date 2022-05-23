import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween } from '../Row'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.text2};
`

const SwapText = styled.div`
box-sizing: border-box;
margin: 0;
min-width: 0;
font-weight: 500;
color: #fff !important;
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwapText>Swap</SwapText>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
