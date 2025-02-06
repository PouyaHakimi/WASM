import { da } from "@faker-js/faker";
import createModule from "../wasm/student2";
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';


const BACKENDURL = 'http://localhost:3001/api'

//get student data from database
// async function getStudent() {
//     const URL = BACKENDURL + '/students';


//     try {
//         const test = await fetch('http://localhost:3001/api/studentCourseMark')
//         console.log("api test" + test);

//         const response = await fetch(URL);
//         console.log(response);

//         return await response.json()//processeddata


//     } catch (error) {

//         console.log(error);
//         return { error: error };

//     }

// }

//fetch data for transfering to duckDB
async function getDuckDBStd({search}) {

    const URL = BACKENDURL + `/students?q=${search}`

    try {

        const response = await fetch(URL)
        const result = await response.json()
        console.log(result + "APIIIIII@@@@@@");
        
        return result


    } catch (error) {
        console.error('Fetch Error:', error);
    }

}

//fetch data for transfering to duckDB
async function getDuckDBCourses({search}) {

    const URL = BACKENDURL + `/courses?q=${search}`
    try {

        const response = await fetch(URL)
        const result = response.json();
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }


}

//fetch data for transfering to duckDB
async function getDuckDBMarks({search}) {

    const URL = BACKENDURL + `/marks?q=${search}`
    try {

        const response = await fetch(URL)
        const result = response.json();
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }

}

async function getFilteredStdCourseMark({search}) {
    
    
    const URL = BACKENDURL + `/filterStd?q=${search}`
    try {

        await new Promise((resolve) => setTimeout(resolve, 500));
        const response = await fetch(URL)
        const result = await response.json();
        console.log("in APIIIII)))   " + result);
        
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }

}


async function getStudentCourseMark({search}) {

    try {
        const URL = BACKENDURL + `/studentCourseMark?q=${search}`
        const response = (await fetch(URL)).json()
        console.log(response +"in API");
        return response
    } catch (error) {
        console.error("Fetch Error" +error)
    }


}

async function getFulleMark() {

    try {
        const URL = BACKENDURL + '/fullmark'
        const response = (await fetch(URL)).json()
        
        return response
    } catch (error) {
        console.error("Fetch Error" +error)
    }


}

async function getAttendedStudents() {

    try {
        const URL = BACKENDURL + '/attended'
        const response = (await fetch(URL)).json()
        console.log(response);
        
        return response
    } catch (error) {
        console.error("Fetch Error" +error)
    }


}

async function getsearch({search}) {
    console.log(search+"search******");
    
    try {
        const URL = BACKENDURL + `/search?q=${search}`
        const response = await fetch(URL); // Await the fetch call
        const data = await response.json(); 
        console.log(JSON.stringify(data) +"9999999999999");
        
        return data
    } catch (error) {
        console.error("Fetch Error" + error);
        
    }
    
}






// ******************Insert Fetch API
async function insertstd(table,records) {

    const URL = BACKENDURL+'/std'
    const response = await fetch(URL,{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({table,records})
    })

    const result = await response.json()
    
   
    if (response.ok) {
        console.log(`data successfully inserted in ${table}`,result);
        return result
        
        
    } else {

        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');
        
    }
    
}



async function insertCourse(table,records) {
        
    const URL = BACKENDURL + '/courses'
    const response = await fetch(URL ,{
        method:'post',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify({table,records})
    })

    const result = await response.json()

    if (response.ok) {
        console.log(`data inserted successfully in ${table}`,result);
        return result
        
    } else {
        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');
    }
}


async function insertMarks(table,records) {
    

    
    const URL = BACKENDURL + '/marks'
    const response = await fetch(URL ,{
        method:'post',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify({table,records})
    })

    const result = await response.json()

    if (response.ok) {
        console.log(`data inserted successfully in ${table}`,result);
        return result
        
    } else {
        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');
    }
}



async function getJsonData({query}) {
    console.log(query +"in API");
    
    try {
        const URL = BACKENDURL + `/queryData?q=${query}`
       // const response = (await fetch(URL)).json()
       const response = await fetch(URL);
        
       // Wait for JSON parsing to complete
       const data = await response.json();
        
       
        return data
    } catch (error) {
        console.error("Fetch Error" +error)
    }


}

async function writeJsonFile() {
    
    
    const URL = BACKENDURL + `/allQueryData`
    try {

        // await new Promise((resolve) => setTimeout(resolve, 500));
        const response = await fetch(URL)
        const result = await response.json();
        console.log("in APIIIII)))   " + result);
        
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }

}



export { getDuckDBStd, getDuckDBCourses, getDuckDBMarks,getFilteredStdCourseMark,writeJsonFile,
    getStudentCourseMark,getFulleMark,getAttendedStudents,insertstd ,insertCourse,insertMarks,getsearch,getJsonData};




