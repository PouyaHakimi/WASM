import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getJsonData, writeJsonFile } from '../API/API';
import { jsonStreamDataDuckDB } from '../DuckDB';
import CustomPaginationActionsTable from './customTable';
import SpeedTest from './GaugePointer';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { memoryJsonStreamComplexQuery, memoryJsonStreamData } from '../wasm/memoryData';
import { memoryAllJsonData } from '../wasm/memoryAllData';


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
      const [counter , setCounter] = useState(true)
      const [complexCounter , setComplexCounter] = useState(true)
    
   

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = async () => {
        console.log("Query submitted: " + query);

        if (!query) {
            
        
        const speed1 = performance.now() // give us time in ms
      //  const data = await memoryJsonStreamData({query,counter}) // to check the outcome
        const data = await jsonStreamDataDuckDB({query,counter})
      // const data = await memoryAllJsonData({query,counter}) 
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
       // const data = await memoryJsonStreamData({query,counter})
        const data = await jsonStreamDataDuckDB({query,counter})
        //const data = await memoryAllJsonData({query,counter}) 
        
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
                const data = await memoryJsonStreamComplexQuery({ query,complexCounter })
    
    
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
                const data = await memoryJsonStreamComplexQuery({ query,complexCounter })
    
    
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
                         <Button variant="contained" color="success" onClick={async()=>{
                            await handleClick();
                            setCounter(false)
                            }}>
                             Execute Query
                         </Button>
                    </Grid>

                    <Grid item>
                    <Button variant="contained" color="success" onClick={() => {
                        handleComplexClick();
                        setComplexQuery(false);
                         

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
            
           {/* {(!alert && message && <CustomPaginationActionsTable queryResult={queryResult}/>)} */}
         
        </div>
    );
}

export default StreamWasmQueryResult;



