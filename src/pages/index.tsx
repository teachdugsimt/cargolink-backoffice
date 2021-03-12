import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { navigate } from 'gatsby';
import { useMst } from '../stores/root-store';

interface Props { }

const Index: React.FC<Props> = observer(() => {
  const { loginStore } = useMst();

  const [token, setToken] = useState(false);

  console.log("__________ Index In page :: _______________", loginStore.data_signin)
  useEffect(() => {
    if (loginStore.data_signin.idToken) {
      setToken(true);
    }
  }, [loginStore.data_signin.idToken]);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  }, [token]);

  return <div>
    <h1>Index page</h1>
  </div>;
});

export default Index;
