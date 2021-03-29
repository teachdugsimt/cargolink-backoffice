import React, { useState, useEffect } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from 'react-google-maps';
import Geocode from 'react-geocode';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
import { GoogleMapsAPI } from './client-config';
import { useTranslation } from 'react-i18next';
Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

interface location {
    lat?: number
    lng?: number
}
interface PropsGoogleMap {
    height?: string | number
    google?: any
    zoom?: number
    center?: location
    onAddressChange?: (address: any, region: any)  => void
}

interface PropsInitialState {
    address?: string
    city?: string
    area?: string
    state?: string
    mapPosition?: location
    markerPosition?: location
}

const initialState: any = {
    address: '',
    city: '',
    area: '',
    state: '',
    mapPosition: {
        lat: 13.736717, lng: 100.523186
    },
    markerPosition: {
        lat: 13.736717, lng: 100.523186
    },
}

let check_update = 0

export const GoogleMapWithSearch = (props: PropsGoogleMap) => {
    const { t, i18n } = useTranslation();
    Geocode.setLanguage(i18n.language);
    Geocode.setRegion(i18n.language);
    const { center, zoom, height, onAddressChange } = props
    const [{ address, city, area, state, mapPosition,
        markerPosition }, setState] = useState(initialState)

    const [reRender, setReRender] = useState(false)


    useEffect(() => {
        Geocode.fromLatLng(mapPosition.lat, mapPosition.lng).then(
            (response: any) => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = getCity(addressArray),
                    area = getArea(addressArray),
                    state = getState(addressArray);

                console.log('city', city, area, state);

                setState((prevState: PropsInitialState) => ({
                    ...prevState,
                    address: address ? address : '',
                    area: area ? area : '',
                    city: city ? city : '',
                    state: state ? state : '',
                }))
            },
            (error: any) => {
                console.error(error);
            },
        );
    }, [])

    useEffect(() => {

        if (check_update >= 1) {
            if (markerPosition.lat || address || city || area || state) {
                // setReRender(!reRender)
                onAddressChange(address, markerPosition)
            }
            // else if (center?.lat === center?.lat) {
            //     // setReRender(reRender)
            // }
        }
        check_update++

    }, [address, city, area, state,
        JSON.stringify(markerPosition),
        JSON.stringify(center)])

    const getCity = (addressArray: any) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    const getArea = (addressArray: any) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    const getState = (addressArray: any) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };

    const onChange = (event: any) => {
        setState((prevState: PropsInitialState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const onInfoWindowClose = () => { };

    const onMarkerDragEnd = (event: any) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        Geocode.fromLatLng(newLat, newLng).then(
            (response: any) => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = getCity(addressArray),
                    area = getArea(addressArray),
                    state = getState(addressArray);
                setState((prevState: PropsInitialState) => ({
                    ...prevState,
                    address: address ? address : '',
                    area: area ? area : '',
                    city: city ? city : '',
                    state: state ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng,
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng,
                    },
                }));
            },
            (error: any) => {
                console.error(error);
            },
        );
    };

    const onPlaceSelected = (place: any) => {
        console.log('plc', place);
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = getCity(addressArray),
            area = getArea(addressArray),
            state = getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.
        setState((prevState: PropsInitialState) => ({
            ...prevState,
            address: address ? address : '',
            area: area ? area : '',
            city: city ? city : '',
            state: state ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue,
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue,
            },
        }));
    };














    // console.log("Language :: ", i18n.language)
    // console.log("Address :: ", address)
    // console.log("City :: ", city)
    // console.log("Area :: ", area)
    // console.log("State :: ", state)
    // console.log("Map Position :: ", mapPosition)
    // console.log("Marker Position :: ", markerPosition)

    const AsyncMap: any = withScriptjs(
        withGoogleMap((props) => (
            <GoogleMap
                // google={google || new google.maps.DirectionsService()}
                // options={new google.maps.DirectionsService()}
                defaultZoom={zoom}
                defaultCenter={{ lat: mapPosition.lat, lng: mapPosition.lng }}
            >
                {/* InfoWindow on top of marker */}
                <InfoWindow
                    // onClose={onInfoWindowClose}
                    onCloseClick={onInfoWindowClose}
                    position={{ lat: (markerPosition?.lat || center?.lat) + 0.0018, lng: (markerPosition?.lng || center?.lng) }}
                >
                    <div>
                        <span style={{ padding: 0, margin: 0 }}>{address}</span>
                    </div>
                </InfoWindow>
                {/*Marker*/}
                <Marker
                    // google={google}
                    // name={'Dolores park'}
                    title={"CargoLink"}
                    // options={new google.maps.DirectionsService()}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
                />
                <Marker />
                {/* For Auto complete Search Box */}
                <ReactGoogleAutocomplete
                    style={{
                        width: '100%',
                        height: '40px',
                        paddingLeft: '16px',
                        marginTop: '2px',
                        marginBottom: '20px',
                    }}
                    onPlaceSelected={onPlaceSelected}
                    types={['(regions)']}
                />
            </GoogleMap>
        )),
    );
    let map;
    if (center?.lat !== undefined) {
        const lang = i18n.language || 'th'
        map = (
            <div>
                {/* <div>
                    <div className="form-group">
                        <span>{t('City')}</span>
                        <input
                            type="text"
                            name="city"
                            className="form-control"
                            onChange={onChange}
                            readOnly={true}
                            value={city}
                        />
                    </div>
                    <div className="form-group">
                        <span>{t('Area')}</span>
                        <input
                            type="text"
                            name="area"
                            className="form-control"
                            onChange={onChange}
                            readOnly={true}
                            value={area}
                        />
                    </div>
                    <div className="form-group">
                        <span>{t('State')}</span>
                        <input
                            type="text"
                            name="state"
                            className="form-control"
                            onChange={onChange}
                            readOnly={true}
                            value={state}
                        />
                    </div>
                    <div className="form-group">
                        <span>{t('Address')}</span>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            onChange={onChange}
                            readOnly={true}
                            value={address}
                        />
                    </div>
                </div> */}

                <AsyncMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places&language=${lang}&region=${lang}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: height }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        );
    } else {
        map = <div style={{ height: height }} />;
    }
    return map;
















}