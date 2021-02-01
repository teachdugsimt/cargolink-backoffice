const Header = async (is_login = null, is_upload = null, timeout = 20000, requiredToken = true) => {
  let baseURL = process.env.API_ENDPOINT;
  let header = {};
  let token = await JSON.parse(localStorage.getItem('profileLocal'));
  const language = await localStorage.getItem('profileLanguage');

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
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': language ? language : 'th',
      },
      timeout: 20000,
    };
  } else if (is_upload) {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        Accept: '*/*',
        Authorization: 'Bearer ' + token.idToken,
        'Accept-Language': language ? language : 'th',
      },
      timeout: timeout,
    };
  } else if (requiredToken) {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.idToken,
        'Accept-Language': language ? language : 'th',
      },
      timeout: timeout,
    };
  } else {
    header = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Language': language ? language : 'th',
      },
      timeout: timeout,
    };
  }
  console.log('HEADER :> ', header);
  return header;
};

export default Header;
