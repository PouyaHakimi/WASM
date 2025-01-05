import React, { useState ,useEffect} from "react";

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';




const Search = styled('div')(({ theme }) => ({


    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function studentHeader(props) {

    // const [search, setSearch] = useState("")

    const handleSearchChange = event => {
       props.setSearch(event.target.value)
        console.log(props.search);
        
    }
    const handleSearchSubmit = event =>{
        event.preventDefault(); // Prevents page reload
        console.log("search query"+props.search);

        
    }
    const handleClose = () => {
        props.setSearch("")
        props.setSearchData([])
    }
   
    return <header className="header">
        <h1> API Server Data</h1>
        <form className="search-bar " 
        onSubmit={handleSearchSubmit}
        >     
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                    
                    
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={props.search}
                    onChange={handleSearchChange}
                />
              <CloseIcon onClick={handleClose}/>  
            </Search>

        </form>
    </header>
}


export default studentHeader;