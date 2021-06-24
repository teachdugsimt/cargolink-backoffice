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
import { IUserDTO, IUserNull } from '../../../../stores/user-store';
import { UserApi } from '../../../../services';

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
        key: 'email',
        content: 'Email',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'fullName',
        content: 'Full name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 10 : undefined,
      },
      {
        key: 'createdAt',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
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
  const requestUploadToken = async (id: any) => {
    try {
      const response = await UserApi.getUploadLink(id);
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
  }
  const onCopyUploadLinkButtonClick = async (id: any) => {
    const uploadLink = await requestUploadToken(id);
    if (!uploadLink) return;
    Swal.fire({
      titleText: t('uploadLink'),
      text: uploadLink,
      showCancelButton: true,
      cancelButtonText: t('back'),
      confirmButtonText: t('copy'),
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        navigator.clipboard.writeText(uploadLink);
        Swal.fire({
          icon: 'success',
          text: t('URLCopied'),
        });
      }
    });
  }
  return users.map((user: IUserDTO | IUserNull, index: number) => {
    return {
      key: `row-${index}-${user.phoneNumber}`,
      cells: [
        {
          key: user.id,
          content: user.id,
        },
        {
          key: user.phoneNumber,
          content: user.phoneNumber || '-',
        },
        {
          key: user.email,
          content: user.email || '-',
        },
        {
          key: user.fullName,
          content: user.fullName || '-',
        },
        {
          key: moment(user.createdAt, 'DD-MM-YYYY HH:mm').format('YYYYMMDDHHmm'),
          content: DateFormat(user.createdAt as string, language),
        },
        {
          key: user.userId,
          content: '-',
        },
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
