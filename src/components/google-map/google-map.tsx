import React from 'react'
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps"
import styled from 'styled-components'

const ContainerMap = styled.div`
    minHeight: 50vh;
    maxHeight: 80vh;
    height: 65vh;
`

const GoogleMapPure = withGoogleMap((props: any) => {
    return <GoogleMap
        defaultCenter={{ lat: 13.736717, lng: 100.523186, }}
        defaultZoom={8}
    >
        {props.isMarkerShown && <Marker position={{ lat: 13.736717, lng: 100.523186, }} />}
    </GoogleMap>
})

export const MyGoogleMap = (props: any) => {
    return <GoogleMapPure
            containerElement={<div style={{ flex: 1, height: '100%', width: '100%' }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
}