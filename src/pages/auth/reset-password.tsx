import React from 'react';
import { PageProps } from 'gatsby';

import ChangePassword from '../../components/Auth/ChangePassword';
import { searchToQueryParams } from '../../utils';

export default function ResetPassword({ location }: PageProps) {
  const { search } = location;
  const params = searchToQueryParams(search);
  let token: string | null = null;
  if (params && Object.keys(params).includes('token')) token = params.token;
  if (!token) return <h1>Forbidden</h1>;
  return <ChangePassword token={token} />;
}
