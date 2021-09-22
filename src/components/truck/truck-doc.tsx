import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SectionHeader } from '../../theme/typography';
import { ListFile } from '../list-file/list-file';
import UploadButton from '../UploadButton';
import LicensePlate from './license-plate';
import DynamicTable from '@atlaskit/dynamic-table';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import moment from 'moment';
import { useMst } from '../../stores/root-store';
import { useTranslation } from 'react-i18next';

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
        width: withWidth ? 20 : undefined,
      },
    ],
  };
};

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const transformData = (data: object[]) => {
  return data.map((e: any) => ({
    licensePlate: e.registrationNumber.join(', '),
    fileName: e.document ? e.document[0] : '-',
    createdAt: e.createdAt,
    status: e.document_status,
    url: '',
  }));
};

function TruckDoc(props: any) {
  const head = createHead(true);
  const { carrierId } = props;
  const { truckStore, loginStore } = useMst();
  const { t } = useTranslation('docStatus');
  const [fileList, setFileList] = useState<object[]>([]);
  const [fileStatus, setFileStatus] = useState('NO_DOCUMENT');

  useEffect(() => {
    // console.log('USER DATA', loginStore.data_profile?.userId)
    async function fetchData() {
      if (carrierId) {
        const data = await truckStore.getTrucksListByCarrierId({ carrierId });
        console.log(data);
        setFileList(transformData(data.data) ?? []);
      }
    }

    fetchData();
  }, []);

  const rows = fileList.map((file: any, index: number) => ({
    key: `row-${index}-${createKey(file.licensePlate)}`,
    cells: [
      {
        key: `${index}-${createKey(file.licensePlate)}`,
        content: file.licensePlate,
      },
      {
        key: createKey(file.fileName),
        content: <a href={file.url}>{file.fileName}</a>,
      },
      {
        content: moment(file.createdAt).format('ll'),
      },
      {
        key: createKey(file.fileName),
        content: (
          <DropdownMenu trigger={fileStatus} triggerType="button">
            <DropdownItemGroup>
              <DropdownItem
                onClick={(e: any) => {
                  console.log(e);
                }}
                isCompact
              >
                {'NO_DOCUMENT'}
              </DropdownItem>
              <DropdownItem
                onClick={(e: any) => {
                  console.log(e);
                }}
                isCompact
              >
                {'WAIT_FOR_VERIFIED'}
              </DropdownItem>
              <DropdownItem isCompact>{'APPROVED'}</DropdownItem>
              <DropdownItem isCompact>{'REJECTED'}</DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        ),
      },
    ],
  }));

  return (
    <DocItem>
      <SectionHeader>เอกสารรถ</SectionHeader>

      <DynamicTable
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={truckStore.userTrucks_loading}
        isFixedSize
        // defaultSortKey="licensePlate"
        // defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />

      {/* <Row>
        <LicensePlate plateId="5กก 1234" />
        <UploadButton isLoading={false} accept=".pdf" onChange={() => { }} />
      </Row> */}

      {/* {
        files.map(e => {
          return <ListFile />
        })
      } */}
    </DocItem>
  );
}

export default TruckDoc;
