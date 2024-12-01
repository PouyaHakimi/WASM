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
import DockDB from './DockDB.js';
import DockDBTable from './components/DockDBTable.jsx';


function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students,setStudents]=useState([])
  const [stdDuckDB,setStdDuckDB]=useState([])
  console.log("++++++"+stdDuckDB);
    
 
 
  
 
  
  async function loadData() {
    const result = await getStudent();
  //  const resDuckDB = await DockDB();
    setStudents(result);
    //setStdDuckDB(resDuckDB)
   // WasmProcessor(student);
  }
  
  useEffect(()=>{
    loadData();
    
    

  },[])
  
  

  
  return (
    
    <BrowserRouter>
    <Routes>
         <Route path='/student' element={<StudentLayout/>}>
         <Route index element={<><StudentTable student={students} /><DockDBTable stdDuckDB={stdDuckDB} setStdDuckDB={setStdDuckDB} /></>} />
         </Route>
         <Route path='/dockDB' element={<StudentLayout/>}>
         <Route index element={<DockDB student={stdDuckDB} />} />
         </Route>
    </Routes>
    {/* Process the students data with WasmProcessor */}
    {/* <WasmProcessor students={students} setStudents={setStudents} /> */}
    </BrowserRouter>
   
  );
}



export default App;





