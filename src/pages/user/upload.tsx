import React from 'react';
import { PageProps } from 'gatsby'
import { searchToQueryParams } from '../../utils';
import UploadPageComponent from '../../components/user-upload';

const UserUpload = ({ location }: PageProps) => {
  const { search } = location;
  const params = searchToQueryParams(search);
  let token: string | null = null;
  if (params && Object.keys(params).includes('token')) token = params.token;
  return <UploadPageComponent token={token} />;
}



export default UserUpload;