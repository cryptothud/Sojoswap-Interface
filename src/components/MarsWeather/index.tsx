import styled from "styled-components"
import React, { useEffect, useState } from 'react'
const WeatherWrapperFloat = styled.div`
position: fixed;
top: 25%;
left: 20px;
`

const WeatherWrapper = styled.div`
background: rgba(100,100,100,0.6);
border-radius: 20px;
border: 1px solid black;
padding: 20px;
display: flex;
flex-direction: column;
flex-wrap: wrap;
align-items: center;
justify-content: center;
color: white;
`
const TextWrapper = styled.div`
flex-grow: 1;
flex-shrink: 0;
`

const TextWrapperHeader = styled(TextWrapper)`
font-size: 20px;
`

type ApiQuery = {
    sol: number,
    high: number,
    low: number,
    date: string,
    lastRetrieved: number
}

const TIME_INTERVAL_BETWEEN_CHECKS = 21600; //6 hours in seconds

const useSavedApiQuery = () => {
    const [state, setState] = useState<ApiQuery | null>(null)
    const [loading, setLoading] = useState(true);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    useEffect(() => {
        const v = localStorage.getItem("sojo/weather")
        if (v) {
            const obj = JSON.parse(v);
            setState(obj);
        }

        setLoading(false);
    }, [])

    useEffect(() => {
        localStorage.setItem('sojo/weather', JSON.stringify(state))
    }, [state])

    useEffect(() => {
        if (loading) return;
        if (!state || currentTimeInSeconds - state.lastRetrieved > TIME_INTERVAL_BETWEEN_CHECKS) {
            console.log("Retrieving mars weather")
            setLoading(true);
            fetch('https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json').then((x) => x.json()).then(x => {
                setLoading(false);
                const item = x.soles[0]
                const obj: ApiQuery = {
                    sol: item.sol,
                    low: item.min_temp,
                    high: item.max_temp,
                    date: item.terrestrial_date,
                    lastRetrieved: currentTimeInSeconds
                }
                setState(obj)
            }).catch((e) => {
                setLoading(false)
                console.error(e)
            })
        }
    }, [currentTimeInSeconds, loading, state])

    return state;
}

const LoadingWrapper: React.FC<{ value: any }> = ({ children, value }) => {
    if (value) {
        return (<>
            {children}
        </>)
    } else {
        return (<>
            <TextWrapper>Loading...</TextWrapper>
        </>)
    }
}

export const MarsWeather = () => {

    const query = useSavedApiQuery()
    const date = query ? new Date(query.date).toLocaleDateString() : ""
    return <WeatherWrapperFloat>
        <WeatherWrapper>
            <TextWrapperHeader>Martian Weather</TextWrapperHeader>
            <LoadingWrapper value={query}>
                <TextWrapper>Sol {query?.sol} ({date})</TextWrapper>
                <TextWrapper>High: {query?.high}°C</TextWrapper>
                <TextWrapper>High: {query?.low}°C</TextWrapper>
            </LoadingWrapper>
        </WeatherWrapper>
    </WeatherWrapperFloat>
}