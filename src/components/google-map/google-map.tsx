import { observer } from 'mobx-react-lite';
import React from 'react';
import { GoogleMap, Marker, withGoogleMap, Polyline, InfoWindow } from 'react-google-maps';

interface GoogleMapProps {
  directions?: Array<
    Array<{
      lat: number;
      lng: number;
    }>
  >;
  coordinates?: Array<{
    contactMobileNo: string;
    contactName: string;
    dateTime: string;
    lat: string;
    lng: string;
    name: string;
  }>;
}

interface GoogleMapPureProps {
  coordinates?: Array<{
    contactMobileNo: string;
    contactName: string;
    dateTime: string;
    lat: string;
    lng: string;
    name: string;
  }>;
  directions?: Array<
    Array<{
      lat: number;
      lng: number;
    }>
  >;
  isMarkerShown?: boolean;
}

const GoogleMapPure = withGoogleMap((props: GoogleMapPureProps) => {
  const onClickMaker = (e: any) => {
    console.log('e :>> ', e);
  };

  const defaultLat = props.coordinates?.length ? +props.coordinates[0].lat : 13.736717;
  const defaultLng = props.coordinates?.length ? +props.coordinates[0].lng : 100.523186;
  return (
    <GoogleMap
      // defaultCenter={{ lat: defaultLat, lng: defaultLng, }}
      center={{ lat: defaultLat, lng: defaultLng }}
      defaultZoom={12}
    >
      {props.coordinates?.map((coordinate, index) => (
        <Marker key={index} position={{ lat: +coordinate.lat, lng: +coordinate.lng }} onClick={(e) => onClickMaker(e)}>
          <InfoWindow position={{ lat: +coordinate.lat, lng: +coordinate.lng }}>
            <div>
              <p>{coordinate.name}</p>
            </div>
          </InfoWindow>
        </Marker>
      ))}
      {props.directions?.map((direction, index) => {
        return (
          <Polyline
            key={index}
            path={direction}
            options={{
              strokeColor: '#ff2527',
              strokeOpacity: 0.75,
              strokeWeight: 4,
              // icons: [
              //     {
              //         icon: lineSymbol,
              //         offset: "0",
              //         repeat: "20px"
              //     }
              // ]
            }}
          />
        );
      })}
    </GoogleMap>
  );
});

export const MyGoogleMap = observer((props: GoogleMapProps) => {
  return (
    <div>
      <GoogleMapPure
        containerElement={<div style={{ height: `500px`, width: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
        directions={props.directions}
        coordinates={props.coordinates}
      />
    </div>
  );
});
