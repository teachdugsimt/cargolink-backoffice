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
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { UploadFileStore } from '../../../stores/upload-file-store';
import '../../../Layouts/css/style.css';

const ButtonGroup = styled(Button)`
  height: fit-content;
  background-color: white;
  padding: 2px 5px 0px;
`;

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const positionOptions: { value: any; label: any }[] = [
  { value: 1, label: 'รถขนสินค้าแบบกระบะตู้' },
  { value: 'topLeft', label: 'Top-Left' },
  { value: 'bottomRight', label: 'Bottom-Right' },
  { value: 'bottomLeft', label: 'Bottom-Left' },
];

const region: { value: any; label: any }[] = [
  { label: 'สินค้าการเกษตร', value: 'สินค้าการเกษตร' },
  { value: 'Info', label: 'Info' },
  { value: 'Success', label: 'Success' },
  { value: 'Danger', label: 'Danger' },
  { value: 'Primary', label: 'Primary' },
];

const province: { value: any; label: any }[] = [
  { label: 'สินค้าการเกษตร', value: 'สินค้าการเกษตร' },
  { value: 'Info', label: 'Info' },
  { value: 'Success', label: 'Success' },
  { value: 'Danger', label: 'Danger' },
  { value: 'Primary', label: 'Primary' },
];

interface Props {}

const AddTruck: React.FC<Props> = observer((props: any) => {
  const [checkbox, setCheckbox] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [haveImage, setHaveImage] = useState(false);
  const [render, setRender] = useState(false);
  const [disable, setDisable] = useState(false);

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

  const onRemoveImg = (index: number) => {
    const images = pictures.filter((img, i) => i != index);
    setPictures(images);
  };

  return (
    <Card>
      <CardBody>
        <form>
          <span>เลือกประเภทของรถของคุณ</span>
          <Select options={positionOptions} isMulti placeholder="Select multiple" fullWidth />
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
            <input type="text" />
          </Input>
          <hr />
          <span>ข้อมูลรถของคุณ</span>
          <span>เลขทะเบียนรถ</span>
          <Input fullWidth>
            <input type="text" />
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
          <Select options={region} isMulti placeholder="ภูมิภาค" fullWidth />
          <Select options={province} isMulti placeholder="จังหวัด" fullWidth />
          <br />
          <Button status="Success" type="button" shape="SemiRound" fullWidth>
            ยืนยัน
          </Button>
        </form>
      </CardBody>
    </Card>
  );
});
export default AddTruck;
