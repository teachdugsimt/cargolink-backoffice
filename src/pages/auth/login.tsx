import React, { useEffect, useState, useRef } from 'react';
import { LoadingButton } from '@atlaskit/button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import { observer } from 'mobx-react-lite';
import { Link } from 'gatsby';
import { navigate } from 'gatsby';
import LanguageMenu from '../../components/language-menu';
import Auth, { Group } from '../../components/Auth';
import SEO from '../../components/SEO';
// import Spinner from '@paljs/ui/Spinner';
import Alert from '../../components/alert';
import { useMst } from '../../stores/root-store';
import { defaultAlertSetting } from '../../components/simple-data';
import { useTranslation } from 'react-i18next';
import TextField from '@atlaskit/textfield';
import Form, {
  ErrorMessage,
  Field,
  FormFooter,
  HelperMessage,
  ValidMessage,
} from '@atlaskit/form';

const Login: React.FC<{ pageContext: { layout: string } }> = observer(({ pageContext }) => {
  const { loginStore } = useMst();
  const { t } = useTranslation();

  // const submitRef = useRef<HTMLButtonElement | null>(null);

  // const [checkbox, setCheckbox] = useState({ 1: false });
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [toggle, setToggle] = useState(false);
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);
  // const [keyboard, setkeyboard] = useState('');

  // useEffect(() => {
  //   document.addEventListener('keydown', _handleKeyPress, false);
  //   return () => {
  //     document.removeEventListener('keydown', _handleKeyPress, false);
  //   };
  // }, []);
  useEffect(() => {
    loginStore.setErrorLogin('')
  }, [])

  useEffect(() => {
    const { fetching_login, error_login, data_signin } = loginStore;
    if (!fetching_login) {
      if (error_login && !data_signin.idToken) {
        console.log("ABCDEF")
        setAlertSetting({
          icon: 'error',
          show: true,
          type: 'general',
          title: '',
          content: error_login,
        });
      }
    }
  }, [loginStore.data_signin.idToken, loginStore.error_login, loginStore.fetching_login]);

  // const onChangeCheckbox = (value: boolean, name: number) => {
  //   // setCheckbox({ ...checkbox, [name]: value });
  //   console.log("On change check box :: ", value)
  //   loginStore.setRememberProfile(value)
  // };

  // const onChangeEmail = (value: string) => {
  //   setEmail(value);
  //   setToggle(false);
  //   setAlertSetting(defaultAlertSetting);
  // };

  // const onChangePassword = (value: string) => {
  //   setPassword(value);
  //   setToggle(false);
  //   setAlertSetting(defaultAlertSetting);
  // };

  const submit = ({ email, password }) => {
    // console.log(data)
    // e.preventDefault();
    // setToggle(true);
    if (email && password) {
      loginStore.requestLogin({
        email: email,
        password: password,
        // userType: 0,
      });
    }
    setAlertSetting(defaultAlertSetting);
  };

  // const clickSubmit = () => submitRef?.current?.click();

  // const _handleKeyPress = (event: KeyboardEvent) => {
  //   if (event.key === 'Enter' && submitRef) clickSubmit();
  // };

  return (
    <Auth title={t('login')} subTitle={t('loginSubtitle')}>
      {alertSetting.show && <Alert setting={alertSetting} />}
      <SEO title="Login" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <LanguageMenu />
      </div>
      <Form onSubmit={submit}>
        {({ formProps }) => (
          <form {...formProps}>
            <Field
              name="email"
              label={t('email')}
              defaultValue=""
              isRequired
            // validate={undefined}
            >
              {({ fieldProps, error, valid }) => (
                <>
                  <TextField {...fieldProps} />
                  {error === 'TOO_SHORT' && (
                    <ErrorMessage>
                      Invalid username, needs to be more than 4 characters
                    </ErrorMessage>
                  )}
                  {error === 'IN_USE' && (
                    <ErrorMessage>
                      Username already taken, try another one
                    </ErrorMessage>
                  )}
                </>
              )}
            </Field>

            <Field
              name="password"
              label={t('password')}
              defaultValue=""
              isRequired
            // validate={undefined}
            >
              {({ fieldProps, error, valid }) => (
                <>
                  <TextField {...fieldProps} type="password" />
                  {error === 'TOO_SHORT' && (
                    <ErrorMessage>
                      Invalid username, needs to be more than 4 characters
                    </ErrorMessage>
                  )}
                  {error === 'IN_USE' && (
                    <ErrorMessage>
                      Username already taken, try another one
                    </ErrorMessage>
                  )}
                </>
              )}
            </Field>
            {/* <Group> */}
            {/* <Checkbox checked={loginStore.rememberProfile} onChange={(value) => onChangeCheckbox(value, 1)}>
                {t('rememberMe')}
              </Checkbox> */}
            <Link id="forgotPassword" to="/auth/request-password" style={{ textDecoration: 'none' }}>
              {t('forgotPassword')}
            </Link>
            {/* </Group> */}

            <FormFooter>
              <LoadingButton appearance="warning" isLoading={loginStore.fetching_login} type="submit">
                {t('login')}
              </LoadingButton>
            </FormFooter>
          </form>
        )}
      </Form>

      {/* <form onSubmit={submit}>

        <InputGroup
          status={toggle && !email ? 'Danger' : 'Basic'}
          style={{ marginBottom: toggle && !email ? 0 : '2rem' }}
          fullWidth
        >
          <input
            autoFocus={true}
            id="phoneNumber"
            type="text"
            placeholder={t('email')}
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
          <Checkbox checked={loginStore.rememberProfile} onChange={(value) => onChangeCheckbox(value, 1)}>
            {t('rememberMe')}
          </Checkbox>
          <Link id="forgotPassword" to="/auth/request-password" style={{ textDecoration: 'none' }}>
            {t('forgotPassword')}
          </Link>
        </Group>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingButton appearance="warning" isLoading={loginStore.fetching_login} onClick={clickSubmit}>
            {t('login')}
          </LoadingButton>
        </div>
        <button style={{ display: 'none' }} ref={submitRef} type="submit" disabled={loginStore.fetching_login} /> */}
      {/* <Button
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
        </Button> */}
      {/* </form> */}
      {/* <p id="loginDescription">
        {t('loginDescription')}{' '}
        <Link to="/auth/register" style={{ textDecoration: 'none' }}>
          {t('register')}
        </Link>
      </p> */}
    </Auth>
  );
});

export default Login;
