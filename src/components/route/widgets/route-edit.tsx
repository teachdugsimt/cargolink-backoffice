import React, { useState, useCallback, CSSProperties, useEffect, FC } from 'react';
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
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import PickUpPoint from '../../jobs/add/pick-up-point';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';
import Tooltip from '@atlaskit/tooltip';
import { plus } from 'react-icons-kit/fa/plus';
import { useMst } from '../../../stores/root-store';
import { observer } from 'mobx-react-lite';
import Swal, { SweetAlertResult } from 'sweetalert2';
import Spinner from '@atlaskit/spinner';

interface DeliverPoint {
  name?: string | null;
  dateTime?: string | null;
  contactName?: string | null;
  contactMobileNo?: string | null;
  lat?: string | null;
  lng?: string | null;
}

interface ShipmentResponse {
  from?: DeliverPoint;
  to?: DeliverPoint[];
}

interface RouteWidgetProps {
  from?: DeliverPoint | null;
  to?: Array<DeliverPoint> | null;
  status?: string | null;
  setTo?: (value?: Array<DeliverPoint> | null) => void;
  onSubmit?: (data: Partial<ShipmentResponse>) => void
}

interface TransportDataProps {
  operator: {
    label: string;
    value: string;
  },
  location?: {
    lat?: number;
    lng?: number;
  },
  dateTime?: string;
  name?: string;
  contactName?: string;
  contactMobileNo?: string;
}

interface EditTransportDataProps {
  index: number;
  operator: 'UP' | 'DOWN';
  lat?: number;
  lng?: number;
  dateTime?: string;
  name?: string;
  contactName?: string;
  contactMobileNo?: string;
}

const ICON_STYLED: CSSProperties = {
  color: 'gray',
};

const convertShipment = (data: any) => ({
  name: data.name,
  dateTime: moment(data.dateTime).format('YYYY-MM-DD HH:mm:ss'),
  contactName: data.contactName,
  contactMobileNo: data.contactMobileNo,
  lat: data.location.lat.toString(),
  lng: data.location.lng.toString()
})

const RouteEditWidget: FC<RouteWidgetProps> = observer((props) => {
  const { from, to, status, setTo, onSubmit } = props;
  const { t } = useTranslation();
  const { jobStore } = useMst();
  const [pickup, setPickup] = useState<any>(null);
  const [transportData, setTransportData] = useState<TransportDataProps>();
  const [actionId, setActionId] = useState<number>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    console.log('pickup :>> ', pickup);
    if (pickup) {
      console.log('actionId :>> ', actionId);
      let shipmentResponse: any;
      if (actionId !== undefined) { // update
        if (actionId === -1) {
          // jobStore.setJobDetail({ from: convertShipment(pickup.from) });
          shipmentResponse = { from: convertShipment(pickup.from) };
        } else {
          const newShipment = pickup.to[0];
          const shipmentTo = JSON.parse(JSON.stringify(to));
          shipmentTo[actionId] = convertShipment(newShipment);
          // jobStore.setJobDetail({ to: shipmentTo });
          shipmentResponse = { to: shipmentTo };
        }
      } else { // add
        const newShipment = pickup.to[0];
        const shipment = JSON.parse(JSON.stringify(to));
        shipment?.push(convertShipment(newShipment));
        console.log('shipment :>> ', shipment);
        // jobStore.setJobDetail({ to: shipment });
        shipmentResponse = { to: shipment }
      }
      onSubmit && onSubmit(shipmentResponse);
    }
    return () => {
      closeModal();
      setPickup(null);
      setActionId(undefined);
    }
  }, [pickup]);

  useEffect(() => {
    if (transportData) {
      openModal();
    }
  }, [transportData])

  const onCreate = () => {
    setTransportData({
      operator: {
        label: 'ลง',
        value: 'DOWN'
      }
    });
    // openModal();
  }

  const onEdit = (data: EditTransportDataProps) => {
    const {
      index,
      operator,
      lat,
      lng,
      dateTime,
      name,
      contactName,
      contactMobileNo
    } = data;

    setActionId(index);
    setTransportData({
      operator: {
        label: operator === 'UP' ? 'ขึ้น' : 'ลง',
        value: operator
      },
      location: {
        lat: lat,
        lng: lng
      },
      dateTime: dateTime ?? undefined,
      name,
      contactName,
      contactMobileNo
    });

    // openModal();
  }

  const onDelete = (index: number) => {
    Swal.fire({
      icon: 'warning',
      text: `ยืนยันการลบจุดลงสินค้า!`,
      showCancelButton: true,
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', '', 'success');
        setActionId(index);
        console.log('delete index :>>', index);
        const shipment = JSON.parse(JSON.stringify(to));
        console.log('shipment :>> ', shipment);
        shipment.splice(index, 1);
        console.log('shipment :>> ', shipment);
        onSubmit && onSubmit({ to: shipment });
      }
    });
  }

  return (
    <>
      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>{'จุดขึ้นลงสินค้า'}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <PickUpPoint
                pickup={pickup}
                disableOperator={true}
                transportData={transportData}
                setPickup={setPickup}
              />
            </ModalBody>
            <ModalFooter>
              {``}
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>

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
        <Col flex={1} style={{ position: 'relative' }}>
          {/* <VerticalTimeline animate={true} layout={'1-column-left'}> */}
          <BtnAdd onClick={onCreate}>
            <span>
              {'เพิ่มจุดลงสินค้า'}
              <Icon icon={plus} style={{ ...ICON_STYLED, paddingLeft: 6 }} size={20} />
            </span>
          </BtnAdd>
          <VerticalTimeline animate={true} layout="1-column">
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#018ECE88', color: '#000', position: 'relative' }}
              contentArrowStyle={{ borderRight: '7px solid #018ECE88' }}
              date={moment(from?.dateTime).format('lll')}
              dateClassName={'vertical-timeline-date-bottom-element'}
              iconStyle={{ background: '#018ECE88', color: '#000' }}
              icon={<span>ขึ้น</span>}
            >
              <Box>
                <IconGroup>
                  <BtnAction
                    onClick={() => onEdit({
                      index: -1,
                      operator: 'UP',
                      lat: from?.lat ? +from.lat : undefined,
                      lng: from?.lng ? +from.lng : undefined,
                      dateTime: from?.dateTime ?? undefined,
                      name: from?.name ?? undefined,
                      contactName: from?.contactName ?? undefined,
                      contactMobileNo: from?.contactMobileNo ?? undefined
                    })}
                  >
                    <Icon icon={pencil} style={ICON_STYLED} size={20} />
                  </BtnAction>
                </IconGroup>
                <Row>
                  <Address>{from?.name}</Address>
                </Row>
                <Row>
                  <span style={{ fontSize: 12 }}>{from?.lat}, {from?.lng}</span>
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
              </Box>
            </VerticalTimelineElement>

            {to?.map((e: any, index: number) => {
              return (
                <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  contentStyle={{ background: '#FC544C88', color: '#000', position: 'relative' }}
                  contentArrowStyle={{ borderRight: '7px solid #FC544C88' }}
                  date={moment(e.dateTime).format('lll')}
                  dateClassName={'vertical-timeline-date-bottom-element'}
                  iconStyle={{ background: '#FC544C88', color: '#000' }}
                  icon={<span>ลง</span>}
                >
                  <Box>
                    <IconGroup>
                      <BtnAction
                        style={{ border: '1px solid #FC544C88' }}

                        onClick={() => onEdit({
                          index,
                          operator: 'DOWN',
                          lat: e?.lat ? +e.lat : undefined,
                          lng: e?.lng ? +e.lng : undefined,
                          dateTime: e?.dateTime ?? undefined,
                          name: e?.name ?? undefined,
                          contactName: e?.contactName ?? undefined,
                          contactMobileNo: e?.contactMobileNo ?? undefined
                        })}
                      >
                        <Icon icon={pencil} style={ICON_STYLED} size={20} />
                      </BtnAction>
                      {to.length === 1 ? (<Tooltip content={'ไม่สามารถลบได้เนื่องจากจุดลงสินค้าควรมีอย่างน้อย 1 จุด'} position={'top'}>
                        <BtnAction
                          style={{ border: '1px solid #FC544C88', cursor: 'not-allowed' }}
                          disabled={to.length === 1 ? true : false}
                          onClick={() => onDelete(index)}
                        >
                          <Icon icon={trash} style={ICON_STYLED} size={20} />
                        </BtnAction>
                      </Tooltip>) : (<BtnAction
                        style={{ border: '1px solid #FC544C88' }}
                        disabled={to.length === 1 ? true : false}
                        onClick={() => onDelete(index)}
                      >
                        <Icon icon={trash} style={ICON_STYLED} size={20} />
                      </BtnAction>)}
                    </IconGroup>

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
                      <span style={{ fontSize: 12 }}>{e?.location?.lat ?? e?.lat}, {e?.location?.lng ?? e?.lng}</span>
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
                  </Box>
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
        </Col>
      </Row>

      <Row>
        {!props.from && <Col flex={1}>
          <span style={{ textAlign: 'center', marginLeft: 60 }}>
            <Spinner size={'large'} />
          </span>
        </Col>}
      </Row>
    </>
  );
})

export default RouteEditWidget;

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

const IconGroup = styled.div`
  position: absolute;
  top: -16px;
  right: 0;
  width: 100px;
  display: flex;
  justify-content: flex-end;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px;
  z-index: 1;
`;

const BtnAction = styled.button`
  border: 1px solid #018ECE88;
  background-color: #fff;
  border-radius: 3px;
  padding: 3px 6px;
  margin: 0 3px;
  cursor: pointer;
`;

const BtnAdd = styled(BtnAction)`
  position: absolute;
  top: 0;
  right: 14px;
  width: 140px;
  padding: 6px 0;
  z-index: 2;
`;

const Box = styled.div`
  padding: 10px 10px 0;
`;
