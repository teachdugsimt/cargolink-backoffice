import React, { CSSProperties } from 'react';
import { ListFileProps } from './list-file.props';
import { Icon } from 'react-icons-kit';
import { fileText } from 'react-icons-kit/fa/fileText';
import { trash } from 'react-icons-kit/fa/trash';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';

const Text = styled.p`
  margin: 0;
`;

const ROOT: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  marginTop: 10,
  marginBottom: 10,
};

const TRASH: CSSProperties = {
  color: 'red',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
};

const RIGHT: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export function ListFile(props: ListFileProps) {
  const { fileName, date, containerStyle, handleDelete } = props;

  const onClick = handleDelete ? () => handleDelete() : () => {};

  const mainStyle = { ...ROOT, ...containerStyle };

  return (
    <Row style={mainStyle}>
      <Col breakPoint={{ xs: 2, sm: 2, md: 2 }}>
        <Icon icon={fileText} style={{}} size={40} />
      </Col>
      <Col breakPoint={{ xs: 8, sm: 8, md: 8 }}>
        <Text>{fileName}</Text>
        <Text>{date}</Text>
      </Col>
      <Col breakPoint={{ xs: 2, sm: 2, md: 2 }} style={RIGHT}>
        <button style={BUTTON} onClick={onClick}>
          <Icon icon={trash} style={TRASH} size={22} />
        </button>
      </Col>
    </Row>
  );
}
