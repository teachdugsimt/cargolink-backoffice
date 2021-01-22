import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Icon from 'react-icons-kit';
import { cloudUpload } from 'react-icons-kit/fa/cloudUpload';
import { camera } from 'react-icons-kit/fa/camera';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { UploadFileStore } from '../../../stores/upload-file-store';
import images from '../../Themes/images';
import '../../../Layouts/css/style.css';

interface Props {}

const ImageUpload: React.FC<Props> = observer((props) => {
  const [checkbox, setCheckbox] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [haveImage, setHaveImage] = useState(false);
  const [render, setRender] = useState(false);
  const [disable, setDisable] = useState(false);
  const [imageUpload, setImageUpload] = useState({});

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

  const onChangePicture = (e: any, name: string) => {
    if (e.target.files[0]) {
      setHaveImage(true);
      setRender(!render);
      let images = pictures;
      images.push(URL.createObjectURL(e.target.files[0]));
      setPictures(images);
      // UploadFileStore.uploadImage(e.target.files[0]);   //! for upload image

      if (images.length === 4) setDisable(true);

      // images &&
      //   images.forEach((e, i) => {
      //     const outputImage = document.getElementById(`outputImage${i + 1}`);
      //     outputImage.src = URL.createObjectURL(e);
      //     // outputImage.onload = function () {
      //     //   URL.revokeObjectURL(outputImage.src); // free memory
      //     // };
      //   });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="block-upload-image">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
            <label for="file-upload" className="custom-file-upload-photo">
              <Icon icon={camera} style={{ marginRight: 5 }} />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={(e: any) => onChangePicture(e, 'front')} />
          </div>
          <div className="block-image">
            <div style={{ height: 75 }}>
              <img src={images.frontTruck} style={{ maxHeight: '100%', width: 'auto' }} />
            </div>
            <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านหน้า</span>
          </div>
        </div>
        <div className="block-upload-image">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
            <label for="file-upload" className="custom-file-upload-photo">
              <Icon icon={camera} style={{ marginRight: 5 }} />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={(e: any) => onChangePicture(e, 'back')} />
          </div>
          <div className="block-image">
            <div style={{ height: 75 }}>
              <img src={images.backTruck} style={{ maxHeight: '100%', width: 'auto' }} />
            </div>
            <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านหลัง</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="block-upload-image">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
            <label for="file-upload" className="custom-file-upload-photo">
              <Icon icon={camera} style={{ marginRight: 5 }} />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={(e: any) => onChangePicture(e, 'left')} />
          </div>
          <div className="block-image">
            <div style={{ width: 125 }}>
              <img src={images.leftTruck} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านซ้าย</span>
          </div>
        </div>
        <div className="block-upload-image">
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
            <label for="file-upload" className="custom-file-upload-photo">
              <Icon icon={camera} style={{ marginRight: 5 }} />
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={(e: any) => onChangePicture(e, 'right')} />
          </div>
          <div className="block-image">
            <div style={{ width: 125 }}>
              <img src={images.rightTruck} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านขวา</span>
          </div>
        </div>
      </div>
      {/* <div style={{ display: 'flex', padding: '10px 0' }}>
        <div style={{ marginRight: 10 }}>
          <label for="file-upload" className="custom-file-upload">
            <Icon icon={cloudUpload} style={{ marginRight: 5 }} />
            Upload Image
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture} disabled={disable} />
        </div>
        {render ? (
          <div style={{ display: haveImage ? 'flex' : 'none' }}>
            {pictures.map((im, i) => {
              return (
                <div style={{ height: 150, margin: '0 10px', display: 'flex' }} key={i}>
                  <img id="outputImage1" src={im} className="upload-image" />
                  <ButtonGroup
                    status="Basic"
                    appearance="ghost"
                    size="Tiny"
                    type="button"
                    onClick={() => onRemoveImg(i)}
                  >
                    <Icon icon={timesCircleO} style={{ color: '#9f9f9f' }} />
                  </ButtonGroup>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: haveImage ? 'flex' : 'none' }}>
            {pictures.map((im, i) => {
              return (
                <div style={{ height: 150, margin: '0 10px', display: 'flex' }} key={i}>
                  <img id="outputImage1" src={im} className="upload-image" />
                  <ButtonGroup
                    status="Basic"
                    appearance="ghost"
                    size="Tiny"
                    type="button"
                    onClick={() => onRemoveImg(i)}
                  >
                    <Icon icon={timesCircleO} style={{ color: '#9f9f9f' }} />
                  </ButtonGroup>
                </div>
              );
            })}
          </div>
        )}
      </div> */}
    </div>
  );
});
export default ImageUpload;
