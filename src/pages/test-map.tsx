import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMapWithSearch, Text } from '../components';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Alert from '../components/alert';
import { defaultAlertSetting } from '../components/simple-data';

const TestMap = (props: any) => {
  const { t } = useTranslation();
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

    return (
        <Card size="Giant">
            <Alert setting={alertSetting} />
            <CardHeader>
                <Text tx={'selectLocation'} preset="title" />
            </CardHeader>
            <CardBody style={{ flex: 1, width: '100%', height: '100%' }}>
                {/* <GoogleMapWithSearch
                    center={{ lat: 13.736717, lng: 100.523186 }}
                    height="400px"
                    zoom={15}
                /> */}
            </CardBody>
        </Card>
    );
};
export default TestMap;