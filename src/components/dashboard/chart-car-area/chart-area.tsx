import React, { useState, useEffect } from 'react';
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
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';

const dataSource = service.getMaleAgeData();
const customizeTooltip = (arg: any) => {
  return {
    text: `${arg.seriesName} years: ${arg.valueText}`,
  };
};

interface Props {}

const ChartArea: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { carrierStore } = useMst();

  useEffect(() => {
    carrierStore.getTruckSummary();
  }, []);
  useEffect(() => {}, [carrierStore.trucks_summary]);
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
});
export default ChartArea;
