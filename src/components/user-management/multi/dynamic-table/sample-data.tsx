import React from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
import moment from 'moment';

import { Icon } from 'react-icons-kit';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import { edit } from 'react-icons-kit/fa/edit';
import { copy } from 'react-icons-kit/fa/copy';
import { DateFormat } from '../../../simple-data';
import { navigate } from 'gatsby';
import Swal from 'sweetalert2';
import { TFunction, useTranslation } from 'react-i18next';

export const sortabled: any = {
  phoneNumber: true, //! Note that: DESC = true, ASC = fasle
  fullName: true,
  registerDate: true,
  jobCount: true,
  truckCount: true,
};

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
        key: 'phoneNumber',
        content: 'Phone number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'fullName',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'registerDate',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
      // {
      //   key: 'userType',
      //   content: 'User Type',
      //   shouldTruncate: true,
      //   isSortable: true,
      // },
      {
        key: 'legalType',
        content: 'Legal Type',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'action',
        content: '',
        shouldTruncate: true,
      },
    ],
  };
};

export const head = createHead(true);

export const createRow = (users: any, language: string, t: TFunction<string>) => {
  console.log('keys', users);
  const requestUploadToken = (id: any) => {
    //TODO request token from api
    return 'dummytokenfromid';
  }
  const onCopyUploadLinkButtonClick = (id: any) => {
    const token = requestUploadToken(id);
    const dummyBaseURL = 'https://cargolink.com/user/upload';
    const baseURL = dummyBaseURL;
    const uploadLink = `${baseURL}?token=${token}`;
    Swal.fire({
      titleText: t('uploadLink'),
      text: uploadLink,
      showCancelButton: true,
      cancelButtonText: t('back'),
      confirmButtonText: t('copy'),
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        // document?.execCommand('copy');
        navigator.clipboard.writeText(uploadLink);
        Swal.fire({
          icon: 'success',
          text: t('URLCopied'),
        });
      }
    });
  }
  return users.map((user: any, index: number) => {
    return {
      key: `row-${index}-${user.phoneNumber}`,
      cells: [
        {
          key: index,
          content: index + 1,
        },
        {
          key: user.phoneNumber,
          content: user.phoneNumber,
        },
        {
          key: user.fullName,
          content: user.fullName,
        },
        {
          key: moment(user.registerDate, 'DD-MM-YYYY HH:mm').format('YYYYMMDDHHmm'),
          content: DateFormat(user.registerDate, language),
        },
        {
          key: user.jobCount,
          content: user.jobCount,
        },
        // {
        //   key: user.truckCount,
        //   content: user.truckCount,
        // },
        {
          key: user.id,
          content: (
            <div style={{ textAlign: 'right' }}>
              <Button appearance="ghost" status="Basic" size="Small" onClick={() => onCopyUploadLinkButtonClick(user.id)}>
                <Icon icon={copy} />
              </Button>
              <Button
                appearance="ghost"
                status="Basic"
                size="Small"
                onClick={() =>
                  navigate('/user-management/user', {
                    state: {
                      id: index + 1,
                    },
                  })
                }
              >
                <Icon icon={edit} />
              </Button>
              <Button appearance="ghost" status="Basic" size="Small" onClick={() => navigate('/user-management/user')}>
                <Icon icon={ic_delete} />
              </Button>
            </div>
          ),
        },
      ],
    };
  });
};
