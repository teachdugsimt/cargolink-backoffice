import React, { useEffect } from 'react'
import PrimaryLayout from './primary-layout';
import WhiteLayout from './white-layout';
import { observer } from 'mobx-react-lite';
import { useMst } from '../stores/root-store';
import { navigate } from 'gatsby';

const ParentLayout = observer(({ pageContext, children }) => {

  const { loginStore } = useMst();
  const token = loginStore.data_signin.accessToken

  if (token && token.length) {
    // IS LOGGED IN
    if (pageContext.layout == 'auth') {
      navigate('/dashboard')
      return
    } else {
      return <PrimaryLayout>{children}</PrimaryLayout>
    }
  } else {
    // IS NOT LOGGED IN
    if (!['auth', 'doc'].includes(pageContext.layout)) {
      navigate('/auth/login')
    } else {
      return <WhiteLayout>{children}</WhiteLayout>
    }
  }
})

export default ParentLayout
