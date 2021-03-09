import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutHeader } from '@paljs/ui/Layout';
import { Actions } from '@paljs/ui/Actions';
import ContextMenu from '../Layouts/Sidebar/ContextMenu';
import Button from '@material-ui/core/Button';
import { getPathReady } from './Sidebar';
import { Location } from '@reach/router';
import { breakpointDown } from '@paljs/ui/breakpoints';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '../components/language-menu';
import images from '../components/Themes/images';
import { ic_menu } from 'react-icons-kit/md/ic_menu';
import { Icon } from 'react-icons-kit';
import { observer } from 'mobx-react-lite';
import { useMst } from '../stores/root-store';

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
interface HeaderProps {
  toggleSidebar: () => void;
  theme: {
    set: (value: DefaultTheme['name']) => void;
    value: DefaultTheme['name'];
  };
  changeDir: () => void;
  dir: 'rtl' | 'ltr';
}

const Header: React.FC<HeaderProps> = observer((props) => {
  const { t, i18n } = useTranslation();
  const { loginStore } = useMst();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const data_profile = JSON.parse(JSON.stringify(loginStore.data_profile));
    console.log('profile:>>', data_profile);
    if (data_profile) {
      setProfile(data_profile);
    }
  }, [loginStore.data_profile]);

  return (
    <StyleHeader fixed>
      <HeaderStyle>
        <div style={{ display: 'flex' }}>
          <Actions
            size="Medium"
            actions={[
              {
                content: (
                  <Button id="actions-menu" onClick={props.toggleSidebar} style={{ padding: 0, color: 'white' }}>
                    <Icon size={40} icon={ic_menu} />
                  </Button>
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
                        {
                          title_th: 'ข้อมูลผู้ใช้งาน',
                          title_en: 'Profile',
                          link: { to: '/profile' },
                          icon: 'user',
                        },
                        {
                          title_th: 'ออกจากระบบ',
                          title_en: 'Log out',
                          link: { to: '/auth/login' },
                          icon: 'signOut',
                        },
                      ]}
                      Link={Link}
                    >
                      {/* <User color="#fff" name="Wirachai Khueankaew" title="Manger" size="Medium"/> */}
                      {profile && profile.lastName && profile.firstName
                        ? profile.firstName + ' ' + profile.lastName
                        : 'No data'}
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
});
export default Header;
