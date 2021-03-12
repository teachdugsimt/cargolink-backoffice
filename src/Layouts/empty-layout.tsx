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
    console.log("Page context @ emmptylayout :: ", children)

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

    const _getPathFromChildren = (child: any) => {
        const normalPath = "/dashboard"
        const { key } = child
        let path = normalPath
        if (key && key != null) {
            path = key.includes("/auth") ? normalPath : (key == "/" ? normalPath : key)
        }
        return path
    }

    useEffect(() => {
        console.log("________Use Effect Token _________ ,", children)
        setTimeout(() => {
            if (token) { navigate(_getPathFromChildren(children)) }
            else navigate('/auth/login');
        }, 500);
    }, [loginStore.data_signin.idToken])

    useEffect(() => {
        console.log("_________ Untrack Use Effect ___________")
        _updateChecking()
    }, [])


    // const _filterPath = (path: string) => {
    //     if (path.includes("/auth/login")) return <Login pageContext={{ layout: '/auth' }} />
    //     else if (path.includes("/auth/request-password")) return <RequestPassword />
    //     else if (path.includes("/auth/register")) return <Register />
    //     else if (path.includes("/auth/reset-password")) return <ResetPassword />
    //     else return <Login pageContext={{ layout: '/auth' }} />
    // }

    // const _navigatePath = (path: string) => {
    //     if (path.includes("/auth/login")) navigate('/autth/login')
    //     else if (path.includes("/auth/request-password")) navigate('/auth/request-password')
    //     else if (path.includes("/auth/register")) navigate("/auth/register")
    //     else if (path.includes("/auth/reset-password")) navigate("/auth/reset-password")
    //     else navigate('/autth/login')
    // }

    // if (!token) {
    //     console.log("Return LoginComponent :: ")
    //     // return (<Login pageContext={{ layout: '/auth' }} />);
    //     if (children?.key)
    //         return _filterPath(children.key)
    //     else return (<Login pageContext={{ layout: '/auth' }} />);
    // } else {
    return (<MainLayout pageContext={pageContext} custom404={custom404}>{children}</MainLayout>);
    // }
});

export default EmptyLayout;
