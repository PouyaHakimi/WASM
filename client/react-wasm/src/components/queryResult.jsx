import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getAllData } from '../API/API';



function renderRow(props) {
    const { index, style } = props;

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <ListItemText primary={`Item ${index + 1}`} />
            </ListItemButton>
        </ListItem>
    );
}
function queryResult({ query, setQuery }) {



    const handleChamge = (event) => {
        setQuery(event.target.value);
    }

    const handleClick = () => {
        console.log("query submited" + query);
        getAllData({ query })

    }


    return (<div>

        <Box sx={{ width: 500, maxWidth: '100%' }}>
            <TextField fullWidth label="Insert Your SQL Query"
                id="fullWidth"
                value={query}
                onChange={handleChamge}
            />
        </Box>
        <br />

        <Button variant="contained" color="success" onClick={handleClick}>
            Submit
        </Button>

        <br />
        <Box
            sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
        >
            <FixedSizeList
                height={400}
                width={360}
                itemSize={46}
                itemCount={200}
                overscanCount={5}
            >
                {renderRow}
            </FixedSizeList>
        </Box>
    </div>
    )

}

export default queryResult