import React, { useRef } from 'react';
import Button from '@atlaskit/button/standard-button';
import Spinner from '@atlaskit/spinner';
import { useTranslation } from 'react-i18next';

interface IProps {
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  disabled?: boolean;
  isLoading?: boolean;
}
const UploadButton = (props: IProps) => {
  const { accept, onChange, disabled, isLoading } = props;
  const { t } = useTranslation();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      {isLoading ? (
        <Spinner size="medium" />
      ) : (
        <Button appearance="primary" isDisabled={disabled} onClick={() => uploadInputRef.current?.click()}>
          {t('upload')}
        </Button>
      )}
      <input type="file" accept={accept} onChange={onChange} ref={uploadInputRef} style={{ display: 'none' }} />
    </>
  );
}

export default UploadButton;