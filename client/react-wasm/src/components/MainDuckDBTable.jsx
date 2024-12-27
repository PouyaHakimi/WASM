import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import {memoryStudentData,memoryStdCourseData} from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';

function MainDuckDBTable(props) {
  const [chartData, setChartData] = useState({ labels: [],datasets: [] }); 
    
    

  const [showChart,setSowChart]=useState(false);

  const generateChartData = () => {
    const labels = props.fullMarks.map((data) => data.course_name); // course names
    
    
    const data=props.fullMarks.map((data) => data.student_count)
    const attendedData=props.attendedStd.map((data) => data.attended_students)
    console.log("stdcount   "+attendedData);
    


    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Number Of Students',
          data: data,
          attendedData:attendedData,
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
              <Button className="btn btn-success mt-3" onClick={
                   
                async()=>{
                  console.log("full Markssssss"+props.fullMarks[0]);
                  handleGenerateChart()
                }
                
                }>
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
              //const res = await memoryStudentData();
              const mainData2 = await mainDataDuckDB();
              const mainData= await memoryStdCourseData();
              console.log(mainData+"kiiirriiittooo");
              
              
            //  const courseTest= await getDuckDBCourses();
              //props.setCourseDuckDB(courseTest);
             // props.setStdDuckDB(res);

              //*******this three data should be handled in a way that can cover our requirement*/
              props.setMainDuckDB(mainData);
              props.setFullMarks(mainData2.fullMarksArray);
              props.setattendedStd(mainData2.allAttendedArray);
            }}
          >
            Run DuckDB
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Row Number </th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Course Name</th>
                <th>Mark</th>

              </tr>
            </thead>
            <tbody>

             
              {console.log(JSON.stringify(props.mainDuckDB)+"heeereee")
              }
              { props.mainDuckDB.map((std) => (console.log(JSON.stringify(std)+"teeesssttt")))}
              {Array.isArray(props.mainDuckDB)&& props.mainDuckDB.map((std,index) => (
               
                
                
                <tr key={std.key}>
                  <td>{index + 1 }</td>
                  <td>{std.id}</td>
                  <td>{std.sname}</td>
                  <td>{std.cname}</td>
                  <td>{std.marks}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default MainDuckDBTable;

