import React from 'react';
import Chart, { ArgumentAxis, Label, Legend, Series } from 'devextreme-react/chart';
import { populationData } from './data.tsx';

const ChartCar = () => {
  return (
    <Chart title="" dataSource={populationData} id="chart">
      <ArgumentAxis tickInterval={10}>
        <Label format="decimal" />
      </ArgumentAxis>
      <Series type="bar" argumentField="arg" type="bar" color="#009058" />
      <Legend visible={false} />
    </Chart>
  );
};
export default ChartCar;
