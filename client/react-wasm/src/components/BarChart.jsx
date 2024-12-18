import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars({ chartData }) {
  console.log(chartData + ")))))))))))))))");



  console.log("Chart Data:", chartData);

  if (!chartData || !chartData.labels || !chartData.datasets) {
    console.error("Invalid chart data format");
    return <div>No data available</div>;
  }

  //convert bigInt to number
  const pData = chartData.datasets[0]?.data.map((value) =>
    typeof value === 'bigint' ? Number(value) : value
  ) || [];

  const uData = chartData.datasets[0]?.attendedData.map((value) =>
    typeof value === 'bigint' ? Number(value) : value
  ) || [];
  const xLabels = chartData.labels; // Extract the labels directly



  return (
    <BarChart
      width={400}
      height={300}
      series={[
        { data: pData, label: 'Full Mark', id: 'pvId' },
        { data: uData, label: 'Attended Students', id: 'uvId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />

  );
}


