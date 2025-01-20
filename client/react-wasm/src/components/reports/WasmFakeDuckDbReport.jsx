import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { memoryStdCourseFakeData } from '../../wasm/memoryData'
import { tr } from "@faker-js/faker";
import SpeedTest from "../GaugePointer";


function WasmFakeDuckDBReport(props) {

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loaded , setLoaded] = useState(false)
  const [speed, setSpeed] = useState()
  const [maxSpeed, setMaxSpeed] = useState()






  const load = async () => {

    // to measure the performance******************

    console.log(loaded +"$$$$$$$");

    const speed1 = performance.now()


    const fakeData = await memoryStdCourseFakeData();

    console.log("Fetched data:", fakeData);
    if (!fakeData || !fakeData.resultFm || !fakeData.resultAt) {
      throw new Error("Incomplete or invalid data received");
    }

    let arrayFullMaraks = Array.isArray(fakeData.resultFm) ? fakeData.resultFm : JSON.parse(fakeData.resultFm)
    let arrayAttendedStd = Array.isArray(fakeData.resultAt) ? fakeData.resultAt : JSON.parse(fakeData.resultAt)


    props.setFullMarks(arrayFullMaraks);
    props.setattendedStd(arrayAttendedStd);


    const speed2 = performance.now()
    const speedResult = speed2 - speed1
    setSpeed(speedResult)
    setMaxSpeed(speed2)


     setLoaded(true)

     
  }

  const handleChart = () => {
    const labels = props.fullMarks.map((data) => data.course_name);
    const data = props.fullMarks.map((data) => data.student_count);
    const attendedData = props.attendedStd.map((data) => data.attended_students);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Number Of Students',
          data: data,
          attendedData: attendedData,
          backgroundColor: 'rgba(54, 235, 99, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });

  }

  useEffect(() => {
   
   load()
    if (loaded)  
      handleChart()
      
  }, [loaded]);








  return (<>

    <div><BarChart chartData={chartData} /></div>
    <div><SpeedTest speed={speed} maxSpeed={maxSpeed} /></div>
  </>
  )
}


export default WasmFakeDuckDBReport