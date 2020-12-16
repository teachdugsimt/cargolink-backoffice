import React from 'react';
import Chart, { ArgumentAxis, Label, Legend, Series } from 'devextreme-react/chart';
import { populationData } from './data.tsx';

const ChartCar = () => {
  return (
    <Chart title="" dataSource={populationData} id="chart">
      <ArgumentAxis tickInterval={10}>
        <Label format="decimal" />
      </ArgumentAxis>
      <Series type="bar" argumentField="arg" name="My oranges" type="bar" color="#ffaa66" />
      <Legend visible={false} />
    </Chart>
  );
};
export default ChartCar;
