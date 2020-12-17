import React from 'react';

import { Button, ButtonLink } from '@paljs/ui/Button';
import styled from 'styled-components';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

import { lorem } from './lorem';
import { presidents } from './presidents';

import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';

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

export const caption = `Results found: ${presidents.length}`;

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'party',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'term',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'content',
        content: 'Member Type',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Register Date',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Date of approval',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Sales code',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Action',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
  key: `row-${index}-${president.nm}`,
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
