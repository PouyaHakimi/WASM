import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getJsonData } from '../API/API';
import { jsonDataDuckDB } from '../DuckDB';
import CustomPaginationActionsTable from './customTable';
import SpeedTest from './GaugePointer';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';



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
 
function QueryResult({ query, setQuery}) {
    const [queryResult, setQueryResult] = useState([]);  // Store API response data
      const [speed, setSpeed] = useState(null)
      const [maxSpeed, setMaxSpeed] = useState(null)
      const [alert,setAlert]=useState(null)
      const[message,setMessage] =useState(false)
        console.log(queryResult.length+"length+++++");
        
    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = async () => {
        console.log("Query submitted: " + query);

        const speed1 = performance.now() // give us time in ms
        const data = await getJsonData({ query });
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
            <Button variant="contained" color="success" onClick={()=>{handleClick();}}>
                Submit
            </Button>
            <br/>
            <br />
          {message && (alert ? ( <Alert severity="error">
               <AlertTitle>Error</AlertTitle>
                     {alert}
             </Alert>):
             <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                        Your query works successfuly!
                </Alert>)}
            <SpeedTest speed={speed} maxSpeed={maxSpeed} />
            <br />
            <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
                <FixedSizeList
                    height={400}
                    width={1000}
                    itemSize={15}
                    itemCount={queryResult.length}  // Dynamic based on result length
                    overscanCount={1000}
                    itemData={queryResult}  // Pass data to row renderer
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
            <br/>
            <br/>
            
           {!alert  && <CustomPaginationActionsTable queryResult={queryResult}/>}
            {/* <text>{JSON.stringify(queryResult)}</text> */}
        </div>
    );
}

export default QueryResult;






// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import { FixedSizeList } from 'react-window';
// import { getAllData, getJsonData } from '../API/API';
// import { jsonDataDuckDB } from '../DuckDB';



// function renderRow({index,style,data}) {
//     // const { index, style } = props;
//     const rowData = data[index] || {};

//     return (
//         <ListItem style={style} key={index} component="div" disablePadding>
//             <ListItemButton>
//                 <ListItemText primary={`Item ${index + 1}`} />
//             </ListItemButton>
//         </ListItem>
//     );
// }
// function queryResult({ query, setQuery }) {

//     const [queryResult, setQueryResult] = useState([]); 

//     const handleChamge = (event) => {
//         setQuery(event.target.value);
//     }

//     const handleClick = async() => {
//         console.log("query submited" + query);
       
//         const data =  await getJsonData({query})
       
//         setQueryResult(data || [])
//     }


//     return (<div>

//         <Box sx={{ width: 500, maxWidth: '100%' }}>
//             <TextField fullWidth label="Insert Your SQL Query"
//                 id="fullWidth"
//                 value={query}
//                 onChange={handleChamge}
//             />
//         </Box>
//         <br />

//         <Button variant="contained" color="success" onClick={handleClick}>
//             Submit
//         </Button>

//         <br />
//         <Box
//             sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
//         >
//             <FixedSizeList
//                 height={400}
//                 width={360}
//                 itemSize={46}
//                 itemCount={200}
//                 overscanCount={5}
//             >
//                 {renderRow}
//             </FixedSizeList>
//         </Box>
//     </div>
//     )

// }

// export default queryResult