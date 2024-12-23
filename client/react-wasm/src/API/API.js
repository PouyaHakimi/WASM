import createModule from "../wasm/student2";
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';


const BACKENDURL = 'http://localhost:3001/api'

async function getStudent() {
    const URL = BACKENDURL + '/students';

    try {

        const response = await fetch(URL);
        console.log(response + "*****In APIIII");


        // if (response.ok) {

        //     const list= await response.json();


        //     const Module = await createModule(); // Call the wrapper function to initialize WASM


        //     //Initialize WASM
        //     Module._init_students(list.length);

        //      list.map((student, index) => {

        //         const namePtr = Module._malloc(Module.lengthBytesUTF8(student.sname) + 1);
        //          Module.stringToUTF8(student.sname, namePtr, Module.lengthBytesUTF8(student.sname) + 1);
        //          Module._update_student(index, student.id, namePtr, student.age);//insert data in address of the memory
        //          Module._free(namePtr);

        //     });


        //     const processeddata=list.map((_,index)=>{
        //         const studentPtr=Module._get_student(index);





        //         return {
        //             id: Module.HEAP32[studentPtr / 4],// each entry in heap32 represent 4 bytes of memory (if 0x0020 then 0x0024) to get the pointer position we devide to 4
        //             sname: Module.UTF8ToString(studentPtr + 4), // Assuming offset of 4 for `sname`
        //             age: Module.HEAP32[(studentPtr + 56)/4], //54+2 padding byte 

        //           };
        //         });

        return await response.json()//processeddata

        // } else {

        //         const text = await response.text()
        //         throw new TypeError(text)


        // } 

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
        console.log(result + "In API");
        return result


    } catch (error) {
        console.error('Fetch Error:', error);
    }

}


async function getDuckDBCourses(params) {

    const URL = BACKENDURL + '/courses'
    try {

        const response = await fetch(URL)
        const result = response.json();
        console.log("course In API**" + response);
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }


}

async function getDuckDBMarks() {

    const URL = BACKENDURL + '/marks'
    try {

        const response = await fetch(URL)
        const result = response.json();
        console.log("marks In API**" + response);
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }


}






export { getStudent, getDuckDBStd, getDuckDBCourses,getDuckDBMarks };




