import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styled from 'styled-components';
import images from '../../Themes/images';
import { useTranslation } from 'react-i18next';
import Button from '@atlaskit/button';

import { Icon } from 'react-icons-kit';
import { userCircleO } from 'react-icons-kit/fa/userCircleO';
import { timesCircle } from 'react-icons-kit/fa/timesCircle';
import { phone } from 'react-icons-kit/fa/phone';

import moment from 'moment';

interface DeliverPoint {
  name: string | null | undefined;
  dateTime: string | null | undefined;
  contactName: string | null | undefined;
  contactMobileNo: string | null | undefined;
}

interface RouteWidgetProps {
  from: DeliverPoint | null | undefined;
  to: Array<DeliverPoint> | null | undefined;
  status: string | null | undefined;
  setTo?: (value: Array<DeliverPoint> | null | undefined) => void;
}

function RouteWidget(props: RouteWidgetProps) {
  const { from, to, status, setTo } = props;
  const { t } = useTranslation();

  return (
    <>
      <Row>
        <img src={images.compass} style={{ width: 34, height: 34 }} />
        <h2 style={{ margin: 0, marginLeft: 10 }}>การขนส่ง</h2>
        <div
          style={{
            display: 'flex',
            flex: 1,
            marginLeft: 10,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'orange' }}>{'[' + t(status || '-') + ']'}</span>
        </div>
      </Row>
      <Row>
        <Col flex={1}>
          <VerticalTimeline animate={true} layout={'1-column-left'}>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#018ECE88', color: '#000' }}
              contentArrowStyle={{ borderRight: '7px solid #018ECE88' }}
              date={moment(from?.dateTime, 'DD-MM-YYYY HH:mm').format('lll')}
              iconStyle={{ background: '#018ECE88', color: '#000' }}
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

            {to?.map((e: any, index: number) => {
              return (
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: '#FC544C88', color: '#000' }}
                  contentArrowStyle={{ borderRight: '7px solid #FC544C88' }}
                  date={moment(e.dateTime, 'DD-MM-YYYY HH:mm').format('lll')}
                  iconStyle={{ background: '#FC544C88', color: '#000' }}
                  icon={<span>ลง</span>}
                >
                  {status === 'NEW' && (
                    <Row style={{ position: 'absolute', top: 0, right: 5 }}>
                      <Button
                        type="button"
                        style={{ padding: 0, backgroundColor: 'inherit' }}
                        onClick={() => {
                          let data = JSON.parse(JSON.stringify(to));
                          data.splice(index, 1);
                          setTo && setTo(data);
                        }}
                      >
                        <Icon icon={timesCircle} size={22} style={{ color: '#eeeeee' }} />
                      </Button>
                    </Row>
                  )}
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
              );
            })}
          </VerticalTimeline>
        </Col>
      </Row>
    </>
  );
}

export default RouteWidget;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 3px;
`;

const Col = styled.div<{ flex: number }>`
  display: flex;
  flex: ${(props) => props.flex | 1};
  flex-direction: column;
  justify-content: center;
`;

const Address = styled.div`
  color: #000;
  font-size: 15px;
`;
