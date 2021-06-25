import IconButton from '@material-ui/core/IconButton';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Icon from 'react-icons-kit';
import { camera } from 'react-icons-kit/fa/camera';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { UploadFileStore } from '../../../stores/upload-file-store';
import images from '../../Themes/images';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
// import '../../../Layouts/css/style.css';

interface ImageProps {
  submitted: boolean;
}

const ImageUpload: React.FC<ImageProps> = observer(({ submitted }) => {
  const { t } = useTranslation();
  const [render, setRender] = useState(false);
  const [imageUpload, setImageUpload] = useState({ front: '', back: '', left: '', right: '' });
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  useEffect(() => {
    UploadFileStore.clearUploadFileStore();
    setAlertSetting(defaultAlertSetting);
  }, []);

  useEffect(() => {
    const { loading } = UploadFileStore;
    setAlertSetting({
      icon: '',
      show: loading,
      type: 'loading',
      title: '',
      content: t('LOADING'),
    });
  }, [UploadFileStore.loading]);

  useEffect(() => {
    const { error_response } = UploadFileStore;
    if (error_response) {
      setAlertSetting({
        icon: 'error',
        show: true,
        type: 'general',
        title: error_response.title || '',
        content: error_response.content || '',
      });
    }
  }, [UploadFileStore.error_response]);

  const onChangePicture = (e: any, imageName: string) => {
    if (e.target.files[0]) {
      let images = JSON.parse(JSON.stringify(imageUpload));
      images[`${imageName}`] = URL.createObjectURL(e.target.files[0]);
      setImageUpload(images);
      setRender(!render);
      UploadFileStore.uploadImage(e.target.files[0], imageName); //! for upload image
    }
  };

  const onRemoveImg = (imageName: string) => {
    let images = JSON.parse(JSON.stringify(imageUpload));
    images[`${imageName}`] = '';
    setImageUpload(images);
    UploadFileStore.removeImage(imageName);
    setRender(!render);
  };

  // const onChangePicture = (e: any) => {
  //   if (e.target.files[0]) {
  //     setHaveImage(true);
  //     setRender(!render);
  //     let images = pictures;
  //     images.push(URL.createObjectURL(e.target.files[0]));
  //     setPictures(images);
  //     // UploadFileStore.uploadImage(e.target.files[0]);   //! for upload image

  //     if (images.length === 4) setDisable(true);

  //     // images &&
  //     //   images.forEach((e, i) => {
  //     //     const outputImage = document.getElementById(`outputImage${i + 1}`);
  //     //     outputImage.src = URL.createObjectURL(e);
  //     //     // outputImage.onload = function () {
  //     //     //   URL.revokeObjectURL(outputImage.src); // free memory
  //     //     // };
  //     //   });
  //   }
  // };

  return (
    <div>
      <Alert setting={alertSetting} />
      {render ? <></> : <></>}
      <div className="block-upload-image-form">
        {imageUpload.front ? (
          <div className="block-upload-image">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 5px 0' }}>
              <IconButton style={{ padding: 0 }} onClick={() => onRemoveImg('front')}>
                <Icon icon={timesCircleO} style={{ color: '#9f9f9f', display: 'flex' }} />
              </IconButton>
            </div>
            <div className="block-image">
              <div className="image-size">
                <img src={imageUpload.front} style={{ maxWidth: '100%', maxHeight: 110 }} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="block-upload-image"
            style={{ borderColor: submitted && !imageUpload.front ? '#ff3d71' : ' #d8d8d8' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
              <label htmlFor="file-upload-front" className="custom-file-upload-photo">
                <Icon icon={camera} style={{ marginRight: 5 }} />
              </label>
              <input
                id="file-upload-front"
                type="file"
                accept="image/*"
                onChange={(e: any) => onChangePicture(e, 'front')}
              />
            </div>
            <div className="block-image">
              <div style={{ height: 75 }}>
                <img src={images.frontTruck} style={{ maxHeight: '100%', width: 'auto' }} />
              </div>
              <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านหน้า</span>
            </div>
          </div>
        )}

        {imageUpload.back ? (
          <div className="block-upload-image">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 5px 0' }}>
              <IconButton style={{ padding: 0 }} onClick={() => onRemoveImg('back')}>
                <Icon icon={timesCircleO} style={{ color: '#9f9f9f', display: 'flex' }} />
              </IconButton>
            </div>
            <div className="block-image">
              <div className="image-size">
                <img src={imageUpload.back} style={{ maxWidth: '100%', maxHeight: 110 }} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="block-upload-image"
            style={{ borderColor: submitted && !imageUpload.back ? '#ff3d71' : ' #d8d8d8' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
              <label htmlFor="file-upload-back" className="custom-file-upload-photo">
                <Icon icon={camera} style={{ marginRight: 5 }} />
              </label>
              <input
                id="file-upload-back"
                type="file"
                accept="image/*"
                onChange={(e: any) => onChangePicture(e, 'back')}
              />
            </div>
            <div className="block-image">
              <div style={{ height: 75 }}>
                <img src={images.backTruck} style={{ maxHeight: '100%', width: 'auto' }} />
              </div>
              <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านหลัง</span>
            </div>
          </div>
        )}
      </div>
      <div className="block-upload-image-form">
        {imageUpload.left ? (
          <div className="block-upload-image">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 5px 0' }}>
              <IconButton style={{ padding: 0 }} onClick={() => onRemoveImg('left')}>
                <Icon icon={timesCircleO} style={{ color: '#9f9f9f', display: 'flex' }} />
              </IconButton>
            </div>
            <div className="block-image">
              <div className="image-size">
                <img src={imageUpload.left} style={{ maxWidth: '100%', maxHeight: 110 }} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="block-upload-image"
            style={{ borderColor: submitted && !imageUpload.left ? '#ff3d71' : ' #d8d8d8' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
              <label htmlFor="file-upload-left" className="custom-file-upload-photo">
                <Icon icon={camera} style={{ marginRight: 5 }} />
              </label>
              <input
                id="file-upload-left"
                type="file"
                accept="image/*"
                onChange={(e: any) => onChangePicture(e, 'left')}
              />
            </div>
            <div className="block-image">
              <div style={{ width: 125 }}>
                <img src={images.leftTruck} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านซ้าย</span>
            </div>
          </div>
        )}

        {imageUpload.right ? (
          <div className="block-upload-image">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 5px 0' }}>
              <IconButton style={{ padding: 0 }} onClick={() => onRemoveImg('right')}>
                <Icon icon={timesCircleO} style={{ color: '#9f9f9f', display: 'flex' }} />
              </IconButton>
            </div>
            <div className="block-image">
              <div className="image-size">
                <img src={imageUpload.right} style={{ maxWidth: '100%', maxHeight: 110 }} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="block-upload-image"
            style={{ borderColor: submitted && !imageUpload.right ? '#ff3d71' : ' #d8d8d8' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
              <label htmlFor="file-upload-right" className="custom-file-upload-photo">
                <Icon icon={camera} style={{ marginRight: 5 }} />
              </label>
              <input
                id="file-upload-right"
                type="file"
                accept="image/*"
                onChange={(e: any) => onChangePicture(e, 'right')}
              />
            </div>
            <div className="block-image">
              <div style={{ width: 125 }}>
                <img src={images.rightTruck} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านขวา</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
export default ImageUpload;
