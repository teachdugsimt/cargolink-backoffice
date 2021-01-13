import { create } from 'apisauce';
import Header from './header';

const ExcuteApi = async (url, params, method, timeout = 20000) => {
  console.time('ExcuteApi');
  console.log('Params Excute header : ', params);
  try {
    const api = create(
      await Header(
        null,
        url.includes('signin') ? true : null,
        url.includes('upload') && method == 'put' ? params.type : null,
        timeout,
      ),
    );

    let response;
    if (method == 'get' || method == 'GET') {
      response = await api.get(url, params || { filter: {} });
    } else if (method == 'post' || method == 'POST') {
      response = await api.post(url, params);
    } else if (method == 'put' || method == 'PUT') {
      response = await api.put(url, params);
    } else if (method == 'patch' || method == 'PATCH') {
      response = await api.patch(url, params);
    } else if (method == 'delete' || method == 'DELETE') {
      response = await api.delete(url, params);
    }
    console.timeEnd('ExcuteApi');
    return response;
  } catch (error) {
    console.timeEnd('ExcuteApi');
    return error;
  }
};

export default ExcuteApi;
