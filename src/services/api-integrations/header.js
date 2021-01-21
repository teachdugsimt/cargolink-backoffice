import https from 'https';

const Header = async (api_gw_id = null, is_login = null, is_upload = null, timeout = 20000) => {
  // const httpsAgent = new https.Agent({
  //   rejectUnauthorized: false,
  //   requestCert: false,
  // });

  //   const apigw = api_gw_id || process.env.APIGW_ID_UAM

  let baseURL = process.env.API_ENDPOINT;
  let header = {};
  let token = await JSON.parse(localStorage.getItem('profileLocal'));

  if (!token) {
    token = {
      idToken: '',
    };
  } else {
    if (typeof token === 'object' && token) {
      token = { ...token };
    } else {
      token = {
        idToken: '',
      };
    }
  }

  console.log('BASEURL :> ', baseURL);

  if (is_login) {
    header = {
      // httpsAgent,
      baseURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;application/json',
        Accept: 'application/json',
        // 'x-apigw-api-id': apigw,
      },
      timeout: 20000,
    };
  } else if (is_upload) {
    header = {
      // httpsAgent,
      baseURL,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        Accept: '*/*',
        // 'x-apigw-api-id': apigw,
        Authorization: 'Bearer ' + token.idToken,
      },
      timeout: timeout,
    };
  } else {
    header = {
      // httpsAgent,
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // 'Accept': 'text/plain',
        // 'x-apigw-api-id': apigw,
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Content-Type',
        // 'Access-Control-Max-Age': '86400',

        Authorization: 'Bearer ' + token.idToken,
        // "Upgrade-Insecure-Requests": "1",
      },
      timeout: timeout,
    };
  }
  console.log('HEADER :> ', header);
  return header;
};

export default Header;
