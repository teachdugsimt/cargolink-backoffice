import React from 'react';
import { PageProps } from 'gatsby'
import UploadPageComponent from '../../components/user-upload';

const UserUpload = ({ location }: PageProps) => {
  const { search } = location;
  const params = searchToQueryParams(search);
  let token: string | null = null;
  if (params && Object.keys(params).includes('token')) token = params.token;
  return <UploadPageComponent token={token} />;
}

interface IQueryParams {
  [key: string]: string;
}
const searchToQueryParams = (search: string): IQueryParams | null => {
  if (search.length === 0) return null;
  if (!search.startsWith('?')) return null;
  const withOutQuestionMark = search.substr(1);
  const paramsArray = withOutQuestionMark.split('&');
  return paramsArray.reduce((result: IQueryParams, current: string) => {
    const [key, value] = current.split('=');
    if (!key || !key.length) return result;
    return {
      ...result,
      [key]: value,
    };
  }, {});
}

export default UserUpload;