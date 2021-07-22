import IconButton from '@material-ui/core/IconButton';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Icon from 'react-icons-kit';
import { images } from 'react-icons-kit/icomoon/images';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { UploadImageStore } from '../../../stores/upload-image-store';
import Alert from '../../alert';
import { defaultAlertSetting } from '../../simple-data';
import styled from 'styled-components';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { Row, Col } from '@paljs/ui';

interface ImageProps {
  submitted?: boolean;
}

const ImageUpload: React.FC<ImageProps> = observer(({ submitted }) => {
  const { t } = useTranslation();
  const [render, setRender] = useState(false);
  const [imageUpload, setImageUpload] = useState({ front: '', back: '', left: '', right: '' });
  const [alertSetting, setAlertSetting] = useState(defaultAlertSetting);

  useEffect(() => {
    // UploadImageStore.clearUploadImageStore();
    setAlertSetting(defaultAlertSetting);
  }, []);

  // useEffect(() => {
  //   const { loading } = UploadImageStore;
  //   setAlertSetting({
  //     icon: '',
  //     show: loading,
  //     type: 'loading',
  //     title: '',
  //     content: t('LOADING'),
  //   });
  // }, [UploadImageStore.loading]);

  // useEffect(() => {
  //   const { error_response } = UploadImageStore;
  //   if (error_response) {
  //     setAlertSetting({
  //       icon: 'error',
  //       show: true,
  //       type: 'general',
  //       title: error_response.title || '',
  //       content: error_response.content || '',
  //     });
  //   }
  // }, [UploadImageStore.error_response]);

  const onChangePicture = (e: any, imageName: string) => {
    if (e.target.files[0]) {
      let images = JSON.parse(JSON.stringify(imageUpload));
      images[`${imageName}`] = URL.createObjectURL(e.target.files[0]);
      setImageUpload(images);
      setRender(!render);
      // UploadImageStore.uploadImage(e.target.files[0], imageName); //! for upload image
    }
  };

  const onRemoveImg = (imageName: string) => {
    let images = JSON.parse(JSON.stringify(imageUpload));
    images[`${imageName}`] = '';
    setImageUpload(images);
    // UploadImageStore.removeImage(imageName);
    setRender(!render);
  };

  return (
    <Gallery>
      <div style={{ marginLeft: 10, marginBottom: -10 }}>
        <Label>{t('takePhotoVehicle')}</Label>
      </div>
      <ImageWrapper>
        {imageUpload.left ? (
          <ImageItem>
            <IconImageTimes>
              <IconButton style={{ position: 'absolute', padding: 5 }} onClick={() => onRemoveImg('left')}>
                <Icon icon={timesCircleO} style={{ color: '#DE350B', display: 'flex' }} />
              </IconButton>
            </IconImageTimes>
            <ImageThumb>
              <Item original={imageUpload.left} width="1024" height="768">
                {({ ref, open }) => (
                  <img
                    style={{ width: 150, height: 130, objectFit: 'contain' }}
                    ref={ref}
                    onClick={open}
                    src={imageUpload.left}
                  />
                )}
              </Item>
            </ImageThumb>
            <ImageLabel>ซ้าย</ImageLabel>
          </ImageItem>
        ) : (
          <div style={{ margin: 10 }}>
            <label htmlFor="file-upload-left" className="custom-file-upload-photo">
              <ImageThumb>
                <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
              </ImageThumb>
              <ImageLabel style={{ paddingBottom: 10 }}>ซ้าย</ImageLabel>
            </label>
            <input
              id="file-upload-left"
              type="file"
              accept="image/*"
              onChange={(e: any) => onChangePicture(e, 'left')}
            />
          </div>
        )}
        {imageUpload.right ? (
          <ImageItem>
            <IconImageTimes>
              <IconButton style={{ position: 'absolute', padding: 5 }} onClick={() => onRemoveImg('right')}>
                <Icon icon={timesCircleO} style={{ color: '#DE350B', display: 'flex' }} />
              </IconButton>
            </IconImageTimes>
            <ImageThumb>
              <Item original={imageUpload.right} width="1024" height="768">
                {({ ref, open }) => (
                  <img
                    style={{ width: 150, height: 130, objectFit: 'contain' }}
                    ref={ref}
                    onClick={open}
                    src={imageUpload.right}
                  />
                )}
              </Item>
            </ImageThumb>
            <ImageLabel>ขวา</ImageLabel>
          </ImageItem>
        ) : (
          <div style={{ margin: 10 }}>
            <label htmlFor="file-upload-right" className="custom-file-upload-photo">
              <ImageThumb>
                <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
              </ImageThumb>
              <ImageLabel style={{ paddingBottom: 10 }}>ขวา</ImageLabel>
            </label>
            <input
              id="file-upload-right"
              type="file"
              accept="image/*"
              onChange={(e: any) => onChangePicture(e, 'right')}
            />
          </div>
        )}

        {imageUpload.front ? (
          <ImageItem>
            <IconImageTimes>
              <IconButton style={{ position: 'absolute', padding: 5 }} onClick={() => onRemoveImg('front')}>
                <Icon icon={timesCircleO} style={{ color: '#DE350B', display: 'flex' }} />
              </IconButton>
            </IconImageTimes>
            <ImageThumb>
              <Item original={imageUpload.front} width="1024" height="768">
                {({ ref, open }) => (
                  <img
                    style={{ width: 150, height: 130, objectFit: 'contain' }}
                    ref={ref}
                    onClick={open}
                    src={imageUpload.front}
                  />
                )}
              </Item>
            </ImageThumb>
            <ImageLabel>หน้า</ImageLabel>
          </ImageItem>
        ) : (
          <div style={{ margin: 10 }}>
            <label htmlFor="file-upload-front" className="custom-file-upload-photo">
              <ImageThumb>
                <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
              </ImageThumb>
              <ImageLabel style={{ paddingBottom: 10 }}>หน้า</ImageLabel>
            </label>
            <input
              id="file-upload-front"
              type="file"
              accept="image/*"
              onChange={(e: any) => onChangePicture(e, 'front')}
            />
          </div>
        )}

        {imageUpload.back ? (
          <ImageItem>
            <IconImageTimes>
              <IconButton style={{ position: 'absolute', padding: 5 }} onClick={() => onRemoveImg('back')}>
                <Icon icon={timesCircleO} style={{ color: '#DE350B', display: 'flex' }} />
              </IconButton>
            </IconImageTimes>
            <ImageThumb>
              <Item original={imageUpload.back} width="1024" height="768">
                {({ ref, open }) => (
                  <img
                    style={{ width: 150, height: 130, objectFit: 'contain' }}
                    ref={ref}
                    onClick={open}
                    src={imageUpload.back}
                  />
                )}
              </Item>
            </ImageThumb>
            <ImageLabel>หน้า</ImageLabel>
          </ImageItem>
        ) : (
          <div style={{ margin: 10 }}>
            <label htmlFor="file-upload-back" className="custom-file-upload-photo">
              <ImageThumb>
                <Icon icon={images} style={{ color: 'lightgray' }} size={40} />
              </ImageThumb>
              <ImageLabel style={{ paddingBottom: 10 }}>หลัง</ImageLabel>
            </label>
            <input
              id="file-upload-back"
              type="file"
              accept="image/*"
              onChange={(e: any) => onChangePicture(e, 'back')}
            />
          </div>
        )}
      </ImageWrapper>
    </Gallery>
  );
});
export default ImageUpload;

const Label = styled.label`
  font-size: 0.8571428571428571em;
  font-style: inherit;
  line-height: 1.3333333333333333;
  color: #6b778c;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 4px;
  margin-top: 0;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const ImageItem = styled.div`
  width: 150px;
  height: 150px;
  padding: 10px;
  border: 1px dashed gray;
  border-radius: 5px;
  margin: 10px;
  flex-direction: column;
  display: flex;
  align-items: center;
`;

const IconImageTimes = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ImageThumb = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ImageLabel = styled.span`
  color: gray;
  height: 20px;
`;
