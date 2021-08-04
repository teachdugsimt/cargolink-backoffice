export const STALL_HEIGHT = (t: any, productType: any) => {
  const stalls: any[] = [
    { label: t('LOW'), value: 'LOW' },
    { label: t('MEDIUM'), value: 'MEDIUM' },
    { label: t('HIGH'), value: 'HIGH' },
  ];
  if (productType == '3' || productType == '9') return [stalls[0], stalls[2]];
  else if (productType == '15' || productType == '23') return [stalls[1]];
  else if (productType == '24') return stalls;
  return [];
};

export const TIPPER_DUMP = (t: any, productType: any) => {
  const dumps: any[] = [
    { label: t('DUMP'), value: true },
    { label: t('NO_DUMP'), value: false },
  ];
  if (productType == '15' || productType == '23' || productType == '24') return dumps;
  return [];
};
