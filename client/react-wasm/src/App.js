// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
// import MyPlot from './components/plotly.js';
// import useWasmData from './wasm/wasmProcessor.js';
import StudentTable from './components/StudentTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStudent, getDuckDBCourses, getDuckDBMarks } from './API/API.js';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import ApiServerLayout from './config/apiServerLayout.js';
import DuckDB from './DuckDB.js';
import FakeDuckDBTable from './components/FakeDuckDBTable.jsx';
import MainDuckDBTable from './components/MainDuckDBTable.jsx';
import { mainDataDuckDB } from './DuckDB.js';
import StudentCourseMarkTable from './components/StudentCourseMarkTable.jsx';
import ApiDuckDBLayout from './config/apiDuckDBLayout.js';
import FakeDockDbLayout from './config/fakeDuckDbLayout.js';

function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students, setStudents] = useState([])
  const [stdDuckDB, setStdDuckDB] = useState([])
  const [chartData, setChartData] = useState(null)
  const [fakeDuckDB, setFakeDuckDB] = useState([])
  const [marksDuckDB,setMarksDuckDB] = useState([])
  const [mainDuckDB,setMainDuckDB] = useState([])
  const [fullMarks,setFullMarks] = useState([])
  const [attendedStd,setattendedStd] = useState([])
  const [stdCourseMark,setStdCourseMark] =useState([])
  const [search, setSearch] = useState("")
  const [searchData ,setSearchData] =useState([])

  searchData.map((s)=>console.log(JSON.stringify(s)+"aaappppp"))
 

  useEffect(() => {
    const loadData = async () => {

      try {
        //optimize way to invoke several data function
       // const [students,courses,marks,maiDataDuckDB]=await Promise.all([getStudent(),getDuckDBCourses(),getDuckDBMarks(),mainDataDuckDB()]);
       const students = await getStudent();
      //const coursetest = await getDuckDBCourses();
      
      //console.log(result + '    test mainData in app');
      setStudents(students);

      //to test all page
     // setStdDuckDB(students)
      //  setCourseDuckDB(courses)
      //  setMarksDuckDB(marks)
      //  setMainDuckDB(maiDataDuckDB)
      } catch (error) {

        console.error("Loading Data Error:" + error)
        
      }
      

    }


    loadData();

  }, [])

  const keys = ["id","sname","cname","marks"]

  useEffect(()=>{
    
    setSearchData(
      stdCourseMark.filter((item) =>
          keys.some((key) =>
              String(item[key]).toLowerCase().includes(search)
          )
      )
  );

stdCourseMark.filter(std => std.sname.includes("pouya"))

  },[search])


  return (

    <BrowserRouter>
      <Routes>
        <Route path='/student' element={<ApiServerLayout search={search} setSearch={setSearch} setSearchData={setSearchData}/>}>
          <Route index element={
            <>

              {/* <StudentTable students={students} /> */}
              <StudentCourseMarkTable stdCourseMark={stdCourseMark} setStdCourseMark={setStdCourseMark} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd} searchData={searchData} setSearchData={setSearchData} search={search}/>

            </>} />
        </Route>
        <Route path='/duckdbfaker' element={<FakeDockDbLayout />}>
          <Route index element={
            <>
              {/* <StudentTable students={students} chartData={chartData} setChartData={setChartData} /> */}
              <FakeDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} setChartData={setChartData} fakeDuckDB={fakeDuckDB} setFakeDuckDB={setFakeDuckDB} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd}/>
            </>

          } />

        </Route>
        <Route path='/all' element={<ApiDuckDBLayout />}>
          <Route index element={
            <>
        
              <MainDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} mainDuckDB={mainDuckDB} setMainDuckDB={setMainDuckDB} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd}/>
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





