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
import QueryTable from './QueryTable';
import CircularIndeterminate from './load';
import ReportDialogs from './dialogReport';

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

function StreamWasmQueryResult({ query, setQuery, search, ...props }) {
    const [queryResult, setQueryResult] = useState([]);  // Store API response data
    const [speed, setSpeed] = useState(null)
    const [maxSpeed, setMaxSpeed] = useState(null)
    const [alert, setAlert] = useState(null)
    const [message, setMessage] = useState(false)
    const [counter, setCounter] = useState(false)
    const [success, setSuccess] = useState(null)
    const [loadsign, setLoadSign] = useState(false)

  

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = async () => {
        console.log("Query submitted: " + query);

        if (query) {


            const speed1 = performance.now() // give us time in ms

            const data = await jsonStreamDataDuckDB({ query, counter })

            setQueryResult(data || []);


            if (data.error) {

                setAlert("ERROR: " + data.message)
                setMessage(true)
            } else if (data.success) {
                setAlert("")
                setSuccess("Query done successfully ")
                setMessage(true)
            } else if (data.warning) {

                setAlert("WARNING: " + data.warning)
                setMessage(true)
            } else {
                setAlert("")
                setSuccess("")
                setMessage(false)
            }

            console.log(data);
            console.log(data.data);
            setQueryResult(data.data || []);

            const speed2 = performance.now()
            const speedResult = speed2 - speed1
            setSpeed(speedResult)
            setMaxSpeed(speed2)
        } else {


            const speed1 = performance.now() // give us time in ms

            const data = await jsonStreamDataDuckDB({ query, counter })


            if (data.error) {

                setAlert("ERROR: " + data.message)
                setMessage(true)
            } else if (data.success) {

                setSuccess(data.message)
                setMessage(true)
            } else if (data.warning) {

                setAlert("WARNING: " + data.warning)
                setMessage(true)
            } else {
                setAlert("")
                setMessage(false)
            }



            setQueryResult(data.data || []);

            const speed2 = performance.now()
            const speedResult = speed2 - speed1
            setSpeed(speedResult)
            setMaxSpeed(speed2)
        }

    };



    return (
        <div>

            <Box sx={{ width: 1000, maxWidth: '100%' }}>
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



                    <Button variant="contained" color="success" disabled={!counter} onClick={async () => {
                        await handleClick()

                    }}>
                        Execute Query
                    </Button>

                </Grid>

                <Grid item>

                    <Button variant="contained" color="success" onClick={async () => {
                        setLoadSign(true)
                        await handleClick()
                        setCounter(true)
                        setLoadSign(false)


                    }}>
                        Upload WASM Data
                    </Button>


                </Grid>

                <Grid item>
                    <ReportDialogs queryResult={queryResult} fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd} />
                </Grid>

            </Grid>
            <br />
            <br />
            <Grid container justifyContent="center" alignItems="center" >
                {loadsign && <CircularIndeterminate />}
            </Grid>
            {message && (alert ? (<Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {alert}
            </Alert>) :
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {success}
                </Alert>)}
            <SpeedTest speed={speed} maxSpeed={maxSpeed} />

            {(<QueryTable queryResult={queryResult}
                search={search}
                stdCourseMark={props.stdCourseMark}
                setStdCourseMark={props.setStdCourseMark}
            />)}

            {/* <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
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
            </Box> */}
            <br />
            <br />

            {/* {(!alert && message && <CustomPaginationActionsTable queryResult={queryResult}/>)} */}



        </div>
    );
}

export default StreamWasmQueryResult;



