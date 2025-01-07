import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { memoryStdDataFaker, memoryStdCourseFakeData } from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';
import { useEffect } from 'react';


function FakeDuckDBTable(props) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showChart, setSowChart] = useState(false);

  const keys = ["id", "sname", "cname", "marks"]

  

  const generateChartData = () => {

    if (!props.fullMarks || !props.attendedStd || props.fullMarks.length === 0 || props.attendedStd.length === 0) {
      console.error("Data is not available yet for generating chart.");
      return;
    }
    const labels = Array.isArray(props.fullMarks) ? props.fullMarks.map((data) => data.course_name) : [] // course names
    const data = Array.isArray(props.fullMarks) ? props.fullMarks.map((data) => data.student_count) : []
    const attendedData = Array.isArray(props.attendedStd) ? props.attendedStd.map((data) => data.attended_students) : []


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

  async function load(params) {
    const fakeData = await memoryStdCourseFakeData();
    let arraystdData = Array.isArray(fakeData.resulstd) ? fakeData.resulstd : JSON.parse(fakeData.resulstd)
    let arrayFullMaraks = Array.isArray(fakeData.resultFm) ? fakeData.resultFm : JSON.parse(fakeData.resultFm)
    let arrayAttendedStd = Array.isArray(fakeData.resultAt) ? fakeData.resultAt : JSON.parse(fakeData.resultAt)
   if (props.search && props.search.length > 0) {
    
     props.setFakeDuckDB(arraystdData.filter((item) =>
      keys.some((key) => String(item[key]).toLowerCase().includes(props.search)
      )
    )
  );

   } else {
    
      props.setFakeDuckDB(arraystdData);
   }
   
    props.setFullMarks(arrayFullMaraks);
    props.setattendedStd(arrayAttendedStd);
  }
  useEffect(()=>{
  //  props.setFakeDuckDB(
  //     props.fakeDuckDB.filter((item) =>
  //       keys.some((key) => item[key]?.toString().toLowerCase().includes(props.search)
  //       )
  //     )
      
  //   );  

  load()
    
  },[props.search])

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
              {showChart && <BarChart chartData={chartData} />}
              <Button className="btn btn-success mt-3" onClick={

                async () => {
                  // console.log("full Markssssss"+props.fullMarks[0]);
                  // const mainData2 = await mainDataDuckDB();
                  // const stdMarkData = await memoryStdDataFaker()
                  // props.setFullMarks(stdMarkData.resultFm);
                  // props.setattendedStd(stdMarkData.resultAt);
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

              {Array.isArray(props.fakeDuckDB) && props.fakeDuckDB.map((std, index) => (




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
export default FakeDuckDBTable;

