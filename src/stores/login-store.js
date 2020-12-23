import { types } from 'mobx-state-tree';
import { LoginApi } from '../services';
import { persist } from 'mobx-persist';

const Carrier = types.model({
  id: types.optional(types.identifier, () => Math.random().toString()),
  phone: types.string,
  name: types.string,
  member_type: types.string,
  register_date: types.string,
  approve_date: types.string,
  sale_code: types.string,
  brand_name: types.string,
  plate_number: types.string,
  truck_type: types.string,
  weigth_capacity: types.number,
  carrier_name: types.string,
  otp: types.number,
  carrier_status: types.string,
  status: types.union(types.literal('PENDING'), types.literal('APPROVED')),
});

export const LoginStore = types
  .model('LoginStore', {
    title: types.string,
    id: types.number,
    loginId: types.string,
    status: true,
    fullName: types.string,
    phoneNumber: '+66474572889',
    role: 'ROLE_SHIPPER',
    avatar: types.string,
    ratingPoint: types.number,
    multipleAccount: true,
    commissionFee: types.number,
    types: {
      USER_BUSINESS: [
        {
          value: 1,
          stringValue: '',
          label: 'userBusiness.label.retailer',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      CONTACT_US_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'common.label.notContacted',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      FREIGHT_OFFER_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'freightOfferStatus.label.draft',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      QUOTATION_TYPE: [
        {
          value: 1,
          stringValue: '',
          label: 'quotationType.label.perShipment',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      ROLE: [
        {
          value: 5,
          stringValue: '',
          label: 'role.label.finance',
          link: null,
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      CARGO: [
        {
          value: -1,
          stringValue: '',
          label: 'common.message.many',
          link: 'many',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      PAYMENT_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'common.label.unPaid',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      TRUCK_SHARING: [
        {
          value: 1,
          stringValue: '',
          label: 'truckSharingStatus.label.share',
          link: null,
          description: 'truckSharingStatus.label.shareDescription',
          version: 0,
          groupId: 1,
        },
      ],
      ISSUE_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'issueStatus.label.summited',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      TYPE_OF_PRICE: [
        {
          value: 1,
          stringValue: '',
          label: 'typeOfPrice.label.price',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      UNIT: [
        {
          value: 1,
          stringValue: '',
          label: 'unitType.label.cartonBox',
          link: '',
          description: null,
          version: 1,
          groupId: 1,
        },
      ],
      PAYMENT_TRANSPORT_FEE: [
        {
          value: 1,
          stringValue: '',
          label: 'paymentTransportFee.label.bankTransfer',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      WAYBILL_STATUS_SHIPPER: [
        {
          value: 3,
          stringValue: '',
          label: 'waybillStatusShipper.label.received',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      TRANSPORT_REQUEST_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'transportRequestStatus.label.draft',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      WAYBILL_STATUS_CARRIER: [
        {
          value: 0,
          stringValue: '',
          label: 'waybillStatusCarrier.label.draft',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      NOTIFICATION_STATUS: [
        {
          value: 1,
          stringValue: '',
          label: 'notificationStatus.label.unread',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      SHIPMENT_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'shipmentStatus.label.ready',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      NOTIFICATION: [
        {
          value: 1,
          stringValue: '',
          label: 'notificationType.label.jobNotification',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      GROUP_TRUCK: [
        {
          value: 1,
          stringValue: '',
          label: 'groupTruckType.label.fourWheels',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      ISSUE_TYPE: [
        {
          value: 0,
          stringValue: '',
          label: 'issueType.label.trafficJam',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      PREFIX: [
        {
          value: 1,
          stringValue: '',
          label: 'prefix.label.request',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
      QUOTATION_STATUS: [
        {
          value: 0,
          stringValue: '',
          label: 'quotationStatus.label.hasRequest',
          link: '',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      TRUCK: [
        {
          value: -1,
          stringValue: '',
          label: 'common.message.many',
          link: 'other',
          description: null,
          version: 0,
          groupId: 0,
        },
      ],
      ZONES: [
        {
          value: 1,
          stringValue: '1,3,7,15,22,26,27,30,36,37,42,44,45,46,57,58,59,60,62,65,66,74',
          label: 'zones.label.central',
          link: '',
          description: null,
          version: 1,
          groupId: 0,
        },
      ],
      DRIVING_LICENSE_TYPE: [
        {
          value: 1,
          stringValue: '',
          label: 'common.label.typeA',
          link: '',
          description: null,
          version: 0,
          groupId: 1,
        },
      ],
    },
  })
  .actions((self) => {
    return {
      addCarrier(param) {
        self.data.push(param);
      },
      removeCarrier(param) {
        self.data.remove(param);
      },
    };
  })
  .views((self) => ({
    getCarriers() {
      return self;
    },
  }))
  .create();
