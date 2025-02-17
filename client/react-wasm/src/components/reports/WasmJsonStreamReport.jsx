import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { memoryJsonStreamStdMarkData } from '../../wasm/memoryData'
import SpeedTest from "../GaugePointer";


function WasmJsonStreamReport({query, ...props}) {

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [speed, setSpeed] = useState()
    const [maxSpeed, setMaxSpeed] = useState()


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
    
        const handleGenerateChart = async () => {
    
            //to test the speeed ********
            const speed1 = performance.now()
    
            const stdMarkData = await memoryJsonStreamStdMarkData({query})
            props.setFullMarks(stdMarkData.resultFm);
            props.setattendedStd(stdMarkData.resultAt);
            generateChartData();
    
            const speed2 = performance.now()
            const speedResult = speed2 - speed1
            setSpeed(speedResult)
            setMaxSpeed(speed2)
            console.log(speedResult);
    
        }
    
        useEffect(() => {
    
            handleGenerateChart()
    
        }, [props.fullMarks, props.attendedStd]);
        return (<>
            <div><BarChart chartData={chartData} /></div>
            <div><SpeedTest speed={speed} maxSpeed={maxSpeed} /></div>
    
        </>)
}
export default WasmJsonStreamReport