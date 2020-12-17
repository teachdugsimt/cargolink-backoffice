import React from 'react';
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  Title,
  Tooltip,
  ArgumentAxis,
  Label,
} from 'devextreme-react/chart';
import service from './data.tsx';

const dataSource = service.getMaleAgeData();
const customizeTooltip = (arg) => {
  return {
    text: `${arg.seriesName} years: ${arg.valueText}`,
  };
};
const ChartArea = () => {
  return (
    <Chart id="chart" title="" dataSource={dataSource} size={{ width: 550, height: 480 }}>
      <CommonSeriesSettings argumentField="state" type="stackedBar" />
      <Series valueField="Western" name="Western" />
      <Series valueField="Central" name="Central" />
      <Series valueField="Eastern" name="Eastern" />
      <Series valueField="North" name="North" />
      <Series valueField="South" name="South" />
      <Series valueField="Northeast" name="Northeast" />
      <ArgumentAxis>
        <Label />
      </ArgumentAxis>
      <ValueAxis position="left"></ValueAxis>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom" />
      <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
    </Chart>
  );
};
export default ChartArea;
