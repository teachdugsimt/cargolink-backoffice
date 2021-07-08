import React from 'react';
import styled from 'styled-components';
import B from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

interface AddButtonProps {
  onClick: () => any;
  children: any;
}
const AddButton = (props: AddButtonProps) => {
  const { onClick, children } = props;
  return (
    <Button onClick={onClick} iconBefore={<AddIcon label="add" size="small" />}>
      {children}
    </Button>
  );
};

const Button = styled(B)`
  border: 1px solid #00b132;
  color: #00b132 !important;
  background: transparent;

  &:hover {
    color: white !important;
    background: #00b132;
  }
`;

export default AddButton;