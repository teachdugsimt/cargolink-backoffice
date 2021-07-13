import AbstractAsyncSelector from '../../dropdowns/async.abstract';
import { RegionApi } from '../../../services/';
import { ProvincesListResponse } from '../../../services/region-api';

export default class ProvincesSelector extends AbstractAsyncSelector {

  fetch = async () => {
    try {
      const response = await RegionApi.getProvincesList();
      if (response && response.ok) {
        const provinces: ProvincesListResponse = response.data.sort((a, b) => a.name.localeCompare(b.name));
        const options = provinces.map(({ name }) => ({
          label: name,
          value: name,
        }));
        this.setState({ options, items: provinces });
      } else console.error('search provinces not ok', response);
    } catch (error) {
      console.error('error when search provinces', error);
    }
  }

}