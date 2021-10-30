import React, { useRef } from 'react';
import { LoadingButton } from '@atlaskit/button';
import { Icon } from 'react-icons-kit'
import { ic_file_upload } from 'react-icons-kit/md/ic_file_upload'
import { color } from '../../../theme';
import { pencil2 } from 'react-icons-kit/icomoon/pencil2'
import { cancelCircle } from 'react-icons-kit/icomoon/cancelCircle'

interface IProps {
  accept?: string;
  isLoading?: boolean;
  onChange?: any;
  disabled?: boolean;
  containerStyles?: React.CSSProperties;
  action?: 'REPLACE' | 'NEW' | 'NO_CHANGE' | 'DELETE'
  position?: 'left' | 'right' | 'front' | 'back'
}
const UploadVehicleSlot = (props: IProps) => {

  const { accept, isLoading, onChange, containerStyles, position, action } = props;
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  return <LoadingButton isLoading={isLoading} style={{ ...containerStyles }}
    onClick={() => uploadInputRef.current?.click()}>
    <Icon icon={ic_file_upload} style={{ color: 'lightgray' }} size={40} />
    <input id={`${position}-image`} type="file" accept={accept || `image/*`} onChange={(event: any) => onChange(event, position, action)} ref={uploadInputRef} style={{ display: 'none' }} />
  </LoadingButton>
}

export default UploadVehicleSlot


interface DeleteImageButton extends IProps {
  onClick?: any
}
export const DeleteVehicleImageButton = (props: DeleteImageButton) => {
  const { isLoading, containerStyles, position, action, onClick } = props;

  return <LoadingButton isLoading={isLoading} style={{ ...containerStyles }}
    onClick={() => onClick(position, action)}>
    <Icon icon={cancelCircle} style={{ color: color.red }} size={25} />
  </LoadingButton>
}

interface ReplaceImageButton extends IProps {
  onClick?: any
}
export const ReplaceVehicleImageButton = (props: ReplaceImageButton) => {
  const { isLoading, containerStyles, position, action, onClick } = props;

  return <LoadingButton isLoading={isLoading} style={{ ...containerStyles }}
    onClick={() => onClick(position, action)}>
    <Icon icon={pencil2} style={{ color: color.success }} size={25} />
  </LoadingButton>
}
