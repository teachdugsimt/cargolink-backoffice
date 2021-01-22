import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';
import Icon from 'react-icons-kit';
import { cloudUpload } from 'react-icons-kit/fa/cloudUpload';
import { camera } from 'react-icons-kit/fa/camera';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { useForm } from 'react-hook-form';
import { UploadFileStore } from '../../../stores/upload-file-store';
import images from '../../Themes/images';
import '../../../Layouts/css/style.css';
import provinceOptions from './province-options';
import { useMst } from '../../../stores/root-store';

const ButtonGroup = styled(Button)`
  height: fit-content;
  background-color: white;
  padding: 2px 5px 0px;
`;

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const truckTypeOptions: { value: any; label: any }[] = [
  { value: 1, label: 'รถขนสินค้าแบบกระบะตู้' },
  { value: 2, label: 'Top-Left' },
  { value: 3, label: 'Bottom-Right' },
  { value: 4, label: 'Bottom-Left' },
];

const regionOptions: { value: any; label: any }[] = [
  { value: 1, label: 'ภาคเหนือ' },
  { value: 2, label: 'ภาคกลาง' },
  { value: 3, label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 4, label: 'ภาคตะวันตก' },
  { value: 5, label: 'ภาคตะวันออก' },
  { value: 6, label: 'ภาคใต้' },
];

interface Props {}

const AddTruck: React.FC<Props> = observer((props: any) => {
  const { carrierStore } = useMst();
  const { register, handleSubmit } = useForm();
  const [checkbox, setCheckbox] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [haveImage, setHaveImage] = useState(false);
  const [render, setRender] = useState(false);
  const [disable, setDisable] = useState(false);
  const [truckType, setTruckType] = useState();
  const [region, setRegion] = useState();
  const [province, setProvince] = useState();
  const [filterProvince, setFilterProvince] = useState(provinceOptions);

  const onChangePicture1 = (e: any) => {
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

  const onSubmit = (data) => {
    console.log(data);
    console.log(checkbox);
  };

  const onRemoveImg = (index: number) => {
    const images = pictures.filter((img, i) => i != index);
    setPictures(images);
  };

  const onChangeRegion = (value) => {
    setRegion(value);
    const filterRegion = provinceOptions.filter((e) => e.area == value.value);
    setFilterProvince(filterRegion);
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>เลือกประเภทของรถของคุณ</span>
          <Select
            options={truckTypeOptions}
            placeholder="Select multiple"
            fullWidth
            onChange={(value) => setTruckType(value)}
          />
          <span>รถมีที่ดั้มหรือไม่</span>
          <Switch
            checked={checkbox}
            onChange={() => setCheckbox(!checkbox)}
            color="primary"
            style={{ color: checkbox ? '#00d68f' : '' }}
          />
          <br />
          <span>ความสูงของคอกรถ (หน่วยเป็นเมตร)</span>
          <Input fullWidth>
            <input name="stallHeight" type="text" ref={register} />
          </Input>
          <hr />
          <span>ข้อมูลรถของคุณ</span>
          <span>เลขทะเบียนรถ</span>
          <Input fullWidth>
            <input name="registrationNumber" type="text" ref={register} />
          </Input>
          <hr />
          <span>อัพโหลดรูปภาพรถ</span>
          <br />
          <div style={{ display: 'flex', padding: '10px 0' }}>
            <div style={{ marginRight: 10 }}>
              <label for="file-upload" className="custom-file-upload">
                <Icon icon={cloudUpload} style={{ marginRight: 5 }} />
                Upload Image
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture1} disabled={disable} />
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
          </div>
          <hr />
          <span>โซนที่วิ่งงาน</span>
          {/* <div>
            <div className="block-upload-image">
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
                <label for="file-upload" className="custom-file-upload-photo">
                  <Icon icon={camera} style={{ marginRight: 5 }} />
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture1} disabled={disable} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture1} disabled={disable} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 75 }}>
                  <img src={images.backTruck} style={{ maxHeight: '100%', width: 'auto' }} />
                </div>
                <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านหลัง</span>
              </div>
            </div>
            <div className="block-upload-image">
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 5 }}>
                <label for="file-upload" className="custom-file-upload-photo">
                  <Icon icon={camera} style={{ marginRight: 5 }} />
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture1} disabled={disable} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <input id="file-upload" type="file" accept="image/*" onChange={onChangePicture1} disabled={disable} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 125 }}>
                  <img src={images.rightTruck} style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <span style={{ marginTop: 10, fontSize: '0.75rem' }}>ตัวอย่างรูปภาพด้านขวา</span>
              </div>
            </div>
          </div> */}
          <Select options={regionOptions} placeholder="ภูมิภาค" fullWidth onChange={(value) => onChangeRegion(value)} />
          <Select options={filterProvince} placeholder="จังหวัด" fullWidth onChange={(value) => setProvince(value)} />
          <br />
          <Button status="Success" type="submit" shape="SemiRound" fullWidth>
            ยืนยัน
          </Button>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddTruck;
