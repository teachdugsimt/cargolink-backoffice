import React from 'react';
import { useTranslation } from 'react-i18next';
import { MyGoogleMap } from '../components';

const TestMap = () => {
    const { t } = useTranslation();
    return (
        <div style={{ flex: 1 }}>
            <MyGoogleMap />
        </div>
    );
};
export default TestMap;
