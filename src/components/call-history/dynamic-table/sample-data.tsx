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
        key: 'fullName',
        content: 'Full name',
        isSortable: true,
        // width: withWidth ? '120px' : undefined,
      },
      {
        key: 'phoneNumber',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? '120px' : undefined,
      },
      {
        key: 'productName',
        content: 'Product name',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'callTime',
        content: 'Call time',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? '120px' : undefined,
      },
      {
        key: 'channel',
        content: 'Channel',
        shouldTruncate: true,
        // width: 120
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
  histories: any,
  language: string,
  t: TFunction<string>,
  onOpenModal?: (jobId: string) => any,
) => {
  console.log('keys', histories);
  const requestUploadToken = async (userId: string) => {
    try {
      const response = await UserApi.getUploadLink(userId);
      if (response && response.status === 200) return response.data.url;
      console.error('get upload link error', response.status, response.data);
    } catch (error) {
      console.error('get upload link error', error);
    }
    Swal.fire({
      icon: 'error',
      text: 'Error while get upload link',
    });
    return null;
  };
  const onCopyUploadLinkButtonClick = (userId: string) => {
    let uploadLink = '';
    const validationMessage = <InlineMessage type="confirmation" secondaryText={t('URLCopied')} />;
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
        requestUploadToken(userId).then((link) => {
          if (link && link.length) {
            Swal.hideLoading();
            uploadLink = link;
            Swal.update({
              titleText: t('uploadLink'),
              text: link,
              showCancelButton: true,
              cancelButtonText: t('back'),
              confirmButtonText: t('copy'),
            });
          } else throw new Error('Upload link is empty');
        });
      },
      customClass: {
        validationMessage: 'swal-validation-no-icon',
      },
      preConfirm: () => {
        const hydrated = ReactDOMServer.renderToStaticMarkup(validationMessage);
        Swal.showValidationMessage(hydrated);
        navigator.clipboard.writeText(uploadLink);
        return uploadLink;
      },
    });
  };

  return histories.map((history: any, index: number) => {
    return {
      key: `row-${index}-${history.id}`,
      cells: [
        {
          key: `${index}-${history.requesterName}-requesterName`,
          content: history.requesterName || '-',
        },
        {
          key: `${index}-${history.requesterPhoneNumber}-phoneNumber`,
          content: history.requesterPhoneNumber || '-',
        },
        {
          key: `${index}-${history.productName}-productName`,
          // content: history.productName || '-',
          content: (
            <div>
              {/* <SpanHover onClick={() => navigate(`/jobs/${history.jobId}`)}> */}
              <SpanHover onClick={() => onOpenModal ? onOpenModal(history.jobId) : null}>
                {history.productName || '-'}
                {` `}
                <ShortcutIcon label="shortcut" size="small" />
              </SpanHover>
            </div>
          )
        },
        {
          key: `${index}-${history.callTime}-callTime`,
          content: moment(history.callTime, 'DD-MM-YYYY HH:mm:ss').format('lll')
        },
        {
          key: `${index}-${history.channel}-channel`,
          // content: history.channel,
          content: (
            <Channel>
              <span style={{ paddingRight: 10 }}>
                {history.channel === 'LINEOA'
                  ? <img src={images.lineOA} width={22} height={22} style={{ paddingLeft: 3 }} />
                  : <MobileIcon label="mobile" size="medium" primaryColor={'#0052CC'} />}
              </span>
              {history.channel}
            </Channel>
          )
        },
        {
          key: `${index}-${history.status}-status`,
          content: (
            <Channel>
              <Link to={`/trips/add?job_id=${history.jobId}&carrier_name=${history?.requesterName ?? ''}`}>
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
