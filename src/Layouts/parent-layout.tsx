import React, { useEffect } from 'react'
import PrimaryLayout from './primary-layout';
import WhiteLayout from './white-layout';
import { observer } from 'mobx-react-lite';
import { useMst } from '../stores/root-store';
import { navigate } from 'gatsby';

const ParentLayout = observer(({ pageContext, children, location }) => {

  const { loginStore } = useMst();
  const token = loginStore.data_signin.accessToken

  if (token && token.length) {
    // IS LOGGED IN
    if (pageContext.layout == 'auth') {
      if (typeof window !== `undefined`) {
        navigate('/dashboard')
      }
      return <></>
    } else {
      return <PrimaryLayout location={location}>{children}</PrimaryLayout>
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
})

export default ParentLayout