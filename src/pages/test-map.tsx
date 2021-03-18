import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMapWithSearch, Text } from '../components';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Alert from '../components/alert';
import { defaultAlertSetting } from '../components/simple-data';

const TestMap = (props: any) => {
    const { t } = useTranslation();
    const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

    // useEffect(() => {
    //     const { error_response } = carrierStore;
    //     if (error_response) {
    //       setAlertSetting({
    //         icon: 'error',
    //         show: true,
    //         type: 'general',
    //         title: error_response.title || '',
    //         content: error_response.content || '',
    //       });
    //     }
    //   }, [carrierStore.error_response]);

    let google_service = null
    if (typeof window !== undefined)
        google_service = new google.maps.DirectionsService()
    console.log("New google map Direction :; ", google_service)
    return (
        <Card size="Giant">
            <Alert setting={alertSetting} />
            <CardHeader>
                <Text tx={'selectLocation'} preset="title" />
            </CardHeader>
            <CardBody style={{ flex: 1, width: '100%', height: '100%' }}>
                {google_service != null && <GoogleMapWithSearch
                    google={new google.maps.DirectionsService()}
                    center={{ lat: 13.736717, lng: 100.523186 }}
                    height="400px"
                    zoom={15}
                />}
            </CardBody>
        </Card>
    );
};
export default TestMap;
