import React from 'react';
import { OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { TFunction } from 'i18next';
import Dropdown from '../../dropdowns/generic';

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
  return <Dropdown options={statusOptions} placeholder={t('status')} minWidth="200px" onChange={onChange} />;
};

export default JobStatusFilter;