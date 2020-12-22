import { types } from 'mobx-state-tree';
import axios from 'axios';

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
  status: types.string,
});

export const CarrierStore = types
  .model('CarrierStore', {
    data: types.array(Carrier),
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
      axios.get(`/api/users`).then((res) => {
        console.log('get-carriers :> ', res);
      });
      return self;
    },
  }))
  .create({
    data: [
      {
        phone: '0985632145',
        name: 'user01',
        member_type: 'asdfghjk',
        register_date: '2020-11-01 23:15:26',
        approve_date: '2020-11-10 23:15:26',
        sale_code: 'xxxx',
        brand_name: 'xyz brand',
        plate_number: '613659',
        truck_type: 'truck',
        weigth_capacity: 32,
        carrier_name: 'carrier name',
        otp: 123456,
        carrier_status: 'active',
        status: 'PENDING',
      },
    ],
  });
