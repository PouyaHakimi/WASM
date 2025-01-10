
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BarChart from '../BarChart';
import { getFulleMark, getAttendedStudents } from '../../API/API';


function ApiServerReport(props) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });


    const generateChartData = () => {


        let fullMarks1 = Array.isArray(props.fullMarks)
            ? props.fullMarks
            : JSON.parse(props.fullMarks);

        let attendedStd1 = Array.isArray(props.attendedStd)
            ? props.attendedStd
            : JSON.parse(props.attendedStd);


        attendedStd1.map((data) => console.log(data.course_name)
        )

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
        

        const dataFm = await getFulleMark()
        const dataAt = await getAttendedStudents()

        const fullMarks = JSON.stringify(dataFm)
        const attendedStd = JSON.stringify(dataAt)


        props.setFullMarks(fullMarks);
        props.setattendedStd(attendedStd);
        generateChartData();
    }

    useEffect(() => {

        handleGenerateChart()

    }, [props.fullMarks, props.attendedStd]);
    return <BarChart chartData={chartData} />

}


export default ApiServerReport