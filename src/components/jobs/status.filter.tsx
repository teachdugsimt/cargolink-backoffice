import React from 'react';
import styled from 'styled-components';
import Select, { OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { TFunction } from 'i18next';

export enum JobStatus {
  ALL = 0,
  OPEN = 1,
  INPROGRESS = 3,
  COMPLETED = 7,
}
interface JobStatusFilterProps {
  t: TFunction;
  onChange: (option: ValueType<OptionType, false>) => any;
}
const JobStatusFilter = ({ t, onChange }: JobStatusFilterProps) => {
  const statusOptions: OptionsType = [
    {
      label: t('all'),
      value: JobStatus.ALL,
    },
    {
      label: t('OPEN'),
      value: JobStatus.OPEN,
    },
    {
      label: t('IN-PROGRESS'),
      value: JobStatus.INPROGRESS,
    },
    {
      label: t('COMPLETED'),
      value: JobStatus.COMPLETED,
    },
  ];
  return (
    <Wrapper style={{ display: 'flex', minWidth: 200, alignItems: 'stretch' }}>
      <Select options={statusOptions} onChange={onChange} placeholder={t('status')} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  min-width: 200px;
  align-items: stretch;
  
  & > div {
    width: 100%;
  }
`;

export default JobStatusFilter;