import AbstractAsyncSelector from './async.abstract';
import { RegionApi } from '../../services/';
import { ProvincesListResponse } from '../../services/region-api';

export default class ProvincesSelector extends AbstractAsyncSelector {

  fetch = async () => {
    try {
      const response = await RegionApi.getProvincesList();
      if (response && response.ok) {
        const provinces: ProvincesListResponse = response.data.sort((a, b) => a.name.localeCompare(b.name));
        const options = provinces.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        this.setState({ options, items: provinces });
      } else console.error('search provinces not ok', response);
    } catch (error) {
      console.error('error when search provinces', error);
    }
  }

}