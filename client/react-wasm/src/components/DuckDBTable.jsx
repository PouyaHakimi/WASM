import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import {memoryStudentData} from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses } from '../API/API';

function DuckDBTable(props) {
  const [chartData, setChartData] = useState({ labels: [],datasets: [] }); 
    
    

  const [showChart,setSowChart]=useState(false);

  const generateChartData = () => {
    const labels = props.courseDuckDB.map((course) => course.cname); // course names
    const data=[]

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Number Of Students',
          data: data,
          backgroundColor: 'rgba(54, 235, 99, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const handleGenerateChart = ()=>{
    generateChartData();
    setSowChart(true);
  }

  return (
    <div className="container">
      <div className="row">
        {/* Chart Column */}
        <div className="col-4">
          <br />
          <br />
          <div className="card text-center">
            <div className="card-header">Bar Chart</div>
            <div className="card-body">
           { showChart&& <BarChart chartData={chartData}  />}
              <Button className="btn btn-success mt-3" onClick={handleGenerateChart}>
                Generate Chart
              </Button>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="col-8 d-flex align-items-center justify-content-center flex-column">
          <Button
            variant="success"
            size="lg"

            onClick={async () => {
              const res = await memoryStudentData();
              //const courseTest= await getDuckDBCourses();
              //props.setCourseDuckDB(courseTest);
              props.setStdDuckDB(res);
            }}
          >
            Run DuckDB
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {props.stdDuckDB.map((std) => (
                <tr key={std.id}>
                  <td>{std.id}</td>
                  <td>{std.sname}</td>
                  <td>{std.age}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DuckDBTable;









// import {Table,Button} from 'react-bootstrap';
// import DuckDB from '../DuckDB';
// import memoryData from '../wasm/memoryData';
// import BarChart from './BarChart';

// function  DuckDBTable(props) {

 
//   const labels = props.stdDuckDB.map((std) => ( std.sname)); // Extract names for labels
//   const data = props.stdDuckDB.map((std) =>(std.marks) );
 
//   return (

//     <div class="container">
//     <div class="row">
//     <div class="col-4">
//     <br />
//     <br />
//     <br />  
//     <div class="card text-center">
//   <div class="card-header">
//     Featured
//   </div>
//   <div class="card-body">
//     <h5 class="card-title">Special title treatment</h5>
//     <div><BarChart chartData={props.chartData} setChartData={
//           props.setChartData({
//             labels: labels,
//             datasets: [
//               {
//                 label: 'Marks',
//                 data: data,
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//               },
//             ],
//           })
//         }/></div>
//     <a href="#" class="btn btn-primary" onClick={()=>{
       
//     }}>Go somewhere</a>
//   </div>
  
// </div>
//     </div>
//     <div className="col-8 d-flex align-items-center justify-content-center flex-column">
//     <Button variant="success" size="lg" onClick={

// async () => {
//   const res =  await memoryData();

//   // console.log(res.toArray()+"reeeeesssss");
  
//   props.setStdDuckDB(res);
// }
// }>
// Run DuckDB
// </Button>
// <br/>

// <Table striped bordered hover>
// <thead>        
//   <tr>

//     <th>student ID</th>
//     <th>Full Name</th>
//     <th>Mark</th>
//   </tr>
// </thead>
// <tbody>
 
//       {props.stdDuckDB.map((std) => (  
  
    
//       <tr key={std.id}>
//       <td>{std.id}</td>
//       <td>{std.sname}</td>
//       <td>{std.marks}</td>
//     </tr>
//   ))}
  



// </tbody>

// </Table>
//     </div>
//   </div>
//   </div>


    
//   );
// }

// export default DuckDBTable;