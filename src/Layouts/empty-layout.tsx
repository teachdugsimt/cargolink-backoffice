import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMst } from '../stores/root-store';
import { observer } from 'mobx-react-lite';
import MainLayout from './main-layout'
import Login from '../pages/auth/login'
import Register from '../pages/auth/register'
import RequestPassword from '../pages/auth/request-password'
import ResetPassword from '../pages/auth/reset-password'
import { navigate } from 'gatsby';
const EmptyLayout: React.FC<{ children: any, pageContext: any, custom404: any }> = observer(({ children, pageContext, custom404 }) => {
    const { loginStore } = useMst();

    const token = loginStore.data_signin.idToken
    // const loading_signin = loginStore.fetching_login
    const { key } = children
    console.log("children :: ", children)

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
                if (!loginStore.rememberProfile) {
                    localStore.clear();
                    _clearDataSignin()
                }
                cur = {};
            }
            cur[tabid] = set;
            localStore.setItem("tabs", JSON.stringify(cur));
        }

        update(1);
        window.onbeforeunload = () => update(0);
    }

    const _getPathFromChildren = (child: any) => {
        const normalPath = "/dashboard"
        const { key } = child
        let path = normalPath
        if (key && key != null) {
            const newKey = key.slice(0, key.length - 1)
            path = newKey.includes("/auth") ? normalPath : (newKey == "/" ? normalPath : newKey)
        }
        return path
    }

    useEffect(() => {
        // setTimeout(() => {
        if (token) {
            let path = _getPathFromChildren(children)
            // navigate(_getPathFromChildren(children)) 
        }
        else navigate('/auth/login');
        // }, 500);
    }, [loginStore.data_signin.idToken, key])

    useEffect(() => {
        _updateChecking()
    }, [])

    return (<MainLayout pageContext={pageContext} custom404={custom404}>{children}</MainLayout>);
});

export default EmptyLayout;
