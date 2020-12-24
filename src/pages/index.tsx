import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { LoginStore } from '../stores/login-store';

export default function Index() {
  const [token, setToken] = useState(true);

  useEffect(() => {
    if (!LoginStore.data_signin.idToken) {
      setToken(false);
    }
  }, [LoginStore.data_signin.idToken]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  }, [token]);

  return <div />;
}
