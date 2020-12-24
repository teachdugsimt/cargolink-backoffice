import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'gatsby';
import { navigate } from 'gatsby';

import Auth, { Group } from '../../components/auth';
import Socials from '../../components/auth/socials';
import SEO from '../../components/seo';
import Spinner from '@paljs/ui/Spinner';
import Alert from '../../components/alert';
import { useMst } from '../../stores/root-store';

const defaultAlertSetting = {
  icon: '',
  show: false,
  type: '',
  title: '',
  content: '',
};

const Login: React.FC<{ pageContext: { layout: string } }> = observer(({ pageContext }) => {
  const { loginStore } = useMst();

  const [checkbox, setCheckbox] = useState({ 1: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  useEffect(() => {
    if (pageContext.layout === 'auth') {
      loginStore.requestLogout();
    }
  }, [pageContext]);

  useEffect(() => {
    if (loginStore.error_login && !loginStore.data_signin.idToken) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: '',
        content: loginStore.error_login,
      });
    } else if (loginStore.data_signin.idToken && !loginStore.error_login) {
      navigate('/dashboard');
    }
  }, [loginStore.data_signin.idToken, loginStore.error_login]);

  const onChangeCheckbox = (value: boolean, name: number) => {
    // v will be true or false
    setCheckbox({ ...checkbox, [name]: value });
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
    setToggle(false);
    setAlertSetting(defaultAlertSetting);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
    setToggle(false);
    setAlertSetting(defaultAlertSetting);
  };

  const submit = () => {
    setToggle(true);
    if (email && password) {
      loginStore.requestLogin({
        loginId: email,
        password: password,
        userType: 0,
      });
    }
    setAlertSetting(defaultAlertSetting);
  };

  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
      <Alert setting={alertSetting} />
      <SEO title="Login" />
      <form>
        <InputGroup
          status={toggle && !email ? 'Danger' : 'Basic'}
          style={{ marginBottom: toggle && !email ? 0 : '2rem', marginTop: toggle && !email ? '2rem' : 0 }}
          fullWidth
        >
          <input
            type="email"
            placeholder="Phone Number"
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
          />
        </InputGroup>
        {toggle && !email ? (
          <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }}>
            * Please Input Phone Number Information
          </span>
        ) : null}
        <InputGroup
          status={toggle && !password ? 'Danger' : 'Basic'}
          style={{ marginBottom: toggle && !password ? 0 : '2rem', marginTop: toggle && !password ? '2rem' : 0 }}
          fullWidth
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
          />
        </InputGroup>
        {toggle && !password ? (
          <span style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }}>
            * Please Input Password Information
          </span>
        ) : null}
        <Group>
          <Checkbox checked={checkbox[1]} onChange={(value) => onChangeCheckbox(value, 1)}>
            Remember me
          </Checkbox>
          <Link to="/auth/request-password">Forgot Password?</Link>
        </Group>
        <Button
          style={{ position: loginStore.fetching_login ? 'relative' : 'initial' }}
          status="Success"
          type="button"
          shape="SemiRound"
          onClick={() => submit()}
          fullWidth
        >
          {loginStore.fetching_login ? (
            <div>
              <Spinner status="Basic">
                <span style={{ color: 'white' }}>Loading...</span>
              </Spinner>
              .
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </form>
      {/* <Socials /> */}
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
});

export default Login;
