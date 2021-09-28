import React, { useRef, useEffect } from 'react';
// import Button, {LoadingButton} from '@atlaskit/button/standard-button';
import Button, { LoadingButton } from '@atlaskit/button';
import { useTranslation } from 'react-i18next';

interface IProps {
  accept?: string;
  isLoading?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  disabled?: boolean;
  containerStyles?: React.CSSProperties;
}
const UploadButton = (props: IProps) => {
  const { accept, isLoading, onChange, containerStyles } = props;
  const { t } = useTranslation();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log(isLoading);
    return () => {};
  }, [isLoading]);

  return (
    <>
      <LoadingButton
        style={containerStyles}
        spacing="compact"
        testId="uploadButton"
        isLoading={isLoading}
        appearance="primary"
        onClick={() => uploadInputRef.current?.click()}
      >
        {t('upload')}
      </LoadingButton>
      <input type="file" accept={accept} onChange={onChange} ref={uploadInputRef} style={{ display: 'none' }} />
    </>
  );
};

export default UploadButton;
