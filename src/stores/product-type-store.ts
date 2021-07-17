import { types, flow } from 'mobx-state-tree';
import { ProductTypeApi } from '../services';
import { IProductType } from '../services/product-type-api';


const ProductTypeType = types.model({
  id: types.number,
  image: types.string,
  name: types.string,
});

export const ProductTypeStore = types
  .model('ProductTypeStore', {
    loading: false,
    data: types.maybeNull(types.array(ProductTypeType)),
    count: types.maybeNull(types.number),
    error_response: types.maybeNull(
      types.model({
        title: types.maybeNull(types.string),
        text: types.maybeNull(types.string),
      }),
    ),
  })
  .actions((self) => {
    return {
      getProductTypes: flow(function* getProductTypes() {
        self.loading = true;
        self.data = null;
        self.count = null;
        self.error_response = null;
        try {
          const response = yield ProductTypeApi.getProductTypes();
          console.info('getProductTypes response :>', response);
          if (response && response.ok) {
            const productTypesList = response.data;
            self.data = productTypesList;
            self.count = productTypesList.length;
            self.error_response = null;
          } else {
            self.data = null;
            self.count = null;
            self.error_response = {
              title: response.problem,
              text: 'GET product types :' + response.originalError.message,
            }
          }
        } catch (error) {
          console.error('Failed to getProductTypes :>', error);
          self.data = null;
          self.error_response = {
            title: '',
            text: 'Failed to getProductTypes',
          }
        }
        self.loading = false;
      }),
    };
  })
  .views(self => ({
    productTypeNameById(productTypeId: number | string) {
      let ptype = self.data?.filter(e => e.id == productTypeId)
      if (!ptype?.length) {
        // self.getProductTypes()
      }
      return ptype?.length ? ptype[0] : null
    }
  }));
