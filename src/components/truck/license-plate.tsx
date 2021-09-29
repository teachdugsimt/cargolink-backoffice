import React from 'react';
import styled from 'styled-components';

const Plate = styled.div`
  width: 90px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid darkgray;
  border-radius: 5px;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 15;
  text-align: center;
  line-height: 15px;
`;

function LicensePlate(props: any) {
  const plateId = props?.plateId ?? '-';
  return <Plate>{plateId}</Plate>;
}

export default LicensePlate;
