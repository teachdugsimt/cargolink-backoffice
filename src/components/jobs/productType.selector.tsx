import AbstractAsyncSelector from '../dropdowns/async.abstract';
import { ProductTypeApi } from '../../services';
import { IProductType } from '../../services/product-type-api';

export default class ProductTypeSelector extends AbstractAsyncSelector {

  fetch = async () => {
    try {
      const response = await ProductTypeApi.getProductTypes();
      if (response && response.ok) {
        const types: IProductType[] = response.data;
        const options = types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        this.setState({ options, items: types });
      } else console.error('search product types not ok', response);
    } catch (error) {
      console.error('error when search product types', error);
    }
  };

}