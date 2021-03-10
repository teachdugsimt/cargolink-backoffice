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
// import service from './data.tsx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../stores/root-store';

interface Props {}

// export default {
//   getMaleAgeData() {
//     return maleAgeData;
//   }
// };

const ChartArea: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { carrierStore } = useMst();
  const [trucksSummary, setTrucksSummary] = useState([]);

  useEffect(() => {
    carrierStore.getTruckSummary();
  }, []);
  useEffect(() => {
    const trucks_summary = JSON.parse(JSON.stringify(carrierStore.trucks_summary));
    // console.log("trucks_summary:>>", trucks_summary)
    setTrucksSummary(trucks_summary);
  }, [carrierStore.trucks_summary, carrierStore.trucks_summary?.length]);

  //  getMaleAgeData = () => {
  //   return trucksSummary
  // }

  // const dataSource = trucksSummary.getMaleAgeData();
  const customizeTooltip = (arg: any) => {
    return {
      text: `${arg.seriesName} years: ${arg.valueText}`,
    };
  };

  return (
    <Chart
      id="chart"
      title=""
      dataSource={trucksSummary}
      // size={{ width: 550, height: 480 }}
    >
      <CommonSeriesSettings argumentField="truckType" type="stackedBar" />
      <Series color="red" valueField="west" name="Western" />
      <Series color="blue" valueField="central" name="Central" />
      <Series color="yellow" valueField="east" name="Eastern" />
      <Series color="orange" valueField="north" name="North" />
      <Series color="green" valueField="south" name="South" />
      <Series color="purple" valueField="nationalWide" name="Northeast" />
      <ArgumentAxis>
        <Label rotationAngle={45} overlappingBehavior="rotate" />
      </ArgumentAxis>
      <ValueAxis position="left"></ValueAxis>
      {/* <Legend verticalAlignment="bottom" horizontalAlignment="center" itemTextPosition="bottom" /> */}
      <Tooltip enabled={true} location="edge" customizeTooltip={customizeTooltip} />
    </Chart>
  );
});
export default ChartArea;
