import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import BarChart from './BarChart';
import { getFulleMark, getAttendedStudents, getStudentCourseMark, writeJsonFile } from '../API/API';
import { useEffect } from 'react';
import SpeedTest from './GaugePointer';
import PaginationRecords from './pagination';



function QueryTable({search , ...props}) {
    
    console.log("in Query Table"+search);
    console.log("Query Table result" + props.queryResult );
   
 
  const [visibleData, setVisibleData] = useState([]);
  const [startIndex, setStartIndex] = useState();
  const [data , setData] = useState([]);

  const pageSize = 10

  
 

  // if (!props.queryResult) {
  

  //  loadData()
   
  
  // }
useEffect(() => {
  const loadData = async () => {
    try {

      console.log("daaatdaaa"+ data);
    
      console.log("Inside the table" + props.stdCourseMark);
      
      props.setStdCourseMark(props.queryResult);
      const initialData = props.queryResult.slice(0, pageSize)
      setVisibleData(initialData)
      setData(props.queryResult) 
     
    } catch (error) {
      console.error("Error during data fetch:", error);
    }



  }
 loadData()

  }, [search,props.queryResult,props.stdCourseMark])


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
              
                <th>Row Number </th>
                <th>Student ID</th>
               {visibleData.some(std =>std.sname)  &&<th>Full Name</th>}
               {visibleData.some(std =>std.cname)  &&<th>Course Name</th>}
               {visibleData.some(std =>std.marks)  && <th>Mark</th>}

              </tr>
             
            </thead>
            
            <tbody>

              {Array.isArray(visibleData) && visibleData.map((std, index) => (

                <tr key={std.key}>
                  <td>{startIndex ? startIndex + index + 1 : index + 1}</td>
                  <td>{std.id}</td>
                 { std.sname && <td>{std.sname}</td>}
                 { std.cname && <td>{std.cname}</td>}
                 { std.marks && <td>{std.marks}</td>}

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

export default QueryTable