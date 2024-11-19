// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
// import MyPlot from './components/plotly.js';
// import useWasmData from './wasm/wasmProcessor.js';
import StudentTable from './components/studentTable.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import getStudent from './API/API.js';
import {BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'


function App() {

  //const { inputArr, outputArr, loading } = useWasmData();
  const [students,setStudents]=useState([])
 console.log("heeereeee"+students);
 
 
  
 
  
  async function loadData() {
    const result = await getStudent();
    setStudents(result);
   // WasmProcessor(student);
  }
  
  useEffect(()=>{
    loadData();
    
    

  },[])
  
  
  return (
    <>
    <BrowserRouter>
    <Routes>
         <Route path='/student'>
         <Route path='' index element={<StudentTable student={students} />} />
         </Route>
    </Routes>
    {/* Process the students data with WasmProcessor */}
    {/* <WasmProcessor students={students} setStudents={setStudents} /> */}
    </BrowserRouter>
    </>
  );
}



export default App;




//<div className="App">
    //   <header className="App-header">
      
    //     <h1>React + WebAssembly Example</h1>
    //   </header>
        
    //   {loading ? (
    //     <p>Loading data...</p>
    //   ) : (
    //     <MyPlot xs={inputArr} ys={outputArr} />
    //   )}
      
    //  <StudentTable  studet={studet}/>
     
     
    //  </div>