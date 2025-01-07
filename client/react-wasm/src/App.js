// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
// import MyPlot from './components/plotly.js';
// import useWasmData from './wasm/wasmProcessor.js';
import StudentTable from './components/StudentTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStudentCourseMark, getDuckDBMarks, getsearch } from './API/API.js';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import ApiServerLayout from './config/apiServerLayout.js';
import DuckDB from './DuckDB.js';
import FakeDuckDBTable from './components/FakeDuckDBTable.jsx';
import MainDuckDBTable from './components/MainDuckDBTable.jsx';
import { mainDataDuckDB } from './DuckDB.js';
import StudentCourseMarkTable from './components/StudentCourseMarkTable.jsx';
import ApiDuckDBLayout from './config/apiDuckDBLayout.js';
import FakeDockDbLayout from './config/fakeDuckDbLayout.js';
import DashboardLayoutBasic from './config/MainLayout.js';


function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students, setStudents] = useState([])
  const [stdDuckDB, setStdDuckDB] = useState([])
  const [chartData, setChartData] = useState(null)
  const [fakeDuckDB, setFakeDuckDB] = useState([])
  const [marksDuckDB, setMarksDuckDB] = useState([])
  const [mainDuckDB, setMainDuckDB] = useState([])
  const [fullMarks, setFullMarks] = useState([])
  const [attendedStd, setattendedStd] = useState([])
  const [stdCourseMark, setStdCourseMark] = useState([])
  const [search, setSearch] = useState("")
 

  


  useEffect(() => {
    const loadData = async () => {

      try {
        //optimize way to invoke several data function
        // const [students,courses,marks,maiDataDuckDB]=await Promise.all([getStudent(),getDuckDBCourses(),getDuckDBMarks(),mainDataDuckDB()]);
       // const students = await getStudent();
        //const stdcourseMarks = await getStudentCourseMark();
      
        //const coursetest = await getDuckDBCourses();

        //console.log(result + '    test mainData in app');
       // setStudents(students);
        //setStdCourseMark(stdcourseMarks[0])
       

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

  const keys = ["id", "sname", "cname", "marks"]

  useEffect(() => {

    // setFakeDuckDB(fakeDuckDB.filter(item=>
    //   keys.some(key =>item[key].toString().toLowerCase().includes(search))
    // ));
    // setSearchData(
    //   fakeDuckDB.filter((item) =>
    //     keys.some((key) => String(item[key]).toLowerCase().includes(search)
    //     )
    //   )
      
    // );
    const loadData = async () => {
     
        const studentCourseMarkData = await getStudentCourseMark({search});
        setStdCourseMark(studentCourseMarkData);
    }
    
    loadData()
  }, [search])


  return (

    <BrowserRouter>
      <Routes>
        <Route path='/student' element={<ApiServerLayout search={search} setSearch={setSearch} />}>
          <Route index element={
            <>
              <DashboardLayoutBasic stdCourseMark={stdCourseMark} setStdCourseMark={setStdCourseMark} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd}  search={search} />

              {/* <StudentTable students={students} /> */}
              <StudentCourseMarkTable stdCourseMark={stdCourseMark} setStdCourseMark={setStdCourseMark} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd}  search={search} />

            </>} />
        </Route>
        <Route path='/duckdbfaker' element={<FakeDockDbLayout search={search} setSearch={setSearch} />}>
          <Route index element={
            <>
              {/* <StudentTable students={students} chartData={chartData} setChartData={setChartData} /> */}
              <FakeDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} setChartData={setChartData} fakeDuckDB={fakeDuckDB} setFakeDuckDB={setFakeDuckDB} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd} search={search} />
            </>

          } />

        </Route>
        <Route path='/all' element={<ApiDuckDBLayout search={search} setSearch={setSearch}  />}>
          <Route index element={
            <>

              <MainDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} mainDuckDB={mainDuckDB} setMainDuckDB={setMainDuckDB} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd}  search={search}/>
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





