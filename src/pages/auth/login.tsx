import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'gatsby';
import { navigate } from 'gatsby';
import LanguageMenu from '../../components/language-menu';
import Auth, { Group } from '../../components/Auth';
import SEO from '../../components/SEO';
import Spinner from '@paljs/ui/Spinner';
import Alert from '../../components/alert';
import { useMst } from '../../stores/root-store';
import { defaultAlertSetting } from '../../components/simple-data';
import { useTranslation } from 'react-i18next';

const Login: React.FC<{ pageContext: { layout: string } }> = observer(({ pageContext }) => {
  const { loginStore } = useMst();
  const { t } = useTranslation();
  const [checkbox, setCheckbox] = useState({ 1: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  const [keyboard, setkeyboard] = useState('');

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
        loginId: email && email.includes('+66') ? email : '+66' + email,
        password: password,
        userType: 0,
      });
    }
    setAlertSetting(defaultAlertSetting);
  };

  const _handleKeyPress = (event: any) => {
    console.log('Event :: ', event);
    setkeyboard(event.key);
  };

  useEffect(() => {
    document.addEventListener('keydown', _handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', _handleKeyPress, false);
    };
  }, []);

  useEffect(() => {
    if (keyboard === 'Enter') {
      submit();
    }
  }, [keyboard]);

  return (
    <Auth title="" subTitle={t('loginSubtitle')}>
      <Alert setting={alertSetting} />
      <SEO title="Login" />
      <form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
          <LanguageMenu />
        </div>
        <InputGroup
          status={toggle && !email ? 'Danger' : 'Basic'}
          style={{ marginBottom: toggle && !email ? 0 : '2rem' }}
          fullWidth
        >
          <input
            id="phoneNumber"
            type="text"
            placeholder={t('phoneNumber')}
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
          />
        </InputGroup>
        {toggle && !email ? (
          <span id="loginError1" style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }}>
            * {t('loginError1')}
          </span>
        ) : null}
        <InputGroup
          status={toggle && !password ? 'Danger' : 'Basic'}
          style={{ marginBottom: toggle && !password ? 0 : '2rem', marginTop: toggle && !email ? '2rem' : 0 }}
          fullWidth
        >
          <input
            id="password"
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
          />
        </InputGroup>
        {toggle && !password ? (
          <span id="loginError2" style={{ color: '#ff3d71', marginLeft: 10, fontSize: 'small' }}>
            * {t('loginError2')}
          </span>
        ) : null}
        <Group>
          <Checkbox checked={checkbox[1]} onChange={(value) => onChangeCheckbox(value, 1)}>
            {t('rememberMe')}
          </Checkbox>
          <Link id="forgotPassword" to="/auth/request-password" style={{ textDecoration: 'none' }}>
            {t('forgotPassword')}
          </Link>
        </Group>
        <Button
          style={{
            position: loginStore.fetching_login ? 'relative' : 'initial',
            backgroundColor: '#00b132',
            borderColor: '#00b132',
          }}
          id="login"
          status="Success"
          type="button"
          shape="SemiRound"
          onClick={() => submit()}
          fullWidth
        >
          {loginStore.fetching_login ? (
            <div>
              <Spinner status="Basic">
                <span style={{ color: 'white' }}>{t('loding')}</span>
              </Spinner>
              .
            </div>
          ) : (
            `${t('login')}`
          )}
        </Button>
      </form>
      <p id="loginDescription">
        {t('loginDescription')}{' '}
        <Link to="/auth/register" style={{ textDecoration: 'none' }}>
          {t('register')}
        </Link>
      </p>
    </Auth>
  );
});

export default Login;
