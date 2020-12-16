import React from 'react';
import { Chart, Series, CommonSeriesSettings, Legend, ValueAxis, Title, Export, Tooltip } from 'devextreme-react/chart';
import service from './data.tsx';

const dataSource = service.getMaleAgeData();

const ChartArea = () => {
  return (
    <Chart id="chart" title="Male Age Structure" dataSource={dataSource}>
      <CommonSeriesSettings argumentField="state" type="stackedBar" />
      <Series valueField="fourWheels" name="4 Wheels" />
      <Series valueField="tenWheels" name="10 wheels" />
      <Series valueField="sixWheels" name="6 wheels" />
      <Series valueField="etWheels" name="18 Wheels" />
      <Series valueField="semi" name="Semi" />
      <Series valueField="ftyTrailer" name="40” Trailer" />
      <Series valueField="twTrailer" name="20” Trailer" />
      <Series valueField="twWheels" name="20 Wheels" />
      <Series valueField="tractorHeadTruck" name="Tractor Head Truck" />
      <Series valueField="bikeCarrierTruck" name="Bike Carrier Truck" />
      <ValueAxis position="left">
        <Title text="millions" />
      </ValueAxis>
      {/* <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="top" /> */}
    </Chart>
  );
};
export default ChartArea;
