import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState } from 'react';
import { Link } from 'gatsby';

import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import { navigate } from 'gatsby';
import Alert from '@paljs/ui/Alert';

export default function Login() {
  const [checkbox, setCheckbox] = useState({
    1: false,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keypassword, setKeyPassword] = useState(false);
  const [keyemail, setKeyEmail] = useState(false);
  const [keyemailpassword, setKeyEmailPassword] = useState(false);
  const onChangeCheckbox = (value: boolean, name: number) => {
    // v will be true or false
    setCheckbox({ ...checkbox, [name]: value });
  };

  console.log('email', email);
  console.log('password', password);

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
    if (email && password) {
      navigate('/dashboard');
    } else if (email && !password) {
      console.log('key password');
      setKeyPassword(true);
    } else if (!email && password) {
      console.log('key email');
      setKeyEmail(true);
    } else {
      console.log('key email and password');
      setKeyEmailPassword(true);
    }
  };

  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
      <SEO title="Login" />
      <form>
        {keyemail && !email ? (
          <span style={{ color: 'red' }}>Please Input Email Information</span>
        ) : keyemailpassword && !email ? (
          <span style={{ color: 'red' }}>Please Input Email Information</span>
        ) : null}
        <InputGroup fullWidth>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            style={{
              borderColor: keyemail && !email ? 'red' : keyemailpassword && !email ? 'red' : '',
            }}
            onChange={(event) => setEmail(event.target.value)}
          />
        </InputGroup>
        {keypassword && !password ? (
          <span style={{ color: 'red' }}>Please Input password Information</span>
        ) : keyemailpassword && !password ? (
          <span style={{ color: 'red' }}>Please Input password Information</span>
        ) : null}
        <InputGroup fullWidth>
          <input
            type="password"
            placeholder="Password"
            value={password}
            style={{
              borderColor: keypassword && !password ? 'red' : keyemailpassword && !password ? 'red' : '',
            }}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputGroup>
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
      <Socials />
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
}
