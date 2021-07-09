import React from 'react';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import Swal from 'sweetalert2';
import { TFunction } from 'react-i18next';
import { IUserDTO, IUserNull } from '../../../../stores/user-store';
import { UserApi } from '../../../../services';
import InlineMessage from '@atlaskit/inline-message';
import ReactDOMServer from 'react-dom/server';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import EditIcon from '@atlaskit/icon/glyph/edit';
import TrashIcon from '@atlaskit/icon/glyph/trash';

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
        key: 'status',
        content: 'status',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'legalType',
        content: 'legalType',
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

export const createRow = (
  users: any,
  language: string,
  t: TFunction<string>,
  deleteUserFunction?: (userId: string) => any,
) => {
  console.log('keys', users);
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
  const deleteUser = deleteUserFunction ? deleteUserFunction : (userId: string) => null;

  return users.map((user: IUserDTO | IUserNull, index: number) => {
    const translatedLegalType = ((legalType?: string | null) => {
      switch (legalType) {
        case 'INDIVIDUAL':
          return t('individualShort');
        case 'JURISTIC':
          return t('juristic');
        default:
          return '-';
      }
    })(user.legalType);
    const translatedStatus = ((status?: 'ACTIVE' | 'INACTIVE' | null) => {
      switch (status) {
        case 'ACTIVE':
          return <StatusText isActive={true}>{t('userStatus:active')}</StatusText>;
        case 'INACTIVE':
          return <StatusText isActive={false}>{t('userStatus:inactive')}</StatusText>;
        default:
          return '-';
      }
    })(user.status)
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
          key: user.status,
          content: translatedStatus,
        },
        {
          key: user.legalType,
          content: translatedLegalType,
        },
        {
          key: user.id,
          content: (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconWrapper
                data-testid={"genlink-button"}
                onClick={() => user?.userId && onCopyUploadLinkButtonClick(user.userId)}>
                <CopyIcon label="copy" size="medium" />
              </IconWrapper>
              <IconWrapper
                data-testid={"edit-user-button"}
                onClick={() =>
                  navigate('/users/' + user.userId, {
                    state: {
                      id: user.userId,
                    },
                  })
                }>
                <EditIcon label="edit" size="medium" />
              </IconWrapper>
              <IconWrapper
                data-testid={"delete-button"}
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
                    .then(({ isConfirmed }) => isConfirmed && user.userId && deleteUser(user.userId))
                }}>
                <TrashIcon label="delete" size="medium" />
              </IconWrapper>
            </div>
          ),
        },
      ],
    };
  });
};
