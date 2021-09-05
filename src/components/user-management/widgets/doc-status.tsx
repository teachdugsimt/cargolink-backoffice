import React from 'react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const colors: any = {
  NO_DOCUMENT: 'gray',
  WAIT_FOR_VERIFIED: 'orange',
  VERIFIED: 'green',
  REJECTED: 'red'
}

function DocStatus(props: any) {

  const { t } = useTranslation(['docStatus'])

  const translateDocStatus = (): string => {
    const status = props.status

    const statusText: any = {
      NO_DOCUMENT: t('noDocument'),
      WAIT_FOR_VERIFIED: t('waitForVerify'),
      VERIFIED: t('verified'),
      REJECTED: t('rejected')
    }

    return statusText[status] || '-'
  }

  return (
    <span style={{ color: colors[props.status], textTransform: 'capitalize' }}>{translateDocStatus()}</span>
  )
}

export default DocStatus
