import React, { useEffect } from 'react'
import PrimaryLayout from './primary-layout';
import WhiteLayout from './white-layout';
import { observer } from 'mobx-react-lite';
import { useMst } from '../stores/root-store';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next/';
const ParentLayout = observer(({ pageContext, children, location }) => {
  console.log('PROPS::> LOCATION parent layout :: ', location)
  const { loginStore } = useMst();
  const { i18n } = useTranslation();
  const token = loginStore.data_signin.accessToken

  console.log('PAGE CONTEXT', pageContext)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('profileLanguage');
    if (savedLanguage) loginStore.setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const currentLanguage: string | undefined = i18n.language;
    if (currentLanguage != loginStore.language) i18n.changeLanguage(loginStore.language);
  }, [loginStore.language]);

  if (location?.search && location.search != "" && location.search.includes("liff")) {
    const queryString: string = decodeURIComponent(location.search).replace("?liff.state=", "");
    console.log(`🚀  ->  queryString`, queryString);
    if (typeof window !== `undefined`) {
      navigate(queryString)
    }
    return <></>
  }

  else if ((!location.search || location.search == '') && location?.pathname.includes("view/")) {
    return <WhiteLayout>{children}</WhiteLayout>
  }

  else {
    if (token && token.length) {
      // IS LOGGED IN
      if (pageContext.layout == 'auth') {
        if (typeof window !== `undefined`) {
          navigate('/dashboard')
        }
        return <></>
      } else if (pageContext.layout == 'doc') {
        return <WhiteLayout>{children}</WhiteLayout>
      } else {
        return <PrimaryLayout location={location}>
          {children}
        </PrimaryLayout>
      }
    } else {
      // IS NOT LOGGED IN
      if (!['auth', 'doc'].includes(pageContext.layout)) {
        if (typeof window !== `undefined`) {
          navigate('/auth/login')
        }
        return <></>
      } else {
        return <WhiteLayout>{children}</WhiteLayout>
      }
    }
  }
})

export default ParentLayout
