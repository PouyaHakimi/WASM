import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { memoryJsonStreamStdMarkData } from '../../wasm/memoryData'
import SpeedTest from "../GaugePointer";
import { jsonStreamDataDuckDB } from "../../DuckDB";


function WasmJsonStreamReport({query, ...props}) {

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [speed, setSpeed] = useState()
    const [maxSpeed, setMaxSpeed] = useState()
    const [counter , setCounter] =useState(true)
  


  
    
        const handleGenerateChart = async () => {
    
            //to test the speeed ********
            const speed1 = performance.now()
    
            let query = `SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.cid IN (
                    SELECT DISTINCT cid
                    FROM marks
                    WHERE marks = 30
                    )
            GROUP BY c.cname
            ORDER BY c.cname;`

            const stdAttendedData = await jsonStreamDataDuckDB({query})
            Array.isArray(stdAttendedData)
            console.log("In report******" + JSON.stringify(stdAttendedData.data));
            let courseName = []
            let attended = []

            stdAttendedData.data.map(item => courseName.push(item.course_name))
            stdAttendedData.data.map(item => attended.push(item.attended_students))

            query = `SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;`

            const stdMarkData = await jsonStreamDataDuckDB({query})
            Array.isArray(stdMarkData)
            console.log("In report******" + JSON.stringify(stdMarkData.data));
           
            let fullMarks = []
          
            stdMarkData.data.map(item => fullMarks.push(item.student_count))
            
            setChartData({
                labels: courseName,
                datasets: [
                    {
                        label: 'Number Of Students',
                        data: fullMarks,
                        attendedData: attended,//attendedData,
                        backgroundColor: 'rgba(54, 235, 99, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            });


            console.log(courseName);   
            // props.setFullMarks();
            // props.setattendedStd(attended);
            // generateChartData();
    
            const speed2 = performance.now()
            const speedResult = speed2 - speed1
            setSpeed(speedResult)
            setMaxSpeed(speed2)
            console.log(speedResult);
    
        }
       
        useEffect(() => {
                         
          handleGenerateChart()
       
    
        }, [query]);


        return (<>
            <div><BarChart chartData={chartData} /></div>
            <div><SpeedTest speed={speed} maxSpeed={maxSpeed} /></div>
           
    
        </>)
}
export default WasmJsonStreamReport