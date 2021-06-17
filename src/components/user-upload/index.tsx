import React from 'react';

interface IUploadPageProps {
  token: string | null;
}
const UploadPageComponent = ({ token }: IUploadPageProps) => {
  return <div>token: {token}</div>;
}

export default UploadPageComponent;