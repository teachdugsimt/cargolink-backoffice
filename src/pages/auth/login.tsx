import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useState } from 'react';
import { Link } from 'gatsby';

import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import { navigate } from 'gatsby';

export default function Login() {
  const [checkbox, setCheckbox] = useState({
    1: false,
  });
  const onChangeCheckbox = (value: boolean, name: number) => {
    // v will be true or false
    setCheckbox({ ...checkbox, [name]: value });
  };

  const submit = () => {
    navigate('/dashboard');
  };

  return (
    <Auth title="Login" subTitle="Hello! Login with your email">
      <SEO title="Login" />
      <form>
        <InputGroup fullWidth>
          <input type="email" placeholder="Email Address" />
        </InputGroup>
        <InputGroup fullWidth>
          <input type="password" placeholder="Password" />
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
