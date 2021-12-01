import React from 'react';
import styled from 'styled-components';
import { navigate, Link } from 'gatsby';
import Swal from 'sweetalert2';
import { TFunction } from 'react-i18next';
import { UserApi } from '../../../services';
import InlineMessage from '@atlaskit/inline-message';
import ReactDOMServer from 'react-dom/server';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import moment from 'moment';
import { HeadType } from '@atlaskit/dynamic-table/dist/types/types';
import images from '../../Themes/images';
import MobileIcon from '@atlaskit/icon/glyph/mobile';
// import DocStatus from '../widgets/doc-status';

export const sortabled: any = {
  phoneNumber: true, //! Note that: DESC = true, ASC = fasle
  fullName: true,
  registerDate: true,
  jobCount: true,
  truckCount: true,
};

const IconWrapper = styled.div`
  margin: 0 2px;
  display: flex;
  justify-content: center;
  span {
    cursor: pointer;
  }
`;

const StatusText = styled.span<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? '#00B132' : '#E03616')};
  text-transform: capitalize;
`;

export const createHead = (withWidth: boolean): HeadType => {
  return {
    cells: [
      {
        key: 'requesterName',
        content: 'Requester name',
        isSortable: true,
        // width: withWidth ? '120px' : undefined,
      },
      {
        key: 'productType',
        content: 'Product Type',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'productName',
        content: 'Product name',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'action',
        content: 'Action',
        shouldTruncate: true,
        // width: 120
      },
    ],
  };
};

export const head = createHead(true);

export const createRow = (
  data: any,
  language: string,
  t: TFunction<string>,
) => {
  console.log('keys', data);

  return data.map((booking: any, index: number) => {
    return {
      key: `row-${index}-${booking.id}`,
      cells: [
        {
          key: `${index}-${booking?.requesterProfile?.fullName}-requesterName`,
          content: booking?.requesterProfile?.fullName ?? '-',
        },
        {
          key: `${index}-${booking?.productType}-productType`,
          content: booking?.productType ?? '-',
        },
        {
          key: `${index}-${booking.productName}-productName`,
          content: booking?.productName ?? '-'
        },
        {
          key: `${index}-${booking.status}-status`,
          content: (
            <Channel>
              <Link to={`/trips/add?job_id=${booking.jobId}&carrier_name=${booking?.requesterProfile?.fullName ?? ''}`}>
                <div className="see-list-trip">
                  <span className="see-list-span">{t('create')}</span>
                </div>
              </Link>
            </Channel>
          )
        },
      ],
    };
  });
};

const SpanHover = styled.span`
  cursor: pointer;
`

const Channel = styled.span`
  display: flex;
  align-items: center;
`
