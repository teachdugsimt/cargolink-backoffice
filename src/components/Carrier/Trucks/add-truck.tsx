import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import Select from '@paljs/ui/Select';
import Switch from '@material-ui/core/Switch';

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

const AddTruck = (props: any) => {
  const fileInput = useRef(null);
  const [checkbox, setCheckbox] = useState(false);
  const useForceUpdate = () => useState()[1];
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    window.addEventListener('keyup', clickFileInput);
    return () => window.removeEventListener('keyup', clickFileInput);
  }, []);

  const clickFileInput = (e: any) => {
    if (fileInput?.current.nextSibling.contains(document.activeElement)) {
      // Bind space to trigger clicking of the button when focused
      if (e.keyCode === 32) {
        fileInput?.current.click();
      }
    }
  };

  const fileNames = () => {
    const { current } = fileInput;

    if (current && current.files.length > 0) {
      let messages = [];
      for (let file of current.files) {
        messages = messages.concat(<p key={file.name}>{file.name}</p>);
      }
      return messages;
    }
    return null;
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
            style={{ color: '#00d68f' }}
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
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <input id="file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
            {fileNames()}
            <input id="file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
            {fileNames()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <input id="file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
            {fileNames()}
            <input id="file" type="file" ref={fileInput} onChange={forceUpdate} multiple />
            {fileNames()}
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
};
export default AddTruck;
