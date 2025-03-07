import React, { useState ,useEffect} from "react";

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { faker, it, Faker } from '@faker-js/faker';
import { Button } from "@mui/material";
import { insertstd, insertCourse, insertMarks, writeJsonFileServer } from '../../API/API';

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

function mainHeader(props) {

    // const [search, setSearch] = useState("")

    const handleSearchChange = event => {
        
       props.setSearch(event.target.value)
       
        
    }
    const handleSearchSubmit = event =>{
        event.preventDefault(); // Prevents page reload
       

        
    }
    const handleClose = () => {
        props.setSearch("")
        //props.setSearchData([])
    }
   
    return <header className="header">
        <h1> WASM Application</h1>
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
            <div className="d-flex">
            <Button
            variant="success"
            size="lg"
            className="ml-auto"
            onClick={async () => {


              insertFakeData()


            }}
          >
            Insert Fake Data in DB
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={async () => {
                
                await writeJsonFileServer()

            }}
          >
            Insert Data in Json
          </Button>
          </div>
        </form>
    </header>
}


const insertFakeData = async () => {
    try {
  
      const datarangeMin = 16000001
      const datarangeMax = 17000000
      let students = []
      let courses = []
      let marks = []
      const customFaker = new Faker({ locale: [it] });
      for (let i = datarangeMin; i <= datarangeMax; i++) {
        students.push({
          id: i,
          sname: customFaker.person.fullName().replace(/'/g, "''"),
          age: faker.number.int({ min: 18, max: 45 })
        })
      }
  
      for (let i = 1; i <= 10; i++) {
        courses.push({
          cid: i,
          cname: faker.commerce.productName(),
          credits: customFaker.number.int({ min: 6, max: 10 }),
  
        })
      }
      for (let i = datarangeMin; i <= datarangeMax; i++) {
        marks.push({
          id: i,
          sid: i,
          cid: faker.number.int({ min: 1, max: 10 }),
          marks: faker.number.int({ min: 17, max: 30 })
        })
      }
  
  
  
      if (students) {
        insertstd("student", students)
      }
      if (courses) {
        insertCourse("courses", courses)
  
      }
      if (marks) {
        insertMarks("marks", marks)
      }
  
    } catch (error) {
      console.error('Error generating or inserting fake data:', error.message);
    }
  }

export default mainHeader;