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
        key: 'name',
        content: 'Job No.',
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'party',
        content: 'Name of  shipper',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'term',
        content: 'Type of goods',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'content',
        content: 'Route',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Valid unit',
        shouldTruncate: true,
      },
      {
        key: 'content',
        content: 'Status',
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
      content: president.tm,
    },
    {
      key: createKey(president.pp),
      content: president.nm,
    },
    {
      key: president.id,
      content: president.pp,
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
    // {
    //   key: createKey(president.pp),
    //   content: president.pp,
    // },
    // {
    //   key: createKey(president.pp),
    //   content: president.pp,
    // },
    // {
    //   key: createKey(president.pp),
    //   content: (
    //     <div>
    //       <Button appearance="ghost" status="Basic" size="Small">
    //         <Icon icon={edit} />
    //       </Button>
    //       <Button appearance="ghost" status="Basic" size="Small">
    //         <Icon icon={ic_delete} />
    //       </Button>
    //     </div>
    //   ),
    // },
  ],
}));
