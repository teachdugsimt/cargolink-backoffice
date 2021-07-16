import React from 'react'

import { Icon } from 'react-icons-kit'
import { userCircleO } from 'react-icons-kit/fa/userCircleO'
import { phone } from 'react-icons-kit/fa/phone'
import { envelopeO } from 'react-icons-kit/fa/envelopeO'

import styled from 'styled-components'
import images from '../../Themes/images'

interface ProfileWidgetProps {
  fullname?: string | null | undefined
  telno?: string | null | undefined
  email?: string | null | undefined
}

function UserProfile(props: ProfileWidgetProps) {

  return (
    <>
      <Row>
        {/* <Icon icon={userCircleO} size={30} /> */}
        <img src={images.warehouse} style={{ width: 30, height: 30 }} />
        <h2 style={{ margin: 0, marginLeft: 10 }}>เจ้าของงาน</h2>
      </Row>
      <Row>
        <Icon icon={userCircleO} size={20} />
        <Col flex={1} style={{}}>
          {props.fullname || '-'}
        </Col>
      </Row>
      <Row>
        <Icon icon={phone} size={20} />
        <Col flex={1} style={{}}>
          {props.telno || '-'}
        </Col>
      </Row>
      <Row>
        <Icon icon={envelopeO} size={20} />
        <Col flex={1} style={{}}>
          {props.email || '-'}
        </Col>
      </Row>
    </>
  )
}

export default UserProfile

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Col = styled.div<{ flex: number }>`
  display: flex;
  flex: ${props => props.flex | 1};
  align-items: center;
  padding-left: 10px;
`;
