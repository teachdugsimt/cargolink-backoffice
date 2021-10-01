import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { SectionHeader } from '../../theme/typography';
import UploadButton from '../UploadButton';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import moment from 'moment';
import { useMst } from '../../stores/root-store';
import { useTranslation } from 'react-i18next';
import { TruckNonPersistStore } from '../../stores/truck-non-persist-store';
import { UploadFilePath } from '../../services/upload-api';

const DocItem = styled.div`
  display: flex;
  flex-direction: column;
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

interface Props {
  userId?: number;
  carrierId?: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const transformData = (data: object[]) => {
  if (!data) return [];
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

const TruckDoc: React.FC<Props> = observer((props: any) => {
  const head = createHead(true);
  const { carrierId, id } = props;
  const { truckStore, loginStore } = useMst();
  const { t } = useTranslation('docStatus');
  const [fileList, setFileList] = useState<object[]>([]);

  async function fetchData() {
    if (carrierId) TruckNonPersistStore.getTrucksListByCarrierId({ carrierId });
  }

  useEffect(() => {
    const tmpTruckCarrier = JSON.parse(JSON.stringify(TruckNonPersistStore.data_truck_carrier));
    console.log('Trigger Data Truck Carrier List !! : ', tmpTruckCarrier);
    if (tmpTruckCarrier) setFileList(transformData(tmpTruckCarrier) ?? []);
  }, [JSON.stringify(TruckNonPersistStore.data_truck_carrier)]);

  useEffect(() => {
    fetchData();
    return () => {
      setFileList([]);
      TruckNonPersistStore.clearListTruckCarrier();
      TruckNonPersistStore.clearCacheTruckDocument();
    };
  }, []);

  const onUploadDocument = (event: any, truckId: string) => {
    TruckNonPersistStore.setTmpTruckIdForLoadingButt(truckId);
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
        TruckNonPersistStore.updateDocumentStatus(file.id, { status: valuePick }, carrierId);
    }, 100);
  };

  const rows = fileList.map((file: any, index: number) => {
    return {
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
            <DropdownMenu
              trigger={file.status}
              triggerType="button"
              onOpenChange={() => TruckNonPersistStore.setTmpTruckIdForLoadingButt(file.id)}
            >
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
          key: `upload-button-${file.id}`,
          content: (
            <UploadButton
              disabled={TruckNonPersistStore.loading}
              isLoading={TruckNonPersistStore.tmp_truck_id == file.id && TruckNonPersistStore.loading}
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
    };
  });

  return (
    <DocItem>
      <SectionHeader>เอกสารรถ</SectionHeader>
      <DynamicTableStateless
        head={head}
        rows={rows}
        rowsPerPage={10}
        page={1}
        loadingSpinnerSize="large"
        isLoading={TruckNonPersistStore.userTrucks_loading}
        isFixedSize
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </DocItem>
  );
});

export default TruckDoc;
