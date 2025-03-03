import { da } from "@faker-js/faker";
import createModule from "../wasm/student2";
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';
import { JSONParser } from "@streamparser/json-whatwg";


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
async function getDuckDBStd({ search }) {

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
async function getDuckDBCourses({ search }) {

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
async function getDuckDBMarks({ search }) {

    const URL = BACKENDURL + `/marks?q=${search}`
    try {

        const response = await fetch(URL)
        const result = response.json();
        return result

    } catch (error) {
        console.error("Fetch Error" + error)

    }

}

async function getFilteredStdCourseMark({ search }) {


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


async function getStudentCourseMark({ search }) {

    try {
        const URL = BACKENDURL + `/studentCourseMark?q=${search}`
        const response = (await fetch(URL)).json()
        
        console.log(response + "in API");
        return response
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}

async function getFulleMark() {

    try {
        const URL = BACKENDURL + '/fullmark'
        const response = (await fetch(URL)).json()

        return response
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}

async function getAttendedStudents() {

    try {
        const URL = BACKENDURL + '/attended'
        const response = (await fetch(URL)).json()
        console.log(response);

        return response
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}

async function getsearch({ search }) {
    console.log(search + "search******");

    try {
        const URL = BACKENDURL + `/search?q=${search}`
        const response = await fetch(URL); // Await the fetch call
        const data = await response.json();
        console.log(JSON.stringify(data) + "9999999999999");

        return data
    } catch (error) {
        console.error("Fetch Error" + error);

    }

}






// ******************Insert Fetch API
async function insertstd(table, records) {

    const URL = BACKENDURL + '/std'
    const response = await fetch(URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, records })
    })

    const result = await response.json()


    if (response.ok) {
        console.log(`data successfully inserted in ${table}`, result);
        return result


    } else {

        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');

    }

}



async function insertCourse(table, records) {

    const URL = BACKENDURL + '/courses'
    const response = await fetch(URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, records })
    })

    const result = await response.json()

    if (response.ok) {
        console.log(`data inserted successfully in ${table}`, result);
        return result

    } else {
        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');
    }
}


async function insertMarks(table, records) {



    const URL = BACKENDURL + '/marks'
    const response = await fetch(URL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, records })
    })

    const result = await response.json()

    if (response.ok) {
        console.log(`data inserted successfully in ${table}`, result);
        return result

    } else {
        console.error('Error inserting data:', result);
        throw new Error(result.error || 'Failed to insert data');
    }
}



async function getQueryJsonData({ query }) {
    console.log(query + "in API");

    try {
        const URL = BACKENDURL + `/queryData?q=${query}`
        // const response = (await fetch(URL)).json()
        const response = await fetch(URL);

        // Wait for JSON parsing to complete
        const data = await response.json();


        return data
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}

async function writeJsonFile() {


    const URL = BACKENDURL + `/writeJsonData`
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



async function writeJsonFileServer() {


    const URL = BACKENDURL + `/writeJsonDataServer`
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



// async function readStreamJsonFile() {


//     const URL = BACKENDURL + `/streamData`
//     try {

//         const response = await fetch(URL)

//         if (!response.body) throw new Error('ReadableStream not supported!');

//         const reader = response.body.getReader();
//         const decoder = new TextDecoder();
//         let result = '';

//         while (true) {
//             const { done, value } = await reader.read();
//             if (done) break;

//             result += decoder.decode(value, { stream: true });
//         }

//         const jsonData = JSON.parse(result);
//         console.log('Received JSON:', jsonData);
//         return jsonData

//     } catch (error) {
//         console.error("Fetch Error" + error)

//     }

// }
async function readStreamJsonFile() {
    const URL = BACKENDURL + `/streamData`;

let allstd = []

    try {
        const response = await fetch(URL);
        if (!response.body) throw new Error('ReadableStream not supported!');

        return response.body
        // .pipeThrough(
        //     new TextDecoderStream()
        // )
        // .pipeTo(
        //     new WritableStream ({
        //         write(chunk){
        //             console.log('chunk' , chunk);

                  
                    
        //         }
        //     })
        // )
        // .pipeThrough(
           
        // )



        // const reader = response.body.getReader();
        // const decoder = new TextDecoder();
        // let partialJSON = '';  // Store incomplete JSON fragments

        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;  // End of stream

        //     // Decode and accumulate chunks
        //     partialJSON += decoder.decode(value, { stream: true });

        //     try {
        //         // Process valid JSON chunks line by line
        //         let boundaryIndex;
        //         while ((boundaryIndex = partialJSON.indexOf("\n")) !== -1) {
        //             const chunk = partialJSON.slice(0, boundaryIndex).trim(); // Get one JSON object
        //             partialJSON = partialJSON.slice(boundaryIndex + 1); // Remove processed chunk

        //             if (chunk) {
        //                 try {
        //                     const jsonChunk = JSON.parse(chunk);
        //                     console.log('Processed JSON Chunk:', jsonChunk);
        //                     // Process each chunk separately instead of storing everything
        //                 } catch (parseError) {
        //                     console.error('JSON Parse Error:', parseError);
        //                 }
        //             }
        //         }
            // } catch (error) {
            //     console.error('Error processing JSON chunk:', error);
            // }
        // }

        // return "Processing in progress"; // JSON is processed in chunks
    } catch (error) {
        console.error("Fetch Error: " + error);
    }
}



// async function streamJSONToDuckDB(dbConnection) {

//     console.log("stream to duckdb has startet");

//     const URL = BACKENDURL + `/streamData`
//     const response = await fetch(URL);
//     if (!response.body) throw new Error('ReadableStream not supported!');

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let buffer = '';

//     while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;  // End of stream

//         buffer += decoder.decode(value, { stream: true });

//         let boundaryIndex;
//         while ((boundaryIndex = buffer.indexOf("\n")) !== -1) {
//             const chunk = buffer.slice(0, boundaryIndex).trim(); // Extract one JSON object
//             buffer = buffer.slice(boundaryIndex + 1); // Remove processed part

//             if (chunk) {
//                 try {
//                     const jsonChunk = JSON.parse(chunk);
//                     console.log('Processed JSON Chunk:', jsonChunk);

//                     // Insert directly into DuckDB
//                     await dbConnection.query(
//                         `INSERT INTO json_data VALUES (?)`,
//                         [JSON.stringify(jsonChunk)]
//                     );

//                 } catch (parseError) {
//                     console.error('JSON Parse Error:', parseError);
//                 }
//             }
//         }
//     }
// }




async function streamJSONToDuckDB(dbConnection) {
    console.log("Stream to DuckDB has started...");

    const URL = BACKENDURL + `/streamData`;

    try {
        const response = await fetch(URL);
        if (!response.body) throw new Error('ReadableStream not supported!');

        const jsonParser = new JSONParser({
            emitPartialTokens: false,
            emitPartialValues: false,
            keepStack: false,
            paths: ['$.*']  // Adjust paths based on your JSON structure
        });

        const reader = response.body.pipeThrough(jsonParser).getReader();

        while (true) {
            try {
                const { done, value } = await reader.read();
                if (done) break;

                if (value?.value) {
                    console.log("Processed JSON Chunk:", value.value);

                    // ✅ Insert JSON chunk into DuckDB
                    await dbConnection.query(
                        `INSERT INTO json_data VALUES (?)`,
                        [JSON.stringify(value.value)]
                    );
                }
            } catch (readError) {
                console.error("Stream Read Error:", readError);
                break;
            }
        }

        console.log("Streaming finished.");
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}
// async function allJsonFile() {

//     const URL = BACKENDURL + 'allJsonData'
   
//     try {
//         return await fetch(BACKENDURL + `/allJsonData?page=${1}&limit=${100}`)
//                     .then(response => response.json())
          
            
            
//     } catch (error) {

//         console.error("Fetch Error" + error)
//     }
   
// }


async function allPagedJsonFile() {

    let allStudents = []
    let allMarks = []
    let courses = null
    let page = 1
    const limit = 5000000

    // const URL = BACKENDURL + `/allPagedJsonData`
    try {

        // return await fetch(URL)
        //     .then(response => response.json())
           
            

        while (true) {

            const response = await fetch(BACKENDURL + `/allPagedJsonData?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
           
            const data = await response.json();
            console.log("APIIIII" + JSON.stringify(data.courses));

            if (!data.students || !data.marks || !data.courses) {
                throw new Error("Invalid API response format. Missing 'students' or 'marks'");
            }
            if (data.students.length === 0 && data.marks.length === 0) break;

            allStudents = [...allStudents, ...data.students]
            allMarks = [...allMarks, ...data.marks]
            courses = data.courses

            console.log(`Fetched Page ${page}: Students=${data.students.length}, Marks=${data.marks.length}`);
            //page++
            page = page + 9
        }

        console.log("All data loaded!", { students: allStudents.length, marks: allMarks.length, courses });

        console.log("end of APIIIIII" + courses);

        return { students: allStudents, marks: allMarks, courses: courses }



    } catch (error) {
        console.error("Fetch Error" + error)

    }

}

async function getJsonFulleMark() {

    try {
        const URL = BACKENDURL + '/jsonfullmark'
        const response = (await fetch(URL)).json()
        console.log("in APIIIII" + response);

        return response
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}

async function getJsonAttended() {

    try {
        const URL = BACKENDURL + '/jsonattended'
        const response = (await fetch(URL)).json()
        console.log("in APIIIII" + response);

        return response
    } catch (error) {
        console.error("Fetch Error" + error)
    }


}


export {
    getDuckDBStd, getDuckDBCourses, getDuckDBMarks, getFilteredStdCourseMark, writeJsonFile, readStreamJsonFile, getJsonFulleMark, getJsonAttended,writeJsonFileServer,
    getStudentCourseMark, getFulleMark, getAttendedStudents, insertstd, insertCourse, insertMarks, getsearch, getQueryJsonData, allPagedJsonFile, streamJSONToDuckDB
};




