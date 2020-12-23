import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'gatsby';

import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import { navigate } from 'gatsby';
import Alert from '@paljs/ui/Alert';
import { LoginStore } from '../../stores/login-store';

const Login = () => {
  const [checkbox, setCheckbox] = useState({ 1: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [keypassword, setKeyPassword] = useState(false);
  const [keyemail, setKeyEmail] = useState(false);
  const [keyemailpassword, setKeyEmailPassword] = useState(false);

  useEffect(() => {
    console.log('login :> ', LoginStore.loginData);
  }, []);

  console.log('out side :> ', LoginStore.data_signin);

  const onChangeCheckbox = (value: boolean, name: number) => {
    // v will be true or false
    setCheckbox({ ...checkbox, [name]: value });
  };

  const AlertLogin = () => {
    if (keypassword && !password) {
      return <Alert status="Danger">key password</Alert>;
    } else if (keyemail && !email) {
      return <Alert status="Danger">key email</Alert>;
    } else if (keyemailpassword && !email && !password) {
      return <Alert status="Danger">key email and password</Alert>;
    }
  };

  const submit = () => {
    setToggle(true);
    if (email && password) {
      LoginStore.requestLogin({
        loginId: email,
        password: password,
        userType: 0,
      });
      // navigate('/dashboard');
    }
  };

  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
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
            onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
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
        <Button status="Success" type="button" shape="SemiRound" onClick={() => submit()} fullWidth>
          Login
        </Button>
      </form>
      {/* <Socials /> */}
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
};

export default observer(Login);
