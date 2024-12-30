import createModule from "../wasm/student2";
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';


const BACKENDURL = 'http://localhost:3001/api'

//get student data from database
async function getStudent() {
    const URL = BACKENDURL + '/students';

    try {

        const response = await fetch(URL);
        
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






export { getStudent, getDuckDBStd, getDuckDBCourses,getDuckDBMarks };




