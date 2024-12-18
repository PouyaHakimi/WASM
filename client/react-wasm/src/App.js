// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
// import MyPlot from './components/plotly.js';
// import useWasmData from './wasm/wasmProcessor.js';
import StudentTable from './components/StudentTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStudent, getDuckDBCourses, getDuckDBMarks } from './API/API.js';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import StudentLayout from './config/layouts.js';
import DuckDB from './DuckDB.js';
import DuckDBTable from './components/DuckDBTable.jsx';
import MainDuckDBTable from './components/MainDuckDBTable.jsx';
import { mainDataDuckDB } from './DuckDB.js';

function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students, setStudents] = useState([])
  const [stdDuckDB, setStdDuckDB] = useState([])
  const [chartData, setChartData] = useState(null)
  const [courseDuckDB, setCourseDuckDB] = useState([])
  const [marksDuckDB,setMarksDuckDB] = useState([])
  const [mainDuckDB,setMainDuckDB] = useState([])

  useEffect(() => {
    const loadData = async () => {

      try {
        //optimize way to invoke several data function
        //const [students,courses,marks,mainData]=await Promise.all([getStudent(),getDuckDBCourses(),getDuckDBMarks(),mainDuckDB()]);
       //const result = await mainDataDuckDB();
      // const coursetest = await getDuckDBCourses();
      
      //console.log(result + '    test mainData in app');
      setStudents(students);

      //to test all page
      setStdDuckDB(students)
      // setCourseDuckDB(courses)
      // setMarksDuckDB(marks)
      //setMainDuckDB(result)
      } catch (error) {

        console.error("Loading Data Error:" + error)
        
      }
      

    }


    loadData();

  }, [])




  return (

    <BrowserRouter>
      <Routes>
        <Route path='/student' element={<StudentLayout />}>
          <Route index element={
            <>

              <StudentTable students={students} />
              <DuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} />

            </>} />
        </Route>
        <Route path='/duckdb' element={<StudentLayout />}>
          <Route index element={
            <>
              <StudentTable students={students} chartData={chartData} setChartData={setChartData} />
              <DuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} setChartData={setChartData} courseDuckDB={courseDuckDB} setCourseDuckDB={setCourseDuckDB} />
            </>

          } />

        </Route>
        <Route path='/all' element={<StudentLayout />}>
          <Route index element={
            <>
        
              <MainDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} setChartData={setChartData} courseDuckDB={courseDuckDB} setCourseDuckDB={setCourseDuckDB} mainDuckDB={mainDuckDB} setMainDuckDB={setMainDuckDB} />
            </>

          } />

        </Route>

      </Routes>
      {/* Process the students data with WasmProcessor */}
      {/* <WasmProcessor students={students} setStudents={setStudents} /> */}
    </BrowserRouter>

  );
}



export default App;





