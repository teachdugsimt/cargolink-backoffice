import React from 'react'
import About from '../../components/NewProfile/About'
import { useTranslation } from "react-i18next"

const Profile = (props) => {
    const { t } = useTranslation()
    return (
        <>
            <h1>{t('profile')}</h1>
            <About />
        </>
    )
}
export default Profile