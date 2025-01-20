import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { memoryStdMarkData, memoryStdCourseData } from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';
import { useEffect } from 'react';
import { el } from '@faker-js/faker';
import SpeedTest from './GaugePointer';


function MainDuckDBTable(props) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showChart, setSowChart] = useState(false);
  const [speed, setSpeed] = useState(null)
  const [maxSpeed, setMaxSpeed] = useState(null)

  const generateChartData = () => {

    if (!props.fullMarks || !props.attendedStd || props.fullMarks.length === 0 || props.attendedStd.length === 0) {
      console.error("Data is not available yet for generating chart.");
      return;
    }

    let fullMarks1 = Array.isArray(props.fullMarks)
      ? props.fullMarks
      : JSON.parse(props.fullMarks);

    let attendedStd1 = Array.isArray(props.attendedStd)
      ? props.attendedStd
      : JSON.parse(props.attendedStd);

    const labels = Array.isArray(fullMarks1) ? fullMarks1.map((data) => data.course_name) : [] // course names


    const data = Array.isArray(fullMarks1) ? fullMarks1.map((data) => data.student_count) : []
    const attendedData = Array.isArray(attendedStd1) ? attendedStd1.map((data) => data.attended_students) : []


    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Number Of Students',
          data: data,
          attendedData: attendedData,//attendedData,
          backgroundColor: 'rgba(54, 235, 99, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const handleGenerateChart = () => {
    generateChartData();
    setSowChart(true);


  }

  //The useEffect hook ensures the chart is generated only when props.fullMarks and props.attendedStd are populated.

  useEffect(() => {
    if (props.fullMarks && props.attendedStd && props.fullMarks.length > 0 && props.attendedStd.length > 0) {
      generateChartData();
    }
  }, [props.fullMarks, props.attendedStd]);

  async function load() {
    //speed test
    const speed1 = performance.now()

    const mainData = await memoryStdCourseData({ search: props.search });
   

      props.setMainDuckDB(mainData);
      const speed2 = performance.now()
      const speedResult = speed2 - speed1
      setSpeed(speedResult)
      setMaxSpeed(speed2)
     
    


  }

  useEffect(() => {
    load()

  }, [props.search])

  return (
    <div className="container">
      <div className="row">
        {/* Chart Column */}
        <div className="col-12">
          <br />
          <br />
          <div className="card text-center">
            <div className="card-header">Bar Chart</div>
            <div className="card-body">
              
              {showChart && <BarChart chartData={chartData} />}
              <Button className="btn btn-success mt-3" onClick={

                async () => {
                  // console.log("full Markssssss"+props.fullMarks[0]);

                  const stdMarkData = await memoryStdMarkData({ search: props.search })
                  props.setFullMarks(stdMarkData.resultFm);
                  props.setattendedStd(stdMarkData.resultAt);
                  
                  handleGenerateChart()

                }

              }>
                Generate Chart
              </Button>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className='col-12' ><SpeedTest speed={speed} maxSpeed={maxSpeed}/></div> 
        <div className="col-12 d-flex align-items-center justify-content-center flex-column">
          {/* <Button
            variant="success"
            size="lg"
            onClick={async () => {
             
              const mainData = await memoryStdCourseData();
              props.setMainDuckDB(mainData);

            }}
          >
            Run DuckDB
          </Button> */}
         
          
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


              {/* {console.log(JSON.stringify(props.mainDuckDB)+"heeereee")
              } */}
              {/* { props.mainDuckDB.map((std) => (console.log(JSON.stringify(std)+"teeesssttt")))} */}
              {Array.isArray(props.mainDuckDB) && props.mainDuckDB.map((std, index) => (



                <tr key={std.key}>
                  <td>{index + 1}</td>
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

// MainDuckDBTable.defaultProps = {
//   fullMarks: '[]',
//   attendedStd: '[]',
// };
export default MainDuckDBTable;

