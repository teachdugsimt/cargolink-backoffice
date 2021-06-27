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
import InlineMessage from '@atlaskit/inline-message';
import ReactDOMServer from 'react-dom/server';

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

export const createRow = (users: any, language: string, t: TFunction<string>, deleteUserFunction?: (userId: string) => any) => {
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
  };
  const onCopyUploadLinkButtonClick = (id: any) => {
    let uploadLink = '';
    const validationMessage = <InlineMessage type="confirmation" secondaryText={t('URLCopied')} />;
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
        requestUploadToken(id).then((link) => {
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
        const hydrated = ReactDOMServer.renderToStaticMarkup(validationMessage)
        Swal.showValidationMessage(hydrated);
        navigator.clipboard.writeText(uploadLink);
        return uploadLink;
      },
    });
  }
  const deleteUser = deleteUserFunction ? deleteUserFunction : (userId: string) => null;
  
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
              <Button
                appearance="ghost"
                status="Basic"
                size="Small"
                onClick={() => onCopyUploadLinkButtonClick(user.id)}
              >
                <Icon icon={copy} />
              </Button>
              <Button
                appearance="ghost"
                status="Basic"
                size="Small"
                onClick={() =>
                  navigate('/user-management/user', {
                    state: {
                      id: user.userId,
                    },
                  })
                }
              >
                <Icon icon={edit} />
              </Button>
              <Button
                appearance="ghost"
                status="Basic"
                size="Small"
                onClick={() => {
                  const red = '#E03616';
                  const blue = '#3085D6';
                  Swal.mixin({
                    iconColor: red,
                    confirmButtonColor: red,
                    cancelButtonColor: blue,
                    confirmButtonText: t('delete'),
                    cancelButtonText: t('cancel'),
                  })
                    .fire({
                      title: t('deleteConfirmAlertTitle'),
                      titleText: t('deleteConfirmAlertText'),
                      icon: 'warning',
                      showCancelButton: true,
                    })
                    .then(({ isConfirmed }) => isConfirmed && deleteUser(user.userId))
                }
                }>
                <Icon icon={ic_delete} />
              </Button>
            </div>
          ),
        },
      ],
    };
  });
};
