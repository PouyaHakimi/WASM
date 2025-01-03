import createModule from "../wasm/student2";
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';


const BACKENDURL = 'http://localhost:3001/api'

//get student data from database
async function getStudent() {
    const URL = BACKENDURL + '/students';


    try {
        const test = await fetch('http://localhost:3001/api/studentCourseMark')
        console.log("api test" + test);

        const response = await fetch(URL);
        console.log(response);

        return await response.json()//processeddata


    } catch (error) {

        console.log(error);
        return { error: error };

    }

}

//fetch data for transfering to duckDB
async function getDuckDBStd() {

    const URL = BACKENDURL + "/dockDB"

    try {

        const response = await fetch(URL)
        const result = await response.json()
        return result


    } catch (error) {
        console.error('Fetch Error:', error);
    }

}

//fetch data for transfering to duckDB
async function getDuckDBCourses(params) {

    const URL = BACKENDURL + '/courses'
    try {

        const response = await fetch(URL)
        const result = response.json();
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }


}

//fetch data for transfering to duckDB
async function getDuckDBMarks() {

    const URL = BACKENDURL + '/marks'
    try {

        const response = await fetch(URL)
        const result = response.json();
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }


}

async function getStudentCourseMark() {

    try {
        const URL = BACKENDURL + '/studentCourseMark'
        const response = (await fetch(URL)).json()
        console.log(response);
        
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



export { getStudent, getDuckDBStd, getDuckDBCourses, getDuckDBMarks,
    getStudentCourseMark,getFulleMark,getAttendedStudents,insertstd ,insertCourse,insertMarks};




