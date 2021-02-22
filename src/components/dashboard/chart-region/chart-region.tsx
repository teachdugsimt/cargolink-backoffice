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
import populationData from './data.tsx';

const dataSource = populationData.getMaleAgeData();
const customizeTooltip = (arg: any) => {
  return {
    text: `${arg.seriesName} years: ${arg.valueText}`,
  };
};
const ChartCar = () => {
  return (
    <Chart
      id="chart"
      title=""
      dataSource={dataSource}
      // size={{ width: 550, height: 480 }}
    >
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
export default ChartCar;
