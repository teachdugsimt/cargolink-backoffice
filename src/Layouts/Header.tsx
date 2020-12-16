import React from 'react';
import { Link } from 'gatsby';
import styled, { DefaultTheme } from 'styled-components';
import Select from '@paljs/ui/Select';
import { LayoutHeader } from '@paljs/ui/Layout';
import { EvaIcon } from '@paljs/ui/Icon';
// import { Button } from '@paljs/ui/Button';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { getPathReady } from './Sidebar';
import { Location } from '@reach/router';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '../components/languageMenu';

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown('sm')`
    .right{
      display: none;
    }
  `}
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
  .left {
    display: flex;
    align-items: center;
    .github {
      font-size: 18px;
      margin-right: 5px;
    }
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

interface HeaderProps {
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  changeDir: () => void;
  dir: 'rtl' | 'ltr';
}

const Header: React.FC<HeaderProps> = (props) => {
  console.log('Props header :: ', props);
  const { t, i18n } = useTranslation();

  const themeOptions = [
    {
      value: 'default',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#a6c1ff' }} />
          Default
        </Label>
      ),
    },
    {
      value: 'dark',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#192038' }} />
          Dark
        </Label>
      ),
    },
    {
      value: 'cosmic',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#5a37b8' }} />
          Cosmic
        </Label>
      ),
    },
    {
      value: 'corporate',
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: '#3366ff' }} />
          Corporate
        </Label>
      ),
      selected: true,
    },
  ];

  // function handleChangeLanguage(lng) {
  //   i18n.ns(lng)
  // }

  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        <Actions
          size="Medium"
          actions={[
            {
              icon: { name: 'menu-2-outline' },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link to="/" className="logo">
                  Umo
                </Link>
              ),
            },
            // {
            //   content: (
            //     <SelectStyled
            //       isSearchable={false}
            //       shape="SemiRound"
            //       placeholder="Themes"
            //       value={themeOptions.find((item) => item.value === props.theme.value)}
            //       options={themeOptions}
            //       onChange={({ value }: { value: DefaultTheme['name'] }) => props.theme.set(value)}
            //     />
            //   ),
            // },
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: <LanguageMenu></LanguageMenu>,
            },
            {
              content: (
                <Location>
                  {({ location }) => (
                    <ContextMenu
                      style={{ cursor: 'pointer' }}
                      placement="bottom"
                      currentPath={getPathReady(location.pathname)}
                      items={[
                        { title: 'Profile', link: { to: '/profile/Profile' } },
                        { title: 'Log out', link: { to: '/auth/login' } },
                      ]}
                      Link={Link}
                    >
                      <User color="#eee" name="Wirachai Khueankaew" title="Manger" size="Medium" />
                    </ContextMenu>
                  )}
                </Location>
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;
