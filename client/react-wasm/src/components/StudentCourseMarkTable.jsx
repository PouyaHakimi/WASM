import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { memoryStdDataFaker, memoryStdCourseFakeData } from '../wasm/memoryData';
import BarChart from './BarChart';
import { getDuckDBCourses, getStudentCourseMark, getFulleMark, getAttendedStudents } from '../API/API';
import { mainDataDuckDB } from '../DuckDB';
import { useEffect } from 'react';
import { faker, it, Faker } from '@faker-js/faker';
import { insertstd, insertCourse, insertMarks } from '../API/API';



function StudentCourseMarkTable(props) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [showChart, setSowChart] = useState(false);

    let stdCourseMarkData;

    if (props.search && props.search.length>0) {
      // Use searchData for rendering
      stdCourseMarkData = props.searchData;
    } else {
      // Default to stdCourseMark if no searchData
      stdCourseMarkData = props.stdCourseMark;
    }
    console.log(JSON.stringify(stdCourseMarkData) );

    const generateChartData = () => {

      // if (!props.fullMarks || !props.attendedStd || props.fullMarks.length === 0 || props.attendedStd.length === 0) {
      //   console.error("Data is not available yet for generating chart.");
      //   return;
      // }

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

                    const dataFm = await getFulleMark()
                    const dataAt = await getAttendedStudents()

                    const fullMarks = JSON.stringify(dataFm)
                    const attendedStd = JSON.stringify(dataAt)
                    console.log(attendedStd + "aaaatttttteeeee");

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
          <div className="col-8 d-flex align-items-center justify-content-center flex-column">
            <Button
              variant="success"
              size="lg"
              onClick={async () => {

                const studentCourseMarkData = await getStudentCourseMark();
                //insertFakeData()





                props.setStdCourseMark(studentCourseMarkData[0]);

                //   props.setFullMarks(arrayFullMaraks);
                //   props.setattendedStd(arrayAttendedStd);
                //fakeDuckDB={fakeDuckDB} setFakeDuckDB={setFakeDuckDB}
              }}
            >
              Exams Result
            </Button>
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


                {/* {console.log(props.stdCourseMark)+"tttttttt"
              } */}
                {/* { props.stdCourseMark.rows.map((std) => (console.log(JSON.stringify(std)+"teeesssttt")))} */}

                {Array.isArray(stdCourseMarkData) && stdCourseMarkData.map((std, index) => (




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

  const insertFakeData = async () => {
    try {

      let students = []
      let courses = []
      let marks = []
      const customFaker = new Faker({ locale: [it] });
      for (let i = 1; i <= 1000; i++) {
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
      for (let i = 1; i <= 1000; i++) {
        marks.push({
          id: i,
          sid: faker.number.int({ min: 1, max: 1000 }),
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

