import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

export default function Index() {
  const [token, setToken] = useState(true);

  useEffect(() => {
    if (token == true) {
      navigate('/Dashboard');
    } else {
      navigate('/auth/login');
    }
  }),
    [];
  return <div />;
}
