import React from 'react';
import { OptionsType, OptionType, ValueType } from '@atlaskit/select';
import { TFunction } from 'i18next';
import Dropdown from '../../dropdowns/generic';

export enum TruckStatus {
  PENDING = 0,
  APPROVED = 1,
  ALL = -1,
}
interface TruckStatusFilterProps {
  t: TFunction;
  onChange: (option: ValueType<OptionType, false>) => any;
}
const truckStatusFilter = ({ t, onChange }: TruckStatusFilterProps) => {
  const statusOptions: OptionsType = [
    {
      label: t('all'),
      value: TruckStatus.ALL,
    },
    {
      label: t('pending'),
      value: TruckStatus.PENDING,
    },
    {
      label: t('approved'),
      value: TruckStatus.APPROVED,
    },
  ];
  return <Dropdown options={statusOptions} placeholder={t('status')} minWidth="200px" onChange={onChange} />;
};

export default truckStatusFilter;
