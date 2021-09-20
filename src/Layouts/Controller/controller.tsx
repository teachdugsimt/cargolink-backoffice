import React from 'react'
import styled from 'styled-components'

export const Row = styled.div<{
  justifyContent?: string,
  alignItem?: string
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props: any) => props.justifyContent ?? 'center'};
  align-items: ${(props: any) => props.alignItems ?? null};

`

export const Col = styled.div<{ flex?: number }>`
  display: flex;
  flex-direction: column;
  flex: ${(props: any) => props.flex ?? 1};
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
`
