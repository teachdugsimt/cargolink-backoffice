import React, { CSSProperties } from 'react';
import { ListFileProps } from './list-file.props';
import { Icon } from 'react-icons-kit';
import { fileText } from 'react-icons-kit/fa/fileText';
import { trash } from 'react-icons-kit/fa/trash';
import styled from 'styled-components';

const Text = styled.div`
  180px  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 180px;
  // display: flex;
  // flex: 1;
  height: 25px;
  white-space: nowrap;
`;

const TRASH: CSSProperties = {
  color: 'red',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: 15,
  textDecoration: 'underline',
  cursor: 'pointer'
};

export function ListFile(props: ListFileProps) {
  const { fileName, date, handleDelete, handlePreview } = props;

  const onClick = handleDelete ? () => handleDelete() : () => { };
  const clickPreview: any = handlePreview ? handlePreview : () => { }

  return (
    <div style={{
      display: 'flex', marginTop: 12,
      backgroundColor: '#eee', padding: 10,
      borderRadius: 10, flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Icon icon={fileText} style={{}} size={30} />
      <div style={{ display: 'flex', flex: 1, margin: '0 5px' }}>
        <button style={BUTTON} onClick={() => clickPreview(fileName)}><Text>{fileName}</Text></button>
        {date && <Text>{date}</Text>}
      </div>
      <button style={BUTTON} onClick={onClick}>
        <Icon icon={trash} style={TRASH} size={22} />
      </button>
    </div>
  );
}
