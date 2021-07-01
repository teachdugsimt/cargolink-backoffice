import React from 'react'
import images from '../components/Themes/images';
import menuItems from './menu-item'
import { navigate } from 'gatsby';
import { observer } from 'mobx-react-lite';
import { useMst } from '../stores/root-store';
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
  Footer,
  NavigationFooter,
} from '@atlaskit/side-navigation';
import Avatar, { AvatarItem } from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
// import LanguageMenu from '../components/language-menu';

const PrimaryLayout = observer(({ children, location }) => {
  const { loginStore } = useMst()

  return (
    <PageLayout>
      <Content>
        <LeftSidebar>
          <SideNavigation label="project">
            <NavigationHeader>
              <HeadingItem>
                <img src={images.cargolinkLogo} style={{ maxWidth: 200, height: 'auto' }} />
              </HeadingItem>
              <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <AvatarItem
                  primaryText={loginStore.data_profile?.fullName}
                  secondaryText={'Administrator'}
                  avatar={
                    <Avatar
                      name={'avatar'}
                      src="https://pbs.twimg.com/profile_images/568401563538841600/2eTVtXXO_400x400.jpeg"
                      size="large"
                      onClick={console.log}
                      presence={'online'}
                      label={'online'}
                    />
                  } />
                <DropdownMenu
                  trigger="" triggerType="button"
                  position="bottom right"
                >
                  <DropdownItemGroup>
                    <DropdownItem onMouseDown={(e) => {
                    }} description="View and edit your profile.">
                      Profile
                    </DropdownItem>
                    <DropdownItem onMouseDown={(e) => {
                      loginStore.requestLogout()
                    }}>Logout</DropdownItem>
                  </DropdownItemGroup>
                </DropdownMenu>
              </div>
            </NavigationHeader>

            <NestableNavigationContent>
              <Section>
                {
                  menuItems.map((e: any, i: number) => {
                    return <ButtonItem key={i}
                      isSelected={location.pathname.match(e.link.to)}
                      iconBefore={<img src={require('../images/icons/' + e.icon + '.png')} style={{ width: 20 }} />}
                      onClick={() => { navigate(e.link.to) }}
                    >
                      {e[`title_${loginStore.language}`]}
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
          <div style={{ padding: '0 40px' }}>
            {children}
          </div>
        </Main>
      </Content>
    </PageLayout >
  )
})

export default PrimaryLayout
