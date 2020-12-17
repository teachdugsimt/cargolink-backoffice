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
        content: 'Id',
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
        content: 'Fullname',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
      {
        key: 'content',
        content: 'Register Date',
        shouldTruncate: true,
      },
      {
        key: 'Status',
        content: 'Status',
        shouldTruncate: true,
      },
      {
        key: 'Date of approval',
        content: 'Date of approval',
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
  key: `row-${index}-${president.nm}`,
  cells: [
    {
      content: president.id,
    },
    {
      key: createKey(president.nm),
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar name={president.nm} size="medium" />
          </AvatarWrapper>
          <a href="https://atlassian.design">{president.nm}</a>
        </NameWrapper>
      ),
    },
    {
      key: createKey(president.pp),
      content: president.pp,
    },
    {
      key: president.id,
      content: president.tm,
    },
    {
      content: iterateThroughLorem(index),
    },
    {
      content: (
        <DropdownMenu trigger="More" triggerType="button">
          <DropdownItemGroup>
            <DropdownItem>{president.nm}</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      ),
    },
  ],
}));