import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SectionHeader } from '../../theme/typography';
import { ListFile } from '../list-file/list-file';
import UploadButton from '../UploadButton';
import LicensePlate from './license-plate';
import DynamicTable, { DynamicTableStateless } from '@atlaskit/dynamic-table';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import moment from 'moment';
import { useMst } from '../../stores/root-store';
import { useTranslation } from 'react-i18next';
import { CommonSeriesSettingsHoverStyle } from 'devextreme-react/chart';
import { ITruck } from '../../services/truck-api';
import { TruckNonPersistStore } from '../../stores/truck-non-persist-store';
import { UploadFilePath } from '../../services/upload-api';
import Select from '@atlaskit/select';
import { Element } from 'chart.js';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

const projects = [
  { id: 1, name: 'Project 1', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 2, name: 'Project 2', avatar: 'https://randomuser.me/api/portraits/men/72.jpg' },
  { id: 3, name: 'Project 3', avatar: 'https://randomuser.me/api/portraits/women/31.jpg' },
];

const DocItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const createHead = (withWidth: boolean) => {
  return {
    // key: "user_truck_doc",
    cells: [
      {
        key: 'licensePlate',
        content: 'License Plate',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'fileName',
        content: 'File name',
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'createdAt',
        content: 'Created at',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'status',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 30 : undefined,
      },
      {
        key: 'upload',
        content: 'Upload',
        width: withWidth ? 20 : undefined,
      },
      {
        key: 'id',
        content: 'ID',
        width: withWidth ? 20 : undefined,
      },
    ],
  };
};

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const transformData = (data: object[]) => {
  if (!data) return []
  console.log('Data transform truck:: ', data);
  if (data && Array.isArray(data))
    return data.map((e: any) => ({
      licensePlate: e.registrationNumber.join(', '),
      fileName: e.document ? e.document[0] : '-',
      createdAt: e.createdAt,
      status: e.document_status,
      url: '',
      id: e.id,
    }));
  else [];
};

function TruckDoc(props: any) {
  const head = createHead(true);
  const { carrierId, id } = props;
  const { truckStore, loginStore } = useMst();
  const { t } = useTranslation('docStatus');
  const [fileList, setFileList] = useState<object[]>([]);
  const [fileStatus, setFileStatus] = useState('NO_DOCUMENT');

  async function fetchData() {
    if (carrierId) truckStore.getTrucksListByCarrierId({ carrierId });
  }

  useEffect(() => {
    const tmpTruckCarrier = JSON.parse(JSON.stringify(truckStore.data_truck_carrier));
    if (tmpTruckCarrier) setFileList(transformData(tmpTruckCarrier) ?? []);
  }, [JSON.stringify(truckStore.data_truck_carrier)]);

  useEffect(() => {
    fetchData();
    return () => {
      setFileList([]);
      truckStore.clearListTruckCarrier();
      TruckNonPersistStore.clearCacheTruckDocument();
    };
  }, []);

  const onUploadDocument = (event: any, truckId: string) => {
    event.persist();
    setTimeout(() => {
      let fileObject = event?.target?.files[0] || undefined;
      if (fileObject) {
        TruckNonPersistStore.uploadTruckDocument(UploadFilePath.VEHICLE_DOC, fileObject, truckId).then(() =>
          fetchData(),
        );
      }
    }, 200);
  };

  const handleDropdownDocStatus = (event: any, file: any) => {
    event.persist();
    setTimeout(() => {
      let valuePick = event?.target?.textContent || 'NO_DOCUMENT';
      console.log('Value pick :: ', valuePick);
      console.log('FILE :: ', file);
      if (file.id && file.fileName && file.fileName?.attach_code)
        truckStore.updateDocumentStatus(file.id, { status: valuePick }, carrierId);
    }, 100);
  };

  // const [selected, setselected] = useState({ label: 'Sydney', value: 'sydney' })

  const rows = fileList.map((file: any, index: number) => ({
    key: `row-${index}-${createKey(file.licensePlate)}`,
    cells: [
      {
        key: `${index}-${createKey(file.licensePlate)}`,
        content: file.licensePlate,
      },
      {
        key: createKey(file.fileName?.file_name),
        content: <a href={file.fileName?.url}>{file.fileName?.file_name || '-'}</a>,
      },
      {
        content: moment(file.createdAt).format('ll'),
      },
      {
        key: `status-${index}-${createKey(file.status)}`,
        content: file?.fileName?.attach_code ? (
          <DropdownMenu trigger={file.status} triggerType="button">
            <DropdownItemGroup>
              <DropdownItem onMouseDown={(e: any) => handleDropdownDocStatus(e, file)} isCompact>
                {'NO_DOCUMENT'}
              </DropdownItem>
              <DropdownItem onMouseDown={(e: any) => handleDropdownDocStatus(e, file)} isCompact>
                {'WAIT_FOR_VERIFIED'}
              </DropdownItem>
              <DropdownItem onMouseDown={(e: any) => handleDropdownDocStatus(e, file)} isCompact>
                {'VERIFIED'}
              </DropdownItem>
              <DropdownItem onMouseDown={(e: any) => handleDropdownDocStatus(e, file)} isCompact>
                {'REJECTED'}
              </DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        ) : (
          <div>-</div>
        ),
      },
      {
        key: `upload-button-${index}`,
        content: (
          <UploadButton
            isLoading={false}
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event: any) => onUploadDocument(event, file.id)}
          />
        ),
      },
      {
        key: `${index}-${createKey(file.id)}`,
        content: file.id,
      },
    ],
  }));

  return (
    <DocItem>
      <SectionHeader>เอกสารรถ</SectionHeader>
      {/* <Select
        onChange={(e: any) => {
          let css4: any = document.querySelector(".react-select__menu")
          let css5: any = document.querySelector(".react-select__menu-list")
          let css6: any = document.querySelector(".react-select__option")
          if (css4) {
            css4.style.zIndex = 400
            css4.style.overflow = 'auto'
            // css4.style.position = 'absolute'
            // css4.style.top = 0
            // css4.style.left = 0
            // css4.style.transform = "translate3d(395px, 326px, 0px)"

          }
          if (css6) {
            css6.style.zIndex = 481
            css6.style.fontSize = 24
          }
          // if (css5) {
          //   css5.style.zIndex = 400
          //   css5.style.overflow = 'auto'
          //   css5.style.maxHeight = '317.5px'

          // }
          console.log("Css 4 :: ", css4)
          console.log("Css 5 :: ", css5)
          console.log("E select : ", e)
        }}
        inputId="single-select-example"
        className="single-select"
        classNamePrefix="react-select"
        options={[
          { label: 'Adelaide', value: 'adelaide' },
          { label: 'Brisbane', value: 'brisbane' },
          { label: 'Canberra', value: 'canberra' },
          { label: 'Darwin', value: 'darwin' },
          { label: 'Hobart', value: 'hobart' },
          { label: 'Melbourne', value: 'melbourne' },
          { label: 'Perth', value: 'perth' },
          { label: 'Sydney', value: 'sydney' },
        ]}
        placeholder="Choose a city"
      /> */}
      <DynamicTableStateless
        head={head}
        rows={rows}
        rowsPerPage={10}
        // defaultPage={1}

        page={1}
        loadingSpinnerSize="large"
        isLoading={truckStore.userTrucks_loading}
        isFixedSize
        // defaultSortKey="licensePlate"
        // defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </DocItem>
  );
}

export default TruckDoc;
