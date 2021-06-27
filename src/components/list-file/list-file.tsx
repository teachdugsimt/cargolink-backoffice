import React, { CSSProperties } from 'react';
import { ListFileProps } from './list-file.props';
import { Icon } from 'react-icons-kit';
import { fileText } from 'react-icons-kit/fa/fileText';
import { trash } from 'react-icons-kit/fa/trash';
import styled from 'styled-components';

const Text = styled.p`
  margin: 0;
`;

const TRASH: CSSProperties = {
  color: 'red',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
};

export function ListFile(props: ListFileProps) {
  const { fileName, date, handleDelete } = props;

  const onClick = handleDelete ? () => handleDelete() : () => { };

  return (
    <div style={{ display: 'flex', marginTop: 12 }}>
      <Icon icon={fileText} style={{}} size={40} />
      <div style={{ flex: 1, margin: '0 1rem' }}>
        <Text>{fileName}</Text>
        <Text>{date}</Text>
      </div>
      <button style={BUTTON} onClick={onClick}>
        <Icon icon={trash} style={TRASH} size={22} />
      </button>
    </div>
  );
}
