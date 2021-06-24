const Header = async (admin_api = false, is_login = null, is_upload = null, timeout = 20000, requiredToken = true) => {
  const baseURL = admin_api ? process.env.API_ENDPOINT_ADMIN : process.env.API_ENDPOINT;
  let header = {};
  let language = await localStorage.getItem('profileLanguage');
  if (!language) language = 'th';

  const profileLocal = JSON.parse(localStorage.getItem('profileLocal'));
  const accessToken = profileLocal?.accessToken || null;

  console.log('BASEURL :> ', baseURL);

  if (is_login) {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': language,
      },
      timeout: 20000,
    };
  } else if (is_upload) {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        Accept: '*/*',
        Authorization: accessToken,
        'Accept-Language': language,
      },
      timeout: timeout,
    };
  } else if (requiredToken) {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: accessToken,
        'Accept-Language': language,
      },
      timeout: timeout,
    };
  } else {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Language': language,
      },
      timeout: timeout,
    };
  }
  console.log('HEADER :> ', header);
  return header;
};

export default Header;
