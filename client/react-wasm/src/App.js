// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
// import MyPlot from './components/plotly.js';
// import useWasmData from './wasm/wasmProcessor.js';
import StudentTable from './components/StudentTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getStudent,getDuckDBStd} from './API/API.js';
import {BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import StudentLayout from './config/layouts.js';
import DuckDB from './DuckDB.js';
import DuckDBTable from './components/DuckDBTable.jsx';


function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students,setStudents]=useState([])
  const [stdDuckDB,setStdDuckDB]=useState([])
  const [chartData, setChartData]=useState(null)
  
 
  
  async function loadData() {
    const result = await getStudent();
    console.log(result+"+++++++++");
    
    setStudents(result);
    
  }
  
  useEffect(()=>{
    loadData();
    
    

  },[])
  
  

  
  return (
    
    <BrowserRouter>
    <Routes>
         <Route path='/student' element={<StudentLayout/>}>
         <Route index element={
          <>

            <StudentTable students={students} />
            <DuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} />
            
          </>} />
         </Route>
         <Route path='/duckdb' element={<StudentLayout/>}>
         <Route index element={
           <>
          <StudentTable students={students} chartData={chartData}  setChartData={setChartData}/>
          <DuckDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} chartData={chartData}  setChartData={setChartData} />
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





