import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getJsonData, writeJsonFile } from '../API/API';
import { jsonStreamComplexQueryDuckDB, jsonStreamDataDuckDB } from '../DuckDB';
import CustomPaginationActionsTable from './customTable';
import SpeedTest from './GaugePointer';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { memoryJsonStreamComplexQuery, memoryJsonStreamData } from '../wasm/memoryData';


function renderRow({ index, style, data }) {
    const rowData = data[index] || {};  // Get row data, avoid undefined errors

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <ListItemText primary={JSON.stringify(rowData)} /> 
            </ListItemButton>
        </ListItem>
    );
}
 
function StreamWasmQueryResult({ query, setQuery}) {
      const [queryResult, setQueryResult] = useState([]);  // Store API response data
      const [speed, setSpeed] = useState(null)
      const [maxSpeed, setMaxSpeed] = useState(null)
      const [alert,setAlert]=useState(null)
      const [message ,setMessage] = useState(false)
      const [complexQuery,setComplexQuery] = useState(false)
      
    
    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = async () => {
        console.log("Query submitted: " + query);

        if (!query) {
            
        
        const speed1 = performance.now() // give us time in ms
        const data = await memoryJsonStreamData({query}) // to check the outcome
       

        setQueryResult(data || []);
        if(data.error){
            setAlert(data.message)
            setMessage(true)
        }else{
            setAlert("")
            setMessage(true)
        }
        
        setQueryResult(data || []); 
        
        const speed2 = performance.now()
        const speedResult = speed2 - speed1
        setSpeed(speedResult)
        setMaxSpeed(speed2)
    }else{

        const speed1 = performance.now() // give us time in ms
        // const dataDB = await jsonStreamDataDuckDB({query}) // to check the outcome
        // const data = dataDB.convertedBigIntResult
        const data2 = await memoryJsonStreamData({query})
        const data = await jsonStreamDataDuckDB({query})
        setQueryResult(data || []);
        if(data.error){
            setAlert(data.message)
            setMessage(true)
        }else{
            setAlert("")
            setMessage(true)
        }
        
        setQueryResult(data || []); 
        
        const speed2 = performance.now()
        const speedResult = speed2 - speed1
        setSpeed(speedResult)
        setMaxSpeed(speed2)
    }
        
    };

    const handleComplexClick = async () => {
            console.log("Query submitted: " + query);
    
            if (!query) {
    
                const speed1 = performance.now() // give us time in ms
                const data = await jsonStreamComplexQueryDuckDB({ query })
    
    
                setQueryResult(data || []);
                if (data.error) {
                    setAlert(data.message)
                    setMessage(true)
                } else {
                    setAlert("")
                    setMessage(true)
                }
    
                setQueryResult(data || []);
    
                const speed2 = performance.now()
                const speedResult = speed2 - speed1
                setSpeed(speedResult)
                setMaxSpeed(speed2)
    
            } else {
    
                const speed1 = performance.now() // give us time in ms
                //const data = await jsonDataDuckDB({query})
                const data = await jsonStreamComplexQueryDuckDB({ query })
    
    
                setQueryResult(data || []);
                if (data.error) {
                    setAlert(data.message)
                    setMessage(true)
                } else {
                    setAlert("")
                    setMessage(true)
                }
    
                setQueryResult(data || []);
    
                const speed2 = performance.now()
                const speedResult = speed2 - speed1
                setSpeed(speedResult)
                setMaxSpeed(speed2)
    
            }
    
        };

    return (
        <div>
            
            <Box sx={{ width: 1000, maxWidth: '100%'  }}>
                <TextField
                    fullWidth
                    label="Insert Your SQL Query"
                    id="fullWidth"
                    value={query}
                    onChange={handleChange}
                    multiline
                    rows={10}
                />
            </Box>
            <br />
           
            <Grid container spacing={2}>
                   <Grid item>
                         <Button variant="contained" color="success" onClick={handleClick}>
                             Execute Query
                         </Button>
                    </Grid>

                    <Grid item>
                    <Button variant="contained" color="success" onClick={() => {
                        handleComplexClick()
                        setComplexQuery(true);

                    }}>
                        Execute Complex Query
                    </Button>
                    </Grid>

                {/* <Grid item>
                         <Button variant="contained" color="info" onClick={async()=>{await writeJsonFile()}}>
                               Capture Json Data
                         </Button>
                </Grid> */}
            </Grid>
            <br/>
            <br />
          { message && (alert ? ( <Alert severity="error">
               <AlertTitle>Error</AlertTitle>
                     {alert}
             </Alert>):
             <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                        Your query works successfuly!
                </Alert>)}
            <SpeedTest speed={speed} maxSpeed={maxSpeed} />
            
            <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
                <FixedSizeList
                    height={400}
                    width={1000}
                    itemSize={46}
                    itemCount={queryResult.length}  // Dynamic based on result length
                    overscanCount={5}
                    itemData={queryResult}  // Pass data to row renderer
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
            <br/>
            <br/>
            
           {(!alert && message && <CustomPaginationActionsTable queryResult={queryResult}/>)}
         
        </div>
    );
}

export default StreamWasmQueryResult;











// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import { FixedSizeList } from 'react-window';
// import { getQueryJsonData } from '../API/API';
// import { jsonDataDuckDB } from '../DuckDB';
// import CustomPaginationActionsTable from './customTable';
// import SpeedTest from './GaugePointer';
// import AlertTitle from '@mui/material/AlertTitle';
// import Alert from '@mui/material/Alert';



// function renderRow({ index, style, data }) {
//     const rowData = data[index] || {};  // Get row data, avoid undefined errors

//     return (
//         <ListItem style={style} key={index} component="div" disablePadding>
//             <ListItemButton>
//                 <ListItemText primary={JSON.stringify(rowData)} /> 
//             </ListItemButton>
//         </ListItem>
//     );
// }
 
// function QueryResult({ query, setQuery}) {
//     const [queryResult, setQueryResult] = useState([]);  // Store API response data
//       const [speed, setSpeed] = useState(null)
//       const [maxSpeed, setMaxSpeed] = useState(null)
//       const [alert,setAlert]=useState(null)
//       const[message,setMessage] =useState(false)
//         console.log(queryResult.length+"length+++++");
        
//     const handleChange = (event) => {
//         setQuery(event.target.value);
//     };

//     const handleClick = async () => {
//         console.log("Query submitted: " + query);

//         const speed1 = performance.now() // give us time in ms
//         const data = await getQueryJsonData({ query });
//         if(data.error){
//             setAlert(data.message)
//             setMessage(true)
//         }else{
//             setAlert("")
//             setMessage(true)
//         }
        
//         setQueryResult(data || []); 
        
//         const speed2 = performance.now()
//         const speedResult = speed2 - speed1
//         setSpeed(speedResult)
//         setMaxSpeed(speed2)
        

        
//         // if (data) {
//         //     setQueryResult(data || []);  
//         // } else {
//         //     // to check the speed and set the speed guage
//         //     const data = await jsonDataDuckDB({query})
//         //    setQueryResult(data || []);
//         // }
        
//   // Ensure data is an array
//     };

//     return (
//         <div>
            
//             <Box sx={{ width: 1000, maxWidth: '100%'  }}>
//                 <TextField
//                     fullWidth
//                     label="Insert Your SQL Query"
//                     id="fullWidth"
//                     value={query}
//                     onChange={handleChange}
//                     multiline
//                     rows={10}
//                 />
//             </Box>
//             <br />
//             <Button variant="contained" color="success" onClick={()=>{handleClick();}}>
//                 Submit
//             </Button>
//             <br/>
//             <br />
//           {message && (alert ? ( <Alert severity="error">
//                <AlertTitle>Error</AlertTitle>
//                      {alert}
//              </Alert>):
//              <Alert severity="success">
//                   <AlertTitle>Success</AlertTitle>
//                         Your query works successfuly!
//                 </Alert>)}
//             <SpeedTest speed={speed} maxSpeed={maxSpeed} />
//             <br />
//             <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
//                 <FixedSizeList
//                     height={400}
//                     width={1000}
//                     itemSize={15}
//                     itemCount={queryResult.length}  // Dynamic based on result length
//                     overscanCount={1000}
//                     itemData={queryResult}  // Pass data to row renderer
//                 >
//                     {renderRow}
//                 </FixedSizeList>
//             </Box>
//             <br/>
//             <br/>
            
//            {!alert  && <CustomPaginationActionsTable queryResult={queryResult}/>}
//             {/* <text>{JSON.stringify(queryResult)}</text> */}
//         </div>
//     );
// }

// export default QueryResult;



