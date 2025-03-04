import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import BarChart from './BarChart';
import { getFulleMark, getAttendedStudents, getStudentCourseMark, writeJsonFile } from '../API/API';
import { useEffect } from 'react';
import SpeedTest from './GaugePointer';
import PaginationRecords from './pagination';



function QueryTable({ search, ...props }) {



  const [visibleData, setVisibleData] = useState([]);
  const [startIndex, setStartIndex] = useState();
  const [data ,setData] = useState([])


  const pageSize = 10
  const keys = ["id", "sname", "age", "cid", "cname", "marks", "credits"]



  // if (!props.queryResult) {


  //  loadData()


  // }
  useEffect(() => {
    const loadData = async () => {
      try {

        
         console.log(search + search.length);
        if (search && search.length > 0) {

           setData( props.queryResult.filter(item =>

            keys.some(key => item[key]?.toString().toLowerCase().includes(search.toLowerCase())))
            )
           
          props.setStdCourseMark(data);
          const initialData = data.slice(0, pageSize)
          setVisibleData(initialData)
        } else {
        
          setData(props.queryResult)
          props.setStdCourseMark(props.queryResult);
          const initialData = props.queryResult.slice(0, pageSize)
          setVisibleData(initialData)
        }

      } catch (error) {
        console.error("Error during data fetch:", error);
      }



    }
    loadData()

  }, [search, props.queryResult])


  return (
    <div className="container">
      <div className="row">
        {/* Chart Column */}


        {/* Table Column */}



        <div className="col-12 d-flex align-items-center justify-content-center flex-column">


          <br />

          <Table striped bordered hover>
            <thead>

              <tr>

                 {visibleData.some(std => std) && <th>Row Number </th>}
                {visibleData.some(std => std.id) && <th>Student ID</th>}
                {visibleData.some(std => std.sname) && <th>Full Name</th>}
                {visibleData.some(std => std.cname) && <th>Course Name</th>}
                {visibleData.some(std => std.marks) && <th>Mark</th>}
                {visibleData.some(std => std.age) && <th>Age</th>}
                {visibleData.some(std => std.cid) && <th>Course ID</th>}
                {visibleData.some(std => std.credits) && <th>Credits</th>}
                {visibleData.some(std => std.Number_of_Students) && <th>Number of Students</th>}
                {visibleData.some(std => std.attended_students) && <th>Number of Attended Students</th>}
              </tr>

            </thead>

            <tbody>

              {Array.isArray(visibleData) && visibleData.map((std, index) => (

                <tr key={std.key}>
                  <td>{startIndex ? startIndex + index + 1 : index + 1}</td>
                  {std.id && <td>{std.id}</td>}
                  {std.sname && <td>{std.sname}</td>}
                  {std.cname && <td>{std.cname}</td>}
                  {std.marks && <td>{std.marks}</td>}
                  {std.age && <td>{std.age}</td>}
                  {std.cid && <td>{std.cid}</td>}
                  {std.credits && <td>{std.credits}</td>}
                  {std.Number_of_Students && <td>{std.Number_of_Students}</td>}
                  {std.attended_students && <td>{std.attended_students}</td>}
                </tr>
              ))}
            </tbody>
          </Table>

          <PaginationRecords
            data={data}
            setVisibleData={setVisibleData}
            setStartIndex={setStartIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default QueryTable