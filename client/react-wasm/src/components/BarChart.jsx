import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars({chartData}) {
  console.log("dataaaaaa"+JSON.stringify(chartData.labels[0]));
  // chartData.map((data)=>(console.log(data.sname)
  // ))
  
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  chartData.labels[0],
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

  return (
    // <BarChart
    //   xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
    //   series={[{ data: [4] }, { data: [1] }, { data: [2,2] }]}
    //   width={400}
    //   height={300}
    // />
    <BarChart
    width={500}
    height={300}
    series={[
      { data: pData, label: 'pv', id: 'pvId' },
      { data: uData, label: 'uv', id: 'uvId' },
    ]}
    xAxis={[{ data: xLabels, scaleType: 'band' }]}
  />
  );
}




// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const BarChart = ({ chartData }) => {
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Student Marks Chart',
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default BarChart;

