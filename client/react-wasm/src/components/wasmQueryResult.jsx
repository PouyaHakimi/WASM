import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getJsonData, writeJsonFile } from '../API/API';
import { jsonDataDuckDB } from '../DuckDB';
import CustomPaginationActionsTable from './customTable';
import SpeedTest from './GaugePointer';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { memoryJsonData } from '../wasm/memoryData';


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
 
function WasmQueryResult({ query, setQuery}) {
    const [queryResult, setQueryResult] = useState([]);  // Store API response data
      const [speed, setSpeed] = useState(null)
      const [maxSpeed, setMaxSpeed] = useState(null)
      const [alert,setAlert]=useState(null)
      const [message ,setMessage] = useState(false)

      
    
    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = async () => {
        console.log("Query submitted: " + query);

        const speed1 = performance.now() // give us time in ms
        const data = await memoryJsonData({query})
        console.log(Array.isArray(data) +"%%%%%");

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
        
        
        // if (data) {
        //     setQueryResult(data || []);  
        // } else {
        //     // to check the speed and set the speed guage
        //     const data = await jsonDataDuckDB({query})
        //    setQueryResult(data || []);
        // }
        
  // Ensure data is an array
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
                         <Button variant="contained" color="info" onClick={async()=>{await writeJsonFile()}}>
                               Capture Json Data
                         </Button>
                </Grid>
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
            
           {!alert && message && <CustomPaginationActionsTable queryResult={queryResult}/>}
            {/* <text>{JSON.stringify(queryResult)}</text> */}
        </div>
    );
}

export default WasmQueryResult;



