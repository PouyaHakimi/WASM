// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import ApiServerLayout from './config/apiServerLayout.js';
import FakeDuckDBTable from './components/FakeDuckDBTable.jsx';
import MainDuckDBTable from './components/ApiDuckDBTable.jsx';
import StudentCourseMarkTable from './components/StudentCourseMarkTable.jsx';
import ApiDuckDBLayout from './config/apiDuckDBLayout.js';
import FakeDockDbLayout from './config/fakeDuckDbLayout.js';
import DashboardLayoutBasic from './config/MainLayout.js';


function App() {


  const [stdDuckDB, setStdDuckDB] = useState([])
  const [chartData, setChartData] = useState(null)
  const [fakeDuckDB, setFakeDuckDB] = useState([])
  const [mainDuckDB, setMainDuckDB] = useState([])
  const [fullMarks, setFullMarks] = useState([])
  const [attendedStd, setattendedStd] = useState([])
  const [stdCourseMark, setStdCourseMark] = useState([])
  const [search, setSearch] = useState("")
  const [fakeFullMarks, setFakeFullMarks] = useState([])
  const [speed, setSpeed] = useState()
  const [maxSpeed, setMaxSpeed] = useState()
  const [query, setQuery] = useState("");
;
  


  return (

    <BrowserRouter>
      <Routes>
        <Route path='/main' >
          <Route index element={
            <>
              <DashboardLayoutBasic stdCourseMark={stdCourseMark} setStdCourseMark={setStdCourseMark} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd} search={search}
                stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} setChartData={setChartData} fakeDuckDB={fakeDuckDB} setFakeDuckDB={setFakeDuckDB} setSearch={setSearch} 
                mainDuckDB={mainDuckDB} setMainDuckDB={setMainDuckDB} setFakeFullMarks={setFakeFullMarks} fakeFullMarks={fakeFullMarks} maxSpeed={maxSpeed} speed={speed} query={query} setQuery={setQuery}/>

           
            </>} />
        </Route>
        <Route path='/student' element={<ApiServerLayout search={search} setSearch={setSearch} />}>
          <Route index element={
            <>

              <StudentCourseMarkTable stdCourseMark={stdCourseMark} setStdCourseMark={setStdCourseMark} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd} search={search} />

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
        <Route path='/all' element={<ApiDuckDBLayout search={search} setSearch={setSearch} />}>
          <Route index element={
            <>

              <MainDuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData} mainDuckDB={mainDuckDB} setMainDuckDB={setMainDuckDB} fullMarks={fullMarks} setFullMarks={setFullMarks} attendedStd={attendedStd} setattendedStd={setattendedStd} search={search} />
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





