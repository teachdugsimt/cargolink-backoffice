import Reactotron from 'reactotron-react-js'
import { create } from 'apisauce';
import Header from './header';

const ExcuteApi = async (url, params, method, timeout = 20000, requiredToken = true, admin_api = false) => {
  console.time('ExcuteApi');
  console.log('Params Excute header : ', params);
  try {
    const api = create(
      await Header(
        admin_api,
        url.includes('login') ? true : null,
        url.includes('upload') && !url.includes('gen-doc-upload-link') && method == 'post' ? 'upload' : null,
        timeout,
        requiredToken,
      ),
    );

    api.addMonitor(Reactotron.apisauce)

    let response;
    if (method == 'get' || method == 'GET') {
      response = await api.get(url, params || {});
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
