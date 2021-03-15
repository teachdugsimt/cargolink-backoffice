import React from 'react'
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps"

const GoogleMapPure = withGoogleMap((props: any) => {
    return <GoogleMap
        defaultCenter={{ lat: 13.736717, lng: 100.523186, }}
        defaultZoom={8}
    >
        {props.isMarkerShown && <Marker position={{ lat: 13.736717, lng: 100.523186, }} />}
    </GoogleMap>
})

export const MyGoogleMap = (props: any) => {
    return <div>
        <GoogleMapPure
            containerElement={<div style={{ height: `500px`, width: '500px' }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    </div>
}