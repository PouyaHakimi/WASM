
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { memoryStdMarkData } from '../../wasm/memoryData'


function WasmApiDuckDBReport(props) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });


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
       

        const stdMarkData = await memoryStdMarkData({ search: props.search })
        props.setFullMarks(stdMarkData.resultFm);
        props.setattendedStd(stdMarkData.resultAt);
        generateChartData();

    }

    useEffect(() => {

        handleGenerateChart()

    }, [props.fullMarks, props.attendedStd]);
    return <BarChart chartData={chartData} />

}

export default WasmApiDuckDBReport