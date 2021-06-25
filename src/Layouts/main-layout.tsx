import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../stores/root-store';
// import '../Layouts/css/style.css';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { Layout, LayoutContent, LayoutFooter, LayoutContainer, LayoutColumns, LayoutColumn } from '@paljs/ui/Layout';
import SimpleLayout from './simple-layout';
import icons from '@paljs/icons';
import Header from './Header';
import { SidebarRefObject } from '@paljs/ui/Sidebar';
import SidebarCustom from './Sidebar';
import NotFound from '../pages/404';

import {
  Banner,
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  LeftPanel,
  RightPanel,
  TopNavigation,
} from '@atlaskit/page-layout';

import {
  SideNavigation,
  Section,
  NavigationHeader,
  HeadingItem,
  NestableNavigationContent,
  ButtonItem,
  NestingItem,
  Footer,
  NavigationFooter,
} from '@atlaskit/side-navigation';

const getDefaultTheme = (): DefaultTheme['name'] => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as DefaultTheme['name'];
  } else {
    // const hours = new Date().getHours();
    // return hours > 6 && hours < 19 ? 'default' : 'dark';
    return 'default';
  }
};

const MainLayout: React.FC<{ pageContext: any; custom404: any }> = observer(({ children, pageContext, custom404 }) => {
  const { loginStore } = useMst();
  const { i18n } = useTranslation();
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [theme, setTheme] = useState<DefaultTheme['name']>('default');
  const sidebarRef = useRef<SidebarRefObject>(null);

  useEffect(() => {
    i18n.changeLanguage(loginStore.language);
    const localTheme = getDefaultTheme();
    if (localTheme !== theme && theme === 'default') {
      setTheme(localTheme);
    }
  }, []);

  const changeTheme = (newTheme: DefaultTheme['name']) => {
    setTheme(newTheme);
    typeof localStorage !== 'undefined' && localStorage.setItem('theme', newTheme);
  };

  const changeDir = () => {
    const newDir = dir === 'ltr' ? 'rtl' : 'ltr';
    setDir(newDir);
  };

  return (
    <PageLayout>

      <Content testId="content">

        <LeftSidebar
          testId="leftSidebar"
          id="space-navigation"
          skipLinkTitle="Space Navigation"
          isFixed={false}
          width={125}
        >
          <SideNavigation label="project">
            <NavigationHeader>
              <HeadingItem><h1>NXTGen Industries</h1></HeadingItem>
              {/* <Heading mixin={typography.h100()}>h100</Heading> */}
            </NavigationHeader>
            <NestableNavigationContent>
              <Section>
                <ButtonItem>Your work</ButtonItem>
                <NestingItem id="1" title="Filters">
                  <Section>
                    <ButtonItem>Search issues</ButtonItem>
                  </Section>
                </NestingItem>
              </Section>
            </NestableNavigationContent>
            <NavigationFooter>
              <Footer>You're in a next-gen project</Footer>
            </NavigationFooter>
          </SideNavigation>

        </LeftSidebar>


        <Main testId="main" id="main" skipLinkTitle="Main Content">

        </Main>

      </Content>

    </PageLayout>
    // <div>
    //   <SimpleLayout />
    //   <Layout evaIcons={icons} dir={dir} className={pageContext.layout === 'auth' ? 'auth-layout' : ''}>
    //     {pageContext.layout !== 'auth' && !custom404 && (
    //       <Header
    //         dir={dir}
    //         changeDir={changeDir}
    //         theme={{ set: changeTheme, value: theme }}
    //         toggleSidebar={() => sidebarRef.current?.toggle()}
    //       />
    //     )}
    //     <LayoutContainer>
    //       {pageContext.layout !== 'auth' && !custom404 && <SidebarCustom ref={sidebarRef} />}
    //       <LayoutContent style={{ backgroundColor: '#fff' }}>
    //         {custom404 ? (
    //           <NotFound />
    //         ) : (
    //           <LayoutColumns>
    //             <LayoutColumn className="main-content">{children}</LayoutColumn>
    //           </LayoutColumns>
    //         )}
    //         {/* {pageContext.layout !== 'auth' && !custom404 && <LayoutFooter>Footer</LayoutFooter>} */}
    //       </LayoutContent>
    //     </LayoutContainer>
    //   </Layout>
    // </div>
  );
});

export default MainLayout;
