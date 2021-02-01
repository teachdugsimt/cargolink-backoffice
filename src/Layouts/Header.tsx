import React from 'react';
import { Link } from 'gatsby';
import styled, { DefaultTheme } from 'styled-components';
import Select from '@paljs/ui/Select';
import { LayoutHeader } from '@paljs/ui/Layout';
// import { EvaIcon } from '@paljs/ui/Icon';
// import { Button } from '@paljs/ui/Button';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '@paljs/ui/ContextMenu';
import User from '@paljs/ui/User';
import { getPathReady } from './Sidebar';
import { Location } from '@reach/router';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '../components/language-menu';
import images from '../components/Themes/images';
import { Button } from '@paljs/ui/Button';
import { ic_menu } from 'react-icons-kit/md/ic_menu';
import { Icon } from 'react-icons-kit';

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

const StyleHeader = styled(LayoutHeader)`
  background: #253858;
  & header {
    padding-bottom: 0.5rem;
    text-align: center;
    display: flex;
    height: auto;
    button {
      font-size: 1.5rem;
      padding: 0.25rem 0.5rem;
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
  const { t, i18n } = useTranslation();

  return (
    <StyleHeader fixed>
      <HeaderStyle>
        <div style={{ display: 'flex' }}>
          <Actions
            size="Medium"
            actions={[
              {
                content: (
                  <a id="actions-menu" onClick={props.toggleSidebar} style={{ color: 'white' }}>
                    <Icon size={40} icon={ic_menu} />
                  </a>
                ),
              },
              {
                content: <div />,
              },
            ]}
          />
          <div className="header-logo">
            <img src={images.cargolinkLogo} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: <LanguageMenu />,
            },
            {
              content: (
                <Location>
                  {({ location }) => (
                    <ContextMenu
                      style={{ cursor: 'pointer', color: '#fff' }}
                      placement="bottom"
                      currentPath={getPathReady(location.pathname)}
                      items={[
                        { title: 'Profile', link: { to: '/profile' } },
                        { title: 'Log out', link: { to: '/auth/login' } },
                      ]}
                      Link={Link}
                    >
                      {/* <User color="#fff" name="Wirachai Khueankaew" title="Manger" size="Medium"/> */}
                      Wirachai Khueankaew
                    </ContextMenu>
                  )}
                </Location>
              ),
            },
          ]}
        />
      </HeaderStyle>
    </StyleHeader>
  );
};
export default Header;
