import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import { breakpointDown } from '@paljs/ui/breakpoints';
import React from 'react';
import { withTrans } from '../../i18n/withTrans';
import images from '../Themes/images';

const AuthStyle = styled.div<{ subTitle?: string }>`
  margin: auto;
  display: block;
  width: 100%;
  max-width: 35rem;
  a {
    font-weight: 600;
  }
  & > h1 {
    margin-bottom: ${({ subTitle }) => (subTitle ? '0.75' : '2')}rem;
    margin-top: 0;
    text-align: center;
  }
  & > p {
    margin-bottom: 2rem;
    text-align: center;
  }
  form {
    width: 100%;
    & > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
`;
export const Group = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardAuth = styled(Card)`
  box-shadow: none !important;
  margin-bottom: 0;
  height: calc(100vh - 5rem);
  ${breakpointDown('sm')`
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;
interface AuthProps {
  title: string;
  subTitle?: string;
}
const Auth: React.FC<AuthProps> = ({ subTitle, title, children }) => {
  return (
    <CardAuth>
      <CardBody>
        <AuthStyle subTitle={subTitle}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 200 }}>
              <img src={images.logo} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
          <h1 id="title">{title}</h1>
          {subTitle && <p id="subTitle">{subTitle}</p>}
          {children}
        </AuthStyle>
      </CardBody>
    </CardAuth>
  );
};
export default withTrans(Auth);
