import React, { useEffect, useState } from 'react';
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
// import populationData from './data.tsx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';

// const dataSource = populationData.getMaleAgeData();
// const customizeTooltip = (arg: any) => {
//   return {
//     text: `${arg.seriesName} : ${arg.valueText}`,
//   };
// };

interface Props {}

const ChartCar: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { shipperStore } = useMst();
  const [jobsSummary, setJobsSummary] = useState([]);

  useEffect(() => {
    shipperStore.getJobSummary();
  }, []);
  useEffect(() => {
    const jobs_summary = JSON.parse(JSON.stringify(shipperStore.jobs_summary));
    // console.log("jobs_summary:>>", jobs_summary)
    setJobsSummary(jobs_summary);
  }, [shipperStore.jobs_summary, shipperStore.jobs_summary?.length]);

  const customizeTooltip = (arg: any) => {
    return {
      text: `${arg.seriesName} years: ${arg.valueText}`,
    };
  };

  return (
    <Chart
      id="chart"
      title=""
      dataSource={jobsSummary}
      // size={{ width: 550, height: 480 }}
    >
      <CommonSeriesSettings argumentField="productType" type="stackedBar" />
      <Series valueField="west" name="Western" />
      <Series valueField="central" name="Central" />
      <Series valueField="east" name="Eastern" />
      <Series valueField="north" name="North" />
      <Series valueField="south" name="South" />
      <Series valueField="northEast" name="Northeast" />
      <ArgumentAxis>
        <Label />
      </ArgumentAxis>
      <ValueAxis position="left"></ValueAxis>
      <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom" />
      <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
    </Chart>
  );
});
export default ChartCar;
