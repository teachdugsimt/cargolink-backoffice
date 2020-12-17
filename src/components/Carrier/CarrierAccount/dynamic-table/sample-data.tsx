import React from 'react';

import styled from 'styled-components';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { lorem } from './lorem';
import { presidents } from './presidents';

interface President {
  id: number;
  nm: string;
  pp: string;
  tm: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

function iterateThroughLorem(index: number) {
  return index > lorem.length ? index - lorem.length : index;
}

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

export const caption = '';

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        width: withWidth ? 5 : undefined,
      },
      {
        key: 'party',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'term',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
      {
        key: 'content',
        content: 'Member Type',
        shouldTruncate: true,
      },
      {
        key: 'Status',
        content: 'Register Date',
        shouldTruncate: true,
      },
      {
        key: 'Date of approval',
        content: 'Approve Date',
        shouldTruncate: true,
      },
      {
        key: 'Action',
        content: 'Sales code',
        shouldTruncate: true,
      },
      {
        key: 'Action',
        content: 'Action',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
  // key: `row-${index}-${president.nm}`,
  cells: [
    {
      content: president.id,
    },
    {
      content: president.pn,
    },
    {
      content: president.nm,
    },
    {
      content: president.mt,
    },
    {
      content: president.rd,
    },
  ],
}));
