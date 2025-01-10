import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { memoryStdCourseFakeData } from '../../wasm/memoryData'
import { tr } from "@faker-js/faker";
import SpeedTest from "../GaugePointer";


function WasmFakeDuckDBReport(props) {

     const [chartData, setChartData] = useState({ labels: [], datasets: [] });
     const [hasGenerated , setHasGenerated] = useState(false)
     let counter = 0
    
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
    
        const handleGenerateChart = useCallback( async () => {
           
            // to measure the performance******************
            const fakeData = await memoryStdCourseFakeData();
            console.log(JSON.stringify(fakeData) +"heeereeeee");
            
            let arrayFullMaraks = Array.isArray(fakeData.resultFm) ? fakeData.resultFm : JSON.parse(fakeData.resultFm)
            let arrayAttendedStd = Array.isArray(fakeData.resultAt) ? fakeData.resultAt : JSON.parse(fakeData.resultAt)
            props.setFullMarks(arrayFullMaraks);
            props.setattendedStd(arrayAttendedStd);
            
            generateChartData();
          console.log("********************");
          
            //till here **********************************
        },[])
    
        useEffect(() => {
            // if (!hasGenerated) {  
            //   const fetchGernerateData = async() =>{
                
            //    // setHasGenerated(true) 
            //   }  
              handleGenerateChart()
             // fetchGernerateData() 
       // }
        
    
        }, []);
        return (<>
       
       <div><BarChart chartData={chartData} /></div>
       <div><SpeedTest/></div> 
       </>
    )
 }


export default WasmFakeDuckDBReport