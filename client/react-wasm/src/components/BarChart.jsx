import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars({ chartData }) {
  console.log("dataaaaaa" + JSON.stringify(chartData));
  // chartData.map((data)=>(console.log(data.sname)
  // ))

  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [];

  //initialize the chart with courses name
  for (const label of chartData.labels) {
    xLabels.push(label)
  }


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


