import React from 'react'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styled from 'styled-components'
import images from '../../Themes/images';

import { Icon } from 'react-icons-kit'
import { userCircleO } from 'react-icons-kit/fa/userCircleO'
import { phone } from 'react-icons-kit/fa/phone'
import moment from 'moment';

interface DeliverPoint {
  name: string | null | undefined
  dateTime: string | null | undefined
  contactName: string | null | undefined
  contactMobileNo: string | null | undefined
}

interface RouteWidgetProps {
  from: DeliverPoint | null | undefined
  to: Array<DeliverPoint> | null | undefined
}

function RouteWidget(props: RouteWidgetProps) {
  const { from, to } = props;
  return (
    <>
      <Row>
        <img src={images.compass} style={{ width: 34, height: 34 }} />
        <h2 style={{ margin: 0, marginLeft: 10 }}>การขนส่ง</h2>
      </Row>
      <Row>
        <Col flex={1}>
          <VerticalTimeline animate={true} layout={"1-column-left"}>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#018ECE', color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid #018ECE' }}
              date={moment(from?.dateTime, 'DD-MM-YYYY HH:mm').format('lll')}
              iconStyle={{ background: '#018ECE', color: '#fff' }}
              icon={<span>ขึ้น</span>}
            >
              <Row>
                <Address>{from?.name}</Address>
              </Row>
              <Row>
                <Icon icon={userCircleO} size={15} />
                <Col flex={1} style={{ marginLeft: 10, fontSize: 13 }}>
                  {from?.contactName || '-'}
                </Col>
              </Row>
              <Row>
                <Icon icon={phone} size={15} />
                <Col flex={1} style={{ marginLeft: 10, fontSize: 13 }}>
                  {from?.contactMobileNo || '-'}
                </Col>
              </Row>

            </VerticalTimelineElement>

            {
              to?.map(e => {
                return <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: '#FC544C', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid #FC544C' }}
                  date={moment(e.dateTime, 'DD-MM-YYYY HH:mm').format('lll')}
                  iconStyle={{ background: '#FC544C', color: '#fff' }}
                  icon={<span>ลง</span>}
                >
                  <Row>
                    <Address>{e.name}</Address>
                  </Row>
                  <Row>
                    <Icon icon={userCircleO} size={15} />
                    <Col flex={1} style={{ marginLeft: 10, fontSize: 13 }}>
                      {e?.contactName || '-'}
                    </Col>
                  </Row>
                  <Row>
                    <Icon icon={phone} size={15} />
                    <Col flex={1} style={{ marginLeft: 10, fontSize: 13 }}>
                      {e?.contactMobileNo || '-'}
                    </Col>
                  </Row>
                </VerticalTimelineElement>
              })
            }
          </VerticalTimeline>
        </Col>
      </Row>
    </>
  )
}

export default RouteWidget

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 3px;
`;

const Col = styled.div<{ flex: number }>`
  display: flex;
  flex: ${props => props.flex | 1};
  flex-direction: column;
  justify-content: center;
`;

const Address = styled.div`
  color: #fff;
  font-size: 15px;
`;

