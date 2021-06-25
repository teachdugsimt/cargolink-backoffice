import React from 'react'
import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
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
import images from '../components/Themes/images';
import menuItems from './menu-item'
import { navigate } from 'gatsby';

const PrimaryLayout = ({ children, location }) => {
  console.log(location)
  return (
    <PageLayout>
      <Content>
        <LeftSidebar>
          <SideNavigation label="project">
            <NavigationHeader>
              <HeadingItem>
                <img src={images.cargolinkLogo} style={{ maxWidth: 200, height: 'auto' }} />
              </HeadingItem>
            </NavigationHeader>

            <NestableNavigationContent>
              <Section>
                {
                  menuItems.map((e: any) => {
                    return <ButtonItem
                      isSelected={location.pathname.match(e.link.to)}
                      iconBefore={<img src={require('../images/icons/' + e.icon + '.png')} style={{ width: 20 }} />}
                      onClick={() => { navigate(e.link.to) }}
                    >
                      {e.title_th}
                    </ButtonItem>
                  })
                }
                {/* <NestingItem id="1" title="Filters">
                  <Section>
                    <ButtonItem>Search issues</ButtonItem>
                  </Section>
                </NestingItem> */}
              </Section>

            </NestableNavigationContent>
            <NavigationFooter>
              <Footer>CargoLink Backoffice</Footer>
            </NavigationFooter>
          </SideNavigation>
        </LeftSidebar>

        <Main>
          {children}
        </Main>
      </Content>
    </PageLayout >
  )
}

export default PrimaryLayout
