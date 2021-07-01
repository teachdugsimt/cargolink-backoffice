import React from 'react'
import { observer } from 'mobx-react-lite';
import { navigate } from 'gatsby';
import { useTranslation } from 'react-i18next';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
// import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import InlineEdit from '@atlaskit/inline-edit';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import Select, { ValueType } from '@atlaskit/select';

interface Props {
  id?: number;
}

const EditUser: React.FC<Props> = observer((props: any) => {

  const { t } = useTranslation();

  const userId = props.id;
  type Fields = 'email' | 'legalType' | 'phoneNumber' | 'attachCode' | 'userType';

  const breadcrumbs = (
    <Breadcrumbs onExpand={() => { }}>
      <BreadcrumbsItem onClick={() => navigate('/user-management')} text={t('userManagement')} key="user-management" />
      <BreadcrumbsItem text={t('userInfo')} key="user-info" />
    </Breadcrumbs>
  );

  return (
    <div>

    </div>
  )
})

export default EditUser
