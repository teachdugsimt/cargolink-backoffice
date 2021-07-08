import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

const data = {
  labels: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  datasets: [
    {
      label: '# จำนวนรอบวิ่งงาน 7 วันล่าสุด',
      data: [6, 4, 5, 3, 19, 12, 15],
      fill: true,
      backgroundColor: 'rgb(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};


const data_doughnut = {
  labels: ['จ่ายแล้ว', 'ค้างจ่าย'],
  datasets: [
    {
      label: 'ข้อมูลรถ',
      data: [70, 30],
      fill: true,
      backgroundColor: ['#4BC0BF', '#FE9E40'],
    },
  ],
};

const options_doughnut = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

function ChartTrip() {
  return (
    <>
      <Wrapper>
        <InfoWrapper>
          <InfoTitle>
            รายละเอียดการขนส่ง
          </InfoTitle>
          <InfoSubtitle>
            Overview of Last Month
          </InfoSubtitle>

          <InfoValue>
            0.00 THB
          </InfoValue>
          <InfoSubtitle>
            ค้างรับ
          </InfoSubtitle>

          <InfoValue>
            0.00 THB
          </InfoValue>
          <InfoSubtitle>
            ค้างจ่าย
          </InfoSubtitle>
        </InfoWrapper>

        <SummaryWrapper>
          <Doughnut data={data_doughnut} options={options_doughnut} />
        </SummaryWrapper>

        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>


      </Wrapper>
    </>
  )
}

export default ChartTrip

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 30px;
`;

const InfoWrapper = styled.div`
  min-width: 250px;
  display: flex;
  flex-direction: column;
`;

const ChartWrapper = styled.div`
  width: 500px;
  margin-left: 40px;
`;

const SummaryWrapper = styled.div`
  flex: 1;
  max-width: 232px;
  height: 200px;
`;

const InfoTitle = styled.span`
  font-size: 15px;
  color: #333;
`;

const InfoSubtitle = styled.span`
  font-size: 12px;
  color: #999;
  margin-bottom: 25px;
`;

const InfoValue = styled.span`
  font-size: 28px;
  line-height: 28px;
  color: #333;
`;
