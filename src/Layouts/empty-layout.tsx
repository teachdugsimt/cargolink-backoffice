import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMst } from '../stores/root-store';
import { observer } from 'mobx-react-lite';
import MainLayout from './main-layout'
import Login from '../pages/auth/login'
import { navigate } from 'gatsby';

const EmptyLayout: React.FC<{ pageContext: any, custom404: any }> = observer(({ children, pageContext, custom404 }) => {
    const { loginStore } = useMst();

    const token = loginStore.data_signin.idToken
    // const loading_signin = loginStore.fetching_login

    
    const _clearDataSignin = () => {
        loginStore.requestLogout();
        navigate('/auth/login');
    }

    const _updateChecking = () => {
        const localStore = localStorage
        const session = sessionStorage

        const tabid = session.getItem("mySession") || (newid => session.setItem("mySession", newid) || newid)((Math.random() * 1e8).toFixed())
        const update = (set: any) => {
            let cur = JSON.parse(localStore.getItem("tabs") || '{}');
            if (set && typeof cur[tabid] == 'undefined' && !Object.values(cur).reduce((a: any, b: any) => a + b, 0)) {
                localStore.clear();
                _clearDataSignin()
                cur = {};
            }
            cur[tabid] = set;
            localStore.setItem("tabs", JSON.stringify(cur));
        }

        update(1);
        window.onbeforeunload = () => update(0);
    }

    useEffect(() => {
        _updateChecking()
    }, [])

    useEffect(() => {
        if (token) { navigate('/dashboard') }
        else navigate('/auth/login');
    }, [token])

    if (!token) {
        return (<Login pageContext={{ layout: 'auth' }} />);
    } else {
        return (<MainLayout pageContext={pageContext} custom404={custom404}>{children}</MainLayout>);
    }
});

export default EmptyLayout;
