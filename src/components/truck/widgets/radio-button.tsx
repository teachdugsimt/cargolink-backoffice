import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../../stores/root-store'
import { LoadingButton } from '@atlaskit/button';
import styled from 'styled-components';
import { color } from '../../../theme';

export interface ObjectRoundButton {
  label: any
  value: any
  active: boolean
}

interface RadioButtonProps {
  list: Array<ObjectRoundButton>
  onPress?: any
}

const RadioButton = observer((props: RadioButtonProps) => {
  const { list, onPress } = props

  const [reRender, setreRender] = useState<boolean>(false)
  useEffect(() => {
    console.log("TRIGGER LIST ROUND BUTTON ! : ", list)
    setreRender(!reRender)
  }, [JSON.stringify(list)])

  return <Row>
    {list.map((e: ObjectRoundButton, i: number) => {
      return <Button
        key={`radio-${i}-dumpy`}
        active={typeof e.active == 'boolean' ? e.active : false}
        spacing="compact"
        testId={"radio-dump-" + i}
        appearance="primary"
        onClick={() => onPress(e)} sizes={'small'}>
        {e.label + ""}
      </Button>
    })}
  </Row>
})

export default RadioButton


interface ButtonProps {
  active: boolean
}

const Button = styled(LoadingButton) <ButtonProps>`
  border: 1px solid ${color.primary};
  color: ${color.black} !important;
  background: ${({ active }) => (active ? color.primary : color.transparent2)};

  &:hover {
    color: white !important;
    background: ${color.primary};
  }
`;

const Row = styled.div`
  padding-top: 7.5px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-center: flex-start;
`
