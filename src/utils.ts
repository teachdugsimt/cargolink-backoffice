import { useState, useLayoutEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from './constants/provinces';

export interface IQueryParams {
  [key: string]: string;
}
export const searchToQueryParams = (search: string): IQueryParams | null => {
  if (search.length === 0) return null;
  if (!search.startsWith('?')) return null;
  const withOutQuestionMark = search.substr(1);
  const paramsArray = withOutQuestionMark.split('&');
  return paramsArray.reduce((result: IQueryParams, current: string) => {
    const [key, value] = current.split('=');
    if (!key || !key.length) return result;
    return {
      ...result,
      [key]: value,
    };
  }, {});
};

export const useWindowSize = () => {
  const isBrowser = typeof window !== 'undefined';
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0);
  const [height, setHeight] = useState(isBrowser ? window.innerHeight : 0);
  useLayoutEffect(() => {
    if (!isBrowser) return false;
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [width, height];
};

export const breakPoints = {
  xs: 0,
  is: 400,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
  xxxl: 1600,
};

const provinceMore = [
  { label: 'Krung Thep Maha Nakhon', value: 1, region: 1 },
  { label: 'Samut Prakan', value: 2, region: 1 },
]

interface TokenData {
  [x: string]: string;
}
export const extractJwtToken = (token: string) => {
  return jwt_decode<TokenData>(token);
};

export const parseMobXToObject = (mobxState: any) => JSON.parse(JSON.stringify(mobxState));

export const toFirstLetterUpperCase = (str: string) => {
  if (!str.length) return str;
  if (str.length === 1) return str.toUpperCase();
  const [firstChar] = str.split('');
  return `${firstChar.toUpperCase()}${str.substr(1)}`;
};

export const findProvince = (address?: string | null) => {
  if (!address) return null;
  const list = [...provinceListTh, ...provinceListEn, ...provinceMore];
  const province = list.find((l) => address.includes(l.label));
  return province?.label || address;
};
export const findRegionFromProvince = (address?: string | null) => {
  if (!address) return null;
  const list = [...provinceListTh, ...provinceListEn, ...provinceMore];
  const province = list.find((l) => address.includes(l.label));
  const regionFound = regionListTh.find((re) => re.value == province?.region);
  return regionFound?.label || address;
};

export const formatPhoneNumber = (phoneNumberString: string) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(66|)?(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? '+66 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phoneNumberString;
};
