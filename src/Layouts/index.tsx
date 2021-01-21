import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import themes from './themes';
import { Layout, LayoutContent, LayoutFooter, LayoutContainer, LayoutColumns, LayoutColumn } from '@paljs/ui/Layout';
import icons from '@paljs/icons';
import { SidebarRefObject } from '@paljs/ui/Sidebar';
import Header from './Header';
import NotFound from '../pages/404';
import SimpleLayout from './simple-layout';
import SidebarCustom from './Sidebar';
import { withTrans } from '../i18n/withTrans';
import { Provider, rootStore } from '../stores/root-store';
import '../Layouts/css/style.css';

const getDefaultTheme = (): DefaultTheme['name'] => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as DefaultTheme['name'];
  } else {
    // const hours = new Date().getHours();
    // return hours > 6 && hours < 19 ? 'default' : 'dark';
    return 'default';
  }
};

const LayoutPage: React.FC<{ pageContext: { layout: string } }> = ({ custom404, children, pageContext }) => {
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const sidebarRef = useRef<SidebarRefObject>(null);

  const changeTheme = (newTheme: DefaultTheme['name']) => {
    setTheme(newTheme);
    typeof localStorage !== 'undefined' && localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const localTheme = getDefaultTheme();
    if (localTheme !== theme && theme === 'default') {
      setTheme(localTheme);
    }
  }, []);

  const changeDir = () => {
    const newDir = dir === 'ltr' ? 'rtl' : 'ltr';
    setDir(newDir);
  };

  return (
    <Provider value={rootStore}>
      <ThemeProvider theme={themes(theme, dir)}>
        <div>
          <SimpleLayout />
          <Layout evaIcons={icons} dir={dir} className={pageContext.layout === 'auth' ? 'auth-layout' : ''}>
            {pageContext.layout !== 'auth' && !custom404 && (
              <Header
                dir={dir}
                changeDir={changeDir}
                theme={{ set: changeTheme, value: theme }}
                toggleSidebar={() => sidebarRef.current?.toggle()}
              />
            )}
            <LayoutContainer>
              {pageContext.layout !== 'auth' && !custom404 && <SidebarCustom ref={sidebarRef} />}
              <LayoutContent>
                {custom404 ? (
                  <NotFound />
                ) : (
                  <LayoutColumns>
                    <LayoutColumn className="main-content">{children}</LayoutColumn>
                  </LayoutColumns>
                )}
                {pageContext.layout !== 'auth' && !custom404 && <LayoutFooter>Footer</LayoutFooter>}
              </LayoutContent>
            </LayoutContainer>
          </Layout>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default withTrans(LayoutPage);
