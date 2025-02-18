import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { memoryStdDataFaker, memoryStdCourseFakeData } from '../wasm/memoryData';
import BarChart from './BarChart';
import { getFulleMark, getAttendedStudents, getStudentCourseMark, writeJsonFile } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';
import { useEffect } from 'react';
import { faker, it, Faker } from '@faker-js/faker';
import { insertstd, insertCourse, insertMarks, getsearch } from '../API/API';
import SpeedTest from './GaugePointer';
import PaginationRecords from './pagination';




function StudentCourseMarkTable({ search, ...props }) {

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showChart, setSowChart] = useState(false);
  const [speed, setSpeed] = useState(null)
  const [maxSpeed, setMaxSpeed] = useState(null)
  const [visibleData, setVisibleData] = useState([]);
  const [startIndex, setStartIndex] = useState();



  const pageSize = 100


  const generateChartData = () => {



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

  useEffect(() => {


    const loadData = async () => {
      try {

        const speed1 = performance.now() // give us time in ms
        const studentCourseMarkData = await getStudentCourseMark({ search });
        
        props.setStdCourseMark(studentCourseMarkData);
        const initialData = studentCourseMarkData.slice(0, pageSize)
        setVisibleData(initialData)

        const speed2 = performance.now()
        const speedResult = speed2 - speed1
        setSpeed(speedResult)
        setMaxSpeed(speed2)
      } catch (error) {
        console.error("Error during data fetch:", error);
      }



    }

    loadData()
  }, [search])


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

                  const dataFm = await getFulleMark()
                  const dataAt = await getAttendedStudents()

                  const fullMarks = JSON.stringify(dataFm)
                  const attendedStd = JSON.stringify(dataAt)


                  props.setFullMarks(fullMarks);
                  props.setattendedStd(attendedStd);
                  handleGenerateChart()

                }

              }>
                Generate Chart
              </Button>
            </div>
          </div>
        </div>

        {/* Table Column */}


        <SpeedTest speed={speed} maxSpeed={maxSpeed} />
        <div className="col-12 d-flex align-items-center justify-content-center flex-column">

          <Button
            variant="success"
            size="lg"
            onClick={async () => {


              insertFakeData()


            }}
          >
            Insert Fake Data
          </Button>
          <br />

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
                  <td>{startIndex ? startIndex + index + 1 : index + 1}</td>
                  <td>{std.id}</td>
                  <td>{std.sname}</td>
                  <td>{std.cname}</td>
                  <td>{std.marks}</td>

                </tr>
              ))}
            </tbody>
          </Table>

          <PaginationRecords
            data={props.stdCourseMark}
            setVisibleData={setVisibleData}
            setStartIndex={setStartIndex}
          />
        </div>
      </div>
    </div>
  );
}

const insertFakeData = async () => {
  try {

    const datarangeMin = 9500001
    const datarangeMax = 10000000
    let students = []
    let courses = []
    let marks = []
    const customFaker = new Faker({ locale: [it] });
    for (let i = datarangeMin; i <= datarangeMax; i++) {
      students.push({
        id: i,
        sname: customFaker.person.fullName().replace(/'/g, "''"),
        age: faker.number.int({ min: 18, max: 45 })
      })
    }

    for (let i = 1; i <= 10; i++) {
      courses.push({
        cid: i,
        cname: faker.commerce.productName(),
        credits: customFaker.number.int({ min: 6, max: 10 }),

      })
    }
    for (let i = datarangeMin; i <= datarangeMax; i++) {
      marks.push({
        id: i,
        sid: faker.number.int({ min: datarangeMin, max: datarangeMax }),
        cid: faker.number.int({ min: 1, max: 10 }),
        marks: faker.number.int({ min: 17, max: 30 })
      })
    }



    if (students) {
      insertstd("student", students)
    }
    if (courses) {
      insertCourse("courses", courses)

    }
    if (marks) {
      insertMarks("marks", marks)
    }

  } catch (error) {
    console.error('Error generating or inserting fake data:', error.message);
  }
}


export default StudentCourseMarkTable;

