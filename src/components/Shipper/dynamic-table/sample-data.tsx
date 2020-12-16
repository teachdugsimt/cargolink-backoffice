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

export const caption = 'List of US Presidents';

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'name',
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
        width: withWidth ? 15 : undefined,
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
        content: 'Approve Date',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Sales Code',
        shouldTruncate: true,
      },
      {
        key: 'action',
        content: 'Action',
        shouldTruncate: true,
      },
      {
        key: 'more',
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
      key: createKey(president.nm),
      //   content: (
      //     <NameWrapper>
      //       <AvatarWrapper>
      //         <Avatar name={president.nm} size="medium" />
      //       </AvatarWrapper>
      //       <a href="https://atlassian.design">{president.nm}</a>
      //     </NameWrapper>
      //   ),
      content: president.id,
    },
    {
      key: createKey(president.pp),
      content: president.pp,
    },
    {
      key: president.id,
      content: president.nm,
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
