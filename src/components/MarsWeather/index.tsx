import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
const WeatherWrapperFloat = styled.div`
  position: absolute;
  top: 220px;
  left: 10px;
  img {
    width: 100px;
    position: absolute;
    z-index: 1;
    top: -70px;
    left: 0;
    filter: drop-shadow(0px 0px 4px #ffffff50);
  }

  @media only screen and (max-width: 960px) {
    position: absolute;
    top: 30px;
    right: 10px;
    left: auto;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50px;
      position: absolute;
      z-index: 1;
      top: 50%;
      left: -50px;
      -webkit-filter: drop-shadow(0px 0px 4px #ffffff50);
      filter: drop-shadow(0px 0px 4px #ffffff50);
      transform: translateY(-50%);
    }
  }
  @media only screen and (max-width: 650px) {
    img {
      right: 0;
      left: auto;
      z-index: -1;
      opacity: 0.06;
      filter: brightness(100);
      width: 100px;
    }
  }
`

const WeatherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(45deg, #00000080, #00000040);
  box-shadow: 0 0 2px #ffffff59, 0 0 10px inset #00000080;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px;
  @media only screen and (max-width: 960px) {
    padding: 7px 30px;
  }
  @media only screen and (max-width: 650px) {
    padding: 7px 12px;
    overflow: hidden;
  }
`
const TextWrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
  @media only screen and (max-width: 650px) {
    font-size: 10px;
  }
`

const TextWrapperHeader = styled(TextWrapper)`
  font-size: 16px;
  font-weight: 600;
  font-style: normal;
  @media only screen and (max-width: 650px) {
    font-size: 12px;
  }
`

type ApiQuery = {
  sol: number
  high: number
  low: number
  date: string
  lastRetrieved: number
}

const TIME_INTERVAL_BETWEEN_CHECKS = 21600 //6 hours in seconds

const useSavedApiQuery = () => {
  const [state, setState] = useState<ApiQuery | null>(null)
  const [loading, setLoading] = useState(true)
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  useEffect(() => {
    const v = localStorage.getItem('sojo/weather')
    if (v) {
      const obj = JSON.parse(v)
      setState(obj)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('sojo/weather', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (loading) return
    if (!state || currentTimeInSeconds - state.lastRetrieved > TIME_INTERVAL_BETWEEN_CHECKS) {
      console.log('Retrieving mars weather')
      setLoading(true)
      fetch('https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json')
        .then(x => x.json())
        .then(x => {
          setLoading(false)
          const item = x.soles[0]
          const obj: ApiQuery = {
            sol: item.sol,
            low: item.min_temp,
            high: item.max_temp,
            date: item.terrestrial_date,
            lastRetrieved: currentTimeInSeconds
          }
          setState(obj)
        })
        .catch(e => {
          setLoading(false)
          console.error(e)
        })
    }
  }, [currentTimeInSeconds, loading, state])

  return state
}

const LoadingWrapper: React.FC<{ value: any }> = ({ children, value }) => {
  if (value) {
    return <>{children}</>
  } else {
    return (
      <>
        <TextWrapper>Loading...</TextWrapper>
      </>
    )
  }
}

export const MarsWeather = () => {
  const query = useSavedApiQuery()
  const date = query ? new Date(query.date).toLocaleDateString() : ''
  return (
    <WeatherWrapperFloat>
      <WeatherWrapper>
        <img src="/images/sojo/weather.png" alt="" />
        <TextWrapperHeader>Martian Weather</TextWrapperHeader>
        <LoadingWrapper value={query}>
          <TextWrapper>
            Sol {query?.sol} ({date})
          </TextWrapper>
          <TextWrapper>High: {query?.high}°C</TextWrapper>
          <TextWrapper>High: {query?.low}°C</TextWrapper>
        </LoadingWrapper>
      </WeatherWrapper>
    </WeatherWrapperFloat>
  )
}
