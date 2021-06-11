import React, { useRef } from 'react';
import Button from '@atlaskit/button/standard-button';
import { useTranslation } from 'react-i18next';

interface IProps {
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}
const UploadButton = (props: IProps) => {
  const { accept, onChange } = props;
  const { t } = useTranslation();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Button appearance="primary" onClick={() => uploadInputRef.current?.click()}>
        {t('upload')}
      </Button>
      <input type="file" accept={accept} onChange={onChange} ref={uploadInputRef} style={{ display: 'none' }} />
    </>
  );
}

export default UploadButton;