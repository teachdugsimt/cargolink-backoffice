import React, { useState, useRef, useEffect } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { withTrans } from '../i18n/withTrans';
import { Provider, rootStore } from '../stores/root-store';
import '../Layouts/css/style.css';
import ParentLayout from './parent-layout';
import { LiffProvider } from 'react-liff';

const liffId = process.env.LIFF_ID || "1656270808-MA5RQ8gL";
const stubEnabled = false;

const getDefaultTheme = (): DefaultTheme['name'] => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as DefaultTheme['name'];
  } else {
    // const hours = new Date().getHours();
    // return hours > 6 && hours < 19 ? 'default' : 'dark';
    return 'default';
  }
};

const LayoutPage: React.FC<{
  location: any,
  pageContext: { layout: string },
  custom404: any
}> = ({ custom404, children, pageContext, location }) => {
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const localTheme = getDefaultTheme();
    if (localTheme !== theme && theme === 'default') {
      setTheme(localTheme);
    }
    console.log('location', location)
  }, []);

  return (
    <LiffProvider liffId={liffId} stubEnabled={stubEnabled}>
      <Provider value={rootStore}>
        {/* <ThemeProvider theme={themes(theme, dir)}> */}
        {/* <EmptyLayout children={children} pageContext={pageContext} custom404={custom404} /> */}
        {/* </ThemeProvider> */}
        <ParentLayout pageContext={pageContext} location={location}>{children}</ParentLayout>
      </Provider>
    </LiffProvider>
  );
};

export default withTrans(LayoutPage);
