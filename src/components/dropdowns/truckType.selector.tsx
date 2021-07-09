import AbstractAsyncSelector from './async.abstract';
import { TruckTypeApi } from '../../services';
import { ITruckType } from '../../services/truck-type-api';

export default class TruckTypesSelector extends AbstractAsyncSelector {

  fetch = async () => {
    try {
      const response = await TruckTypeApi.getTruckTypes();
      if (response && response.ok) {
        const types: ITruckType[] = response.data.sort((a, b) => a.id - b.id);
        const options = types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        this.setState({ options, items: types });
      } else console.error('search truck types not ok', response);
    } catch (error) {
      console.error('error when search truck types', error);
    }

  }

}