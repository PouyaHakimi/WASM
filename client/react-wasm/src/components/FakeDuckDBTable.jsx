import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { memoryStdDataFaker, memoryStdCourseFakeData } from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';
import { useEffect } from 'react';
import SpeedTest from './GaugePointer';
import PaginationRecords from './pagination';


function FakeDuckDBTable(props) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showChart, setSowChart] = useState(false);
  const [speed, setSpeed] = useState(null)
  const [maxSpeed, setMaxSpeed] = useState(null)
  const [visibleData, setVisibleData] = useState([]);
  const [startIndex, setStartIndex] = useState();

  const keys = ["id", "sname", "cname", "marks"]

  const pageSize = 100

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

  async function load() {

    //speed Teesst

    const speed1 = performance.now()
    const fakeData = await memoryStdCourseFakeData();
    let arraystdData = Array.isArray(fakeData.resulstd) ? fakeData.resulstd : JSON.parse(fakeData.resulstd)

    if (props.search && props.search.length > 0) {

      let filterResult = arraystdData.filter(item =>
        keys.some(key =>
          item[key]?.toString().toLowerCase().includes(props.search.toLowerCase())  // Partial match within words
        )
      )

      const initialData = filterResult.slice(0,pageSize)
      setVisibleData(initialData)  // pagination initialization
      props.setFakeDuckDB(filterResult);



      const speed2 = performance.now()
      const speedResult = speed2 - speed1
      setSpeed(speedResult)
      setMaxSpeed(speed2)

    } else {
      const initialData = arraystdData.slice(0, pageSize)
      setVisibleData(initialData)
      props.setFakeDuckDB(arraystdData);


      const speed2 = performance.now()
      const speedResult = speed2 - speed1
      setSpeed(speedResult)
      setMaxSpeed(speed2)
    }


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

                  const fakeData = await memoryStdCourseFakeData();

                  console.log("Fetched data:", fakeData);
                  if (!fakeData || !fakeData.resultFm || !fakeData.resultAt) {
                    throw new Error("Incomplete or invalid data received");
                  }

                  let arrayFullMaraks = Array.isArray(fakeData.resultFm) ? fakeData.resultFm : JSON.parse(fakeData.resultFm)
                  let arrayAttendedStd = Array.isArray(fakeData.resultAt) ? fakeData.resultAt : JSON.parse(fakeData.resultAt)
                  props.setFullMarks(arrayFullMaraks);
                  props.setattendedStd(arrayAttendedStd);
                  handleGenerateChart()

                }

              }>
                Generate Chart
              </Button>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className='col-12'> <SpeedTest speed={speed} maxSpeed={maxSpeed} /></div>
        <div className="col-12 d-flex align-items-center justify-content-center flex-column">

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

              {Array.isArray(visibleData) && visibleData.map((std, index) => (




                <tr key={std.key}>
                  <td>{startIndex + index + 1}</td>
                  <td>{std.id}</td>
                  <td>{std.sname}</td>
                  <td>{std.cname}</td>
                  <td>{std.marks}</td>

                </tr>
              ))}
            </tbody>
          </Table>

          <PaginationRecords
            data={props.fakeDuckDB}
            setVisibleData={setVisibleData}
            setStartIndex={setStartIndex}
          />
        </div>
      </div>
    </div>
  );
}


export default FakeDuckDBTable;

