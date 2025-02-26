
import { allPagedJsonFile, getFilteredStdCourseMark, getQueryJsonData, readStreamJsonFile, streamJSONToDuckDB } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';
import { faker, Faker, it, ro } from '@faker-js/faker';
import { fetchJsonData } from "./data/fetchAllJson";
import { memoryAllJsonData } from "./wasm/memoryAllData";



export async function jsonDataDuckDB({ query }) {


    const studentsJsonPath = process.env.REACT_APP_STUDENTS_JSON;
    const marksJsonPath = process.env.REACT_APP_MARKS_JSON
    const coursesJsonPath = process.env.REACT_APP_COURSES_JSON


    try {


        // await writeJsonFile()   

        const [std, mrk, crs] = await Promise.all([
            fetchJsonData(studentsJsonPath),
            fetchJsonData(marksJsonPath),
            fetchJsonData(coursesJsonPath)
        ]);


        query = query.replace(/studentsData/g, 'students')
            .replace(/marksData/g, 'marks')
            .replace(/coursesData/g, 'courses');



        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        await db.registerFileText('students', JSON.stringify(std));
        await db.registerFileText('marks', JSON.stringify(mrk));
        await db.registerFileText('courses', JSON.stringify(crs));

        // await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        let jsonQuery;

        if (!query) {
            jsonQuery = `
            SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            
           `;
        } else {
            jsonQuery = query  // Use double quotes for paths;  // Use provided query
        }



        const result = await c.query(`${jsonQuery}`)
        const resultArray = result.toArray()




        const convertedBigInt = resultArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
            )
        );


        await c.close()


        return convertedBigInt

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}


export async function jsonStdMarkDataDuckDB() {


    const studentsJsonPath = process.env.REACT_APP_STUDENTS_JSON;
    const marksJsonPath = process.env.REACT_APP_MARKS_JSON
    const coursesJsonPath = process.env.REACT_APP_COURSES_JSON

    try {

        // await writeJsonFile()   

        const [std, mrk, crs] = await Promise.all([
            fetchJsonData(studentsJsonPath),
            fetchJsonData(marksJsonPath),
            fetchJsonData(coursesJsonPath)
        ]);


        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        await db.registerFileText('students', JSON.stringify(std));
        await db.registerFileText('marks', JSON.stringify(mrk));
        await db.registerFileText('courses', JSON.stringify(crs));

        let jsonQuery;
        let fullMarks;
        let allAttended;
        // await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        jsonQuery = `
                 
                    SELECT c.cname AS course_name, COUNT(*) AS student_count
                    FROM marks m
                    JOIN courses c ON m.cid = c.cid
                    WHERE m.marks = 30
                    GROUP BY c.cname
                    ORDER BY c.cname;
            `
        fullMarks = await c.query(`${jsonQuery}`)

        // Register JSON files as virtual tables instead of fully creating them


        allAttended = await c.query(`
                     SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
                    FROM marks m
                    JOIN courses c ON m.cid = c.cid
                    WHERE m.cid IN (
                               SELECT DISTINCT cid
                               FROM marks
                               WHERE marks = 30
                                    )
                                GROUP BY c.cname
                                 ORDER BY c.cname;
                    `);


        const fullMarksArray = (fullMarks.toArray()).map(row => ({ ...row }));
        const allAttendedArray = (allAttended.toArray()).map((row) => ({ ...row }))






        const convertedBigIntFullMark = fullMarksArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )

        const convertedBigIntAttended = allAttendedArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )



        await c.close()


        return { convertedBigIntFullMark, convertedBigIntAttended }



    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}



export async function jsonFullMarkDataDuckDB({ query }) {


    const studentsJsonPath = process.env.REACT_APP_STUDENTS_JSON;
    const marksJsonPath = process.env.REACT_APP_MARKS_JSON
    const coursesJsonPath = process.env.REACT_APP_COURSES_JSON

    try {

        // await writeJsonFile()   

        const [std, mrk, crs] = await Promise.all([
            fetchJsonData(studentsJsonPath),
            fetchJsonData(marksJsonPath),
            fetchJsonData(coursesJsonPath)
        ]);


        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        await db.registerFileText('students', JSON.stringify(std));
        await db.registerFileText('marks', JSON.stringify(mrk));
        await db.registerFileText('courses', JSON.stringify(crs));


        let fullMarks;

        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        // await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        if (!query) {
            const jsonQuery = `
                 
            SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;
    `
            fullMarks = await c.query(`${jsonQuery}`)
        } else {

            fullMarks = await c.query(`${query}`)
        }


        const fullMarksArray = (fullMarks.toArray()).map(row => ({ ...row }));
        const convertedBigIntFullMark = fullMarksArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )

        await c.close()




        return convertedBigIntFullMark



    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}




///////******************* Json Stream   ***** */


// export async function jsonStreamDataDuckDB({ query }) {


//     function convertBigIntToNumber(data) {
//         if (Array.isArray(data)) {
//             return data.map(item => convertBigIntToNumber(item));
//         } else if (typeof data === 'object' && data !== null) {
//             const newObj = {};
//             for (let key in data) {
//                 newObj[key] = convertBigIntToNumber(data[key]);
//             }
//             return newObj;
//         } else if (typeof data === 'bigint') {
//             return Number(data);  // Convert BigInt to Number
//         }
//         return data;
//     }

//     // let students
//     // let marks
//     // let courses


//     try {



//         // try {

//         //** worked for dataset smaller that 5,000,000 records */
//         //let data = await readStreamJsonFile()

//         //**changed method for dataset biger that 5,000,000 records */
//         // let data = await getQueryJsonData({ query })
//         // console.log("TTTTTTT" + JSON.stringify(data.students));
//         // console.log("TTTTTTT" + JSON.stringify(data));

//         query = query.replace(/studentsData/g, 'students')
//             .replace(/marksData/g, 'marks')
//             .replace(/coursesData/g, 'courses');



//         const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

//         const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


//         const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

//         const logger = new duckdb.ConsoleLogger();


//         const db = new duckdb.AsyncDuckDB(logger, worker);


//         await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

//         console.log("DuckDB initialized successfully!");


//         const c = await db.connect()

//         console.log("Database connection established");


//         // console.log("All Data Structure:", data.marks);


//         // console.log("Students Structure:", data.students);
//         // console.log("Marks Structure:", data.marks);
//         // console.log("Courses Structure:", data.courses);
//         // console.log("Marks Data Before Registering:", JSON.stringify(data.marks, null, 2));

//         let students
//         let marks
//         let courses

//         return await allJsonFile()
//             .then(async data => {

//                 console.log(data.students);
//                 console.log(data.marks);
//                 console.log(data.courses);



//                 await db.registerFileText('students', JSON.stringify(convertBigIntToNumber(data.students)))
//                 await db.registerFileText('marks', JSON.stringify(convertBigIntToNumber(data.marks)))
//                 await db.registerFileText('courses', JSON.stringify(convertBigIntToNumber(data.courses)))

//                 await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
//                 await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
//                 await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

//                 await c.query(`ALTER TABLE students ALTER COLUMN id SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE students ALTER COLUMN age SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE marks ALTER COLUMN id SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE marks ALTER COLUMN sid SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE marks ALTER COLUMN cid SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE marks ALTER COLUMN marks SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE courses ALTER COLUMN cid SET DATA TYPE INTEGER`);
//                 await c.query(`ALTER TABLE courses ALTER COLUMN credits SET DATA TYPE INTEGER`);



//                 // await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
//                 // await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
//                 // await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);



//                 let marksData = await c.query("SELECT * FROM marks LIMIT 5");
//                 let mrkdata = marksData.toArray().map(row => Object.assign({}, row));
//                 console.log("Marks Table Sample Data:", mrkdata);

//                 let stdData = await c.query("SELECT * FROM students LIMIT 5");
//                 let stdArray = stdData.toArray().map(row => Object.assign({}, row));
//                 console.log("Marks Table Sample Data:", stdArray);

//                 let crsData = await c.query("SELECT * FROM courses LIMIT 5");
//                 let crsArray = crsData.toArray().map(row => Object.assign({}, row));
//                 console.log("course Table Sample Data:", crsArray);

//                 // let jsonQuery;
//                 // let result;

//                 // let marksSchema = await c.query("DESCRIBE marks");
//                 // let mrk = marksSchema.toArray().map(row => Object.assign({}, row));
//                 // console.log("Marks Schema:", mrk);

//                 // let studentsSchema = await c.query("DESCRIBE students");
//                 // const std = studentsSchema.toArray().map(row => Object.assign({},row))
//                 // console.log("Students Schema:", std);

//                 // let coursesSchema = await c.query("DESCRIBE courses");
//                 // const crs = coursesSchema.toArray().map(row => Object.assign({},row))
//                 // console.log("course Schema:", crs);


//                 const marksSchema = await c.query("PRAGMA table_info(marks)");
//                 const studentsSchema = await c.query("PRAGMA table_info(students)");

//                 const mrk = marksSchema.toArray().map(row => Object.assign({},row))
//                 const std = studentsSchema.toArray().map(row => Object.assign({},row))
//                 console.log("Marks Schema:", mrk);
//                 console.log("Students Schema:", std);



//                 // Register JSON files as virtual tables instead of fully creating them

//                 // Default query if none provided
//                 const baseQuery = query || `
//         SELECT m.sid, s.id, s.sname, c.cname, m.marks
//         FROM marks m
//        LEFT JOIN students s ON m.sid = s.id
//        LEFT JOIN courses c ON m.cid = c.cid

//     `;
//                 let x = await c.query(` SELECT DISTINCT sid FROM marks limit 5;
// SELECT DISTINCT id FROM students limit 5;
// SELECT DISTINCT cid FROM marks limit 5;
// SELECT DISTINCT cid FROM courses limit 5;
// `);
//                 console.log("tttesssst", x);

//                     let rows = x.toArray().map(row =>
//                         Object.fromEntries(
//                             Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
//                         )
//                     );

//                     console.log(rows);


// // Access the batches (actual data) from the query result
// const batches = x.batches; // this should contain the data

// // If you want to see the first batch data, you can log it:
// console.log("First Batch Data:", batches[0]);

// const batch = x.batches[0]; // Get the first batch
// const data1 = batch.data; // Get the data of the first batch

// // Access the children (columns) inside the data
// const children = data1.children;

// // Log the children structure to understand it better
// console.log("Children Columns:", children);





//                 let pageCounter
//                 let page = pageCounter || 1
//                 const limit = 1000000
//                 let offset = (page - 1) * limit
//                 let hasMoreData = true;

//                 while (hasMoreData) {

//                     const paginatedQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`;

//                     let result = await c.query(paginatedQuery);
//                     let rows = result.toArray().map(row =>
//                         Object.fromEntries(
//                             Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
//                         )
//                     );
//                     console.log(result);
//                     console.log(rows);


//                     if (rows.length === 0) {
//                         hasMoreData = false
//                         break;
//                     } else {
//                         console.log(`Processing ${rows.length} rows (offset: ${offset})`);
//                         // 🔥 Process or send rows somewhere (e.g., WebSockets, IndexedDB)
//                         page++;  // Increment the page number
//                         offset = (page - 1) * limit; 
//                         return rows
//                     }

//                 }

//                 await c.close();









//             })



//     } catch (error) {

//         console.error("error of fetching in BrowserDB", error)
//         return { error: true, message: error.message }

//     }
// }


async function insertDataInBatches(db, tableName, data, batchSize = 1000000) {
    const c = await db.connect();

    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await c.query(`
            INSERT INTO ${tableName} 
            SELECT * FROM read_json_auto($1)
        `, [JSON.stringify(batch)]);
        console.log(`✅ Inserted ${i + batchSize} records into ${tableName}`);
    }

    await c.close();
}


export async function jsonStreamDataDuckDB({ query,counter }) {

   
    let students
    let marks
    let courses
    let limit = 3000000
    let stdpage = 0
    let mrkpage = 0
  
   
    const wasmMemory =new WebAssembly.Memory({
        initial: 256,  // 16 MB
        maximum: 32768, // 2 GB
    })
    console.log(WebAssembly.Memory.maximum);
    const memoryLimit = 1024 * 1024 * 1024
    try {
      
      
        
        query = query.replace(/studentsData/g, 'students')
            .replace(/marksData/g, 'marks')
            .replace(/coursesData/g, 'courses');



        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker, { wasmMemory:wasmMemory });


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        console.log(counter +"  counteeeeeerrrrr");
       
        
        // if(counter) {
            console.log("iiiiiinnnnnssssiiiiidddeeeee");
            
        // await allPagedJsonFile()
        //     .then(async data => {
        //         students = data.students.filter(student=>student.id >=1 && student.id<=7000000)
        //         courses = data.courses
        //         marks = data.marks.filter(mark => mark.sid >= 1 && mark.sid <=7000000)



        //         console.log(students);
        //         console.log(marks);
        //         console.log(courses);

        //     })

            await memoryAllJsonData({query,counter})
            .then(async data =>{
                students = data.stdproceeddata
                courses = data.crsProceeddata
                marks = data.mrkProceeddata

                console.log(students);
                console.log(marks);
                console.log(courses);

            })
      
            
        


        await c.query(`
            CREATE TABLE students (
                id INTEGER PRIMARY KEY,
                sname TEXT,
                age INTEGER
            );
        `);
        await c.query(`
            CREATE TABLE courses(
               cid INTEGER PRIMARY KEY,
               cname TEXT,
               credits INTEGER
            );
        `);
        await c.query(`
            CREATE TABLE marks(
                id INTEGER PRIMARY KEY,
                sid INTEGER NOT NULL,
                cid INTEGER NOT NULL,
                marks INTEGER,
                FOREIGN KEY (sid) REFERENCES students (id),
                FOREIGN KEY (cid) REFERENCES courses (cid)

            );  
         `)


        console.log("Table created");

        await db.registerFileText('students', JSON.stringify(students));
        await db.registerFileText('marks', JSON.stringify(marks));
        await db.registerFileText('courses', JSON.stringify(courses));

        while(true){
            console.log(stdpage);
            let offset =stdpage*limit

           await c.query(
        `INSERT OR IGNORE INTO students (id, sname, age)  SELECT id, sname, age FROM read_json_auto('students') LIMIT ${limit} OFFSET ${offset}`
    );

    // Fetch the inserted data to check if there were any new rows
    const result = await c.query(
        `SELECT COUNT(*) as count FROM read_json_auto('students') LIMIT ${limit} OFFSET ${offset}`
    );

    console.log(result);
    console.log(result.length);
    // If no more rows are being inserted, break the loop
    if (result.numRows === 0) break; // Stop pagination when no more data

        stdpage ++    
    
        }



        await c.query(
            `INSERT OR IGNORE INTO courses (cid,cname,credits) SELECT cid,cname,credits FROM read_json_auto('courses')`
        );





        while(true){
          
            let offset =mrkpage*limit
            
           

           await c.query(
        `INSERT OR IGNORE INTO marks (id,sid,cid,marks) SELECT id,sid,cid,marks FROM read_json_auto('marks') LIMIT ${limit} OFFSET ${offset}`
    );

    await c.query(`
    INSERT OR IGNORE INTO marks (id, sid, cid, marks)
    SELECT id, sid, cid, marks 
    FROM read_json_auto('marks') 
    WHERE sid IN (SELECT id FROM students) 
    AND cid IN (SELECT cid FROM courses) 
    LIMIT ${limit} OFFSET ${offset}
`);


         
    // Fetch the inserted data to check if there were any new rows
    const result = await c.query(
        `SELECT COUNT(*) as count FROM read_json_auto('marks') LIMIT ${limit} OFFSET ${offset}`
    );

    // If no more rows are being inserted, break the loop
    if (result.numRows === 0) break; // Stop pagination when no more data

           mrkpage ++    
    
        }

    // }

    console.log("ooooooouuuuuttttt");

    const tables = await c.query("SHOW TABLES;");
    const tableNames = tables.toArray().map(row => row.name);

    if (!tableNames.includes("marks")) {
    console.error("Table 'marks' does not exist! Recreating...");
    // Recreate tables or load data
        }


        let jsonQuery;
        let result;


        if (!query) {

            // Register JSON files as virtual tables instead of fully creating them


            jsonQuery = `
            SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname;
            `
            
            result = await c.query(`${jsonQuery}`)


        } else {

            

            jsonQuery = query  // Use double quotes for paths;  // Use provided query
            result = await c.query(`${jsonQuery}`)


        }


        const resultArray = result.toArray().map(row => ({ ...row }))
        console.log("***********" + resultArray);


        const convertedBigIntResult = resultArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
            )
        );
        //await c.close()
        console.log(convertedBigIntResult);

        return convertedBigIntResult
        // })

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}


export async function jsonStreamDataDuckDB2({ query }) {

    let students = []
    let marks = []
    let courses = []
    const mempryLimit = 1024 * 1024 * 1024


    try {

        const body = await readStreamJsonFile()

        const jsonChunks = [];

        await body.pipeThrough(
            new TextDecoderStream()
        )
            .pipeTo(
                new WritableStream({
                    write(chunk) {
                        jsonChunks.push(chunk.trim())
                    }
                })
            )
            const jsonData = jsonChunks.join(''); // Merge all chunks
            const parsedData = JSON.parse(`[${jsonData.replace(/}\s*{/g, '},{')}]`); 

            // Extract and filter the correct JSON objects
            students = parsedData.filter(item => item.id !== undefined); 
            //students =parsedData.filter(item =>item.id)
            // students =parsedData.filter(item =>item.sname)
            console.log("Students:", parsedData);

   
   
        query = query.replace(/studentsData/g, 'students')
            .replace(/marksData/g, 'marks')
            .replace(/coursesData/g, 'courses');



        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker, { mempryLimit });


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        //stream into DuckDB*******
         await db.registerFileText('students', JSON.stringify(parsedData));

        //paged data to duckDB******


        await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students') LIMIT 6090000 OFFSET 0`);
        await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks') LIMIT 6090000 OFFSET 0`);
        await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses') LIMIT 6090000 OFFSET 0`);


        //         if (students.length > 0) {
        //     await c.query(`CREATE TABLE students (id BIGINT, sname STRING, age INT);`);
        //     await insertDataInBatches(c, "students", students);
        // }

        // if (marks.length > 0) {
        //     await c.query(`CREATE TABLE marks (sid BIGINT, cid BIGINT, marks INT);`);
        //     await insertDataInBatches(c, "marks", marks);
        // }

        // if (courses.length > 0) {
        //     await c.query(`CREATE TABLE courses (cid BIGINT, cname STRING);`);
        //     await insertDataInBatches(c, "courses", courses);
        // }

        let jsonQuery;
        let result;


        if (!query) {

         
            jsonQuery = `
            SELECT * from students
            `
            result = await c.query(`${jsonQuery}`)


        } else {

            // Register JSON files as virtual tables instead of fully creating them

            jsonQuery = query  // Use double quotes for paths;  // Use provided query
            result = await c.query(`${jsonQuery}`)


        }


        // const resultArray = result.toArray().map(row => ({ ...row }))
        // console.log("***********" + resultArray);


        // const convertedBigIntResult = resultArray.map(row =>
        //     Object.fromEntries(
        //         Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
        //     )
        // );
        // await c.close()
        // console.log(convertedBigIntResult);

        return result //convertedBigIntResult
        // })

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}


export async function jsonStreamStdMarkDataDuckDB({ query }) {


    let students
    let marks
    let courses


    try {

        await allPagedJsonFile()
            .then(data => {
                students = data.students
                courses = data.courses
                marks = data.marks

                console.log(students);
                console.log(marks);
                console.log(courses);
            })



        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        await db.registerFileText('students', JSON.stringify(students));
        await db.registerFileText('marks', JSON.stringify(marks));
        await db.registerFileText('courses', JSON.stringify(courses));

        // await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        let jsonQuery;
        let fullMarks;
        let allAttended;



        jsonQuery = `
                 SELECT c.cname AS course_name, COUNT(*) AS student_count
                 FROM marks m
                 JOIN courses c ON m.cid = c.cid
                 WHERE m.marks = 30
                 GROUP BY c.cname
                 ORDER BY c.cname;
         `
        fullMarks = await c.query(`${jsonQuery}`)

        // Register JSON files as virtual tables instead of fully creating them


        allAttended = await c.query(`
                  SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
                 FROM marks m
                 JOIN courses c ON m.cid = c.cid
                 WHERE m.cid IN (
                            SELECT DISTINCT cid
                            FROM marks
                            WHERE marks = 30
                                 )
                             GROUP BY c.cname
                              ORDER BY c.cname;
                 `);





        const fullMarksArray = (fullMarks.toArray()).map(row => ({ ...row }));
        const allAttendedArray = (allAttended.toArray()).map((row) => ({ ...row }))






        const convertedBigIntFullMark = fullMarksArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )

        const convertedBigIntAttended = allAttendedArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )



        await c.close()


        return { convertedBigIntFullMark, convertedBigIntAttended }

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}


export async function jsonStreamComplexQueryDuckDB({ query ,complexCounter}) {

    let students
    let marks
    let courses


    try {

        if(complexCounter == 0){
        await allPagedJsonFile()
            .then(data => {
                students = data.students
                courses = data.courses
                marks = data.marks

                console.log(students);
                console.log(marks);
                console.log(courses);
            })
        }

        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");


        await db.registerFileText('students', JSON.stringify(students));
        await db.registerFileText('marks', JSON.stringify(marks));
        await db.registerFileText('courses', JSON.stringify(courses));


        let allAttended;
        // await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        const marksSchema = await c.query(`DESCRIBE marks`);
        const coursesSchema = await c.query(`DESCRIBE courses`);

        console.log("Marks Schema:", marksSchema.toArray());
        console.log("Courses Schema:", coursesSchema.toArray());


        const sampleMarks = await c.query(`SELECT * FROM marks LIMIT 5`);
        console.log("Sample Marks Data:", sampleMarks.toArray());

        const sampleCourses = await c.query(`SELECT * FROM courses LIMIT 5`);
        console.log("Sample Courses Data:", sampleCourses.toArray());

        allAttended = await c.query(`
                 SELECT c.cname AS course_name, COUNT(*) AS students_Count
                  FROM marks m
                  JOIN courses c ON m.cid = c.cid
                  WHERE m.marks = 30
                  GROUP BY c.cname
                  ORDER BY c.cname;
                    `);





        const allAttendedArray = (allAttended.toArray()).map((row) => ({ ...row }))

        const convertedBigIntAttended = allAttendedArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(
                    ([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value]
                )
            )
        )

        await c.close()


        return convertedBigIntAttended



    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}






// export async function jsonStreamComplexQueryDuckDB({query}) {


//     const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
//     const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
//     const worker = await duckdb.createWorker(bundle.mainWorker);
//     const logger = new duckdb.ConsoleLogger();

//     const db = new duckdb.AsyncDuckDB(logger, worker);
//     await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
//     console.log("DuckDB initialized successfully!");

//     const connection = await db.connect();
//     console.log("Database connection established");

//     // Ensure the table exists before streaming
//     await connection.query(`
//     CREATE TABLE IF NOT EXISTS json_data (
//         json_content TEXT
//     )
// `);



//     try{
//     await streamJSONToDuckDB(connection);

//     console.log("Streaming to DuckDB completed!");

//         // Query the streamed data
//         const result = await connection.query(`SELECT * FROM json_data LIMIT 5`);
//         console.log("Sample Data from DuckDB:", result.toArray());

//         await connection.close();

//     } catch (error) {
//         console.error("Error in main process:", error);
//     }

//     // return connection; // Return a working DB connection
// }



//*********************create and join all tables in DuckDB******** 

export async function mainDataDuckDB({ search }) {

    try {

        const filteredData = await getFilteredStdCourseMark({ search })



        const studentData = filteredData.students
        const courseData = filteredData.courses
        const markData = filteredData.marks




        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");



        // await c.query(`
        //     CREATE TABLE students (
        //         id INTEGER PRIMARY KEY,
        //         sname TEXT,
        //         age INTEGER
        //     );
        // `);
        // await c.query(`
        //     CREATE TABLE courses(
        //        cid INTEGER PRIMARY KEY,
        //        cname TEXT,
        //        credits INTEGER
        //     );
        // `);
        // await c.query(`
        //     CREATE TABLE marks(
        //         id INTEGER PRIMARY KEY,
        //         sid INTEGER NOT NULL,
        //         cid INTEGER NOT NULL,
        //         marks INTEGER,
        //         FOREIGN KEY (sid) REFERENCES students (id),
        //         FOREIGN KEY (cid) REFERENCES courses (cid)

        //     );  
        //  `)


        // console.log("Table created");

        // for (const row of studentData) {

        //     await c.query(`
        //         INSERT INTO students (id, sname, age)
        //         VALUES (${row.id}, '${row.sname}', ${row.age});
        //     `);
        // }

        // for (const row of courseData) {

        //     await c.query(` 
        //         INSERT INTO courses(cid,cname,credits)
        //         VALUES (${row.cid},'${row.cname}',${row.credits})    
        //     `);
        // }

        // for (const row of markData) {
        //     await c.query(` 
        //         INSERT INTO marks(id,sid,cid,marks)
        //         VALUES (${row.id},${row.sid},${row.cid},${row.marks})    
        //     `);
        // }
        // console.log("Data inserted into student table");





        let studentValues = studentData.map(row => `(${row.id}, '${row.sname}', ${row.age})`).join(", ");
        await c.query(`CREATE TABLE students AS SELECT * FROM (VALUES ${studentValues}) AS t(id, sname, age)`);
        let markValues = markData.map(row => `(${row.id}, ${row.sid}, ${row.cid}, ${row.marks})`).join(", ");
        await c.query(`CREATE TABLE marks AS SELECT * FROM (VALUES ${markValues}) AS t(id, sid, cid, marks)`);
        let courseValues = courseData.map(row => `(${row.cid}, '${row.cname}', ${row.credits})`).join(", ");
        await c.query(`CREATE TABLE courses AS SELECT * FROM (VALUES ${courseValues}) AS t(cid, cname, credits)`);



        const result = c.query(`SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname;`)

        const fullMarks = c.query(`SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;`)

        const allAttended = c.query(`SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.cid IN (
                    SELECT DISTINCT cid
                    FROM marks
                    WHERE marks = 30
                    )
            GROUP BY c.cname
            ORDER BY c.cname;
        `)




        const table = await result;  // Await the Promise to resolve it
        const fullMarksTable = await fullMarks;
        const attendedTable = await allAttended;





        await c.close()


        // convert data from arrow format retrieved from query to standard array of js
        const dataArray = table.toArray()
        const fullMarksArray = fullMarksTable.toArray()
        const allAttendedArray = attendedTable.toArray()

        // Generate unique keys for each row
        const dataWithKeys = dataArray.map((row, index) => ({
            ...row,
            key: `${row.id}-${row.cname}-${index}`, // Use a combination of fields and index for uniqueness
        }));



        return {
            dataArray,
            fullMarksArray,
            allAttendedArray
        }

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { dataArray: [], fullMarksArray: [], allAttendedArray: [] };

    }

}



//*********************create and join all tables in fake DuckDB******** 
export async function fakeDataDuckDB() {

    try {


        const studentData = []//await getDuckDBStd();
        const courseData = []//await getDuckDBCourses();
        const markData = []//await getDuckDBMarks();        

        const dataRangeMin = 1
        const dataRangeMax = 2000000

        const customFaker = new Faker({ locale: [it] });
        for (let i = dataRangeMin; i <= dataRangeMax; i++) {
            studentData.push({
                id: i,
                sname: customFaker.person.fullName().replace(/'/g, "''"),
                age: faker.number.int({ min: 18, max: 25 })

            })
        }

        for (let i = 1; i <= 5; i++) {

            courseData.push({
                cid: i,
                cname: faker.commerce.productName(),
                credits: faker.number.int({ min: 1, max: 10 })
            })

        }
        for (let i = dataRangeMin; i <= dataRangeMax; i++) {
            const sid = faker.number.int({ min: dataRangeMin, max: dataRangeMax });
            const cid = faker.number.int({ min: 1, max: 5 });
            markData.push({
                id: i,
                sid: sid,
                cid: cid,
                marks: faker.number.int({ min: 17, max: 30 })

            })
        }


        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);


        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");

        await c.query(`
            CREATE TABLE students (
                id INTEGER PRIMARY KEY,
                sname TEXT,
                age INTEGER
            );
        `);
        await c.query(`
            CREATE TABLE courses(
               cid INTEGER PRIMARY KEY,
               cname TEXT,
               credits INTEGER
            );
        `);
        await c.query(`
            CREATE TABLE marks(
                id INTEGER PRIMARY KEY,
                sid INTEGER NOT NULL,
                cid INTEGER NOT NULL,
                marks INTEGER,
                FOREIGN KEY (sid) REFERENCES students (id),
                FOREIGN KEY (cid) REFERENCES courses (cid)

            );  
         `)


        console.log("Table created");

        for (const row of studentData) {

            await c.query(`
                INSERT INTO students (id, sname, age)
                VALUES (${row.id}, '${row.sname}', ${row.age});
            `);
        }

        for (const row of courseData) {

            await c.query(` 
                INSERT INTO courses(cid,cname,credits)
                VALUES (${row.cid},'${row.cname}',${row.credits})    
            `);
        }

        for (const row of markData) {
            await c.query(` 
                INSERT INTO marks(id,sid,cid,marks)
                VALUES (${row.id},${row.sid},${row.cid},${row.marks})    
            `);
        }
        console.log("Data inserted into student table");

        const result = c.query(`SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname;`)

        const fullMarks = c.query(`SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;`)

        const allAttended = c.query(`SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.cid IN (
                    SELECT DISTINCT cid
                    FROM marks
                    WHERE marks = 30
                    )
            GROUP BY c.cname
            ORDER BY c.cname;
        `)




        const table = await result;  // Await the Promise to resolve it
        const fullMarksTable = await fullMarks;
        const attendedTable = await allAttended;





        await c.close()


        // convert data from arrow format retrieved from query to standard plain array of js

        const dataArray = table.toArray().map(row => ({ ...row }))    // Convert each row to a plain object
        const fullMarksArray = fullMarksTable.toArray().map(row => ({ ...row }))
        const allAttendedArray = attendedTable.toArray().map(row => ({ ...row }))

        // Generate unique keys for each row
        const dataWithKeys = dataArray.map((row, index) => ({
            ...row,
            key: `${row.id}-${row.cname}-${index}`, // Use a combination of fields and index for uniqueness
        }));



        return {
            dataArray,
            fullMarksArray,
            allAttendedArray
        }

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { dataArray: [], fullMarksArray: [], allAttendedArray: [] };
    }

}


async function saveToIndexedDB(dbName, storeName, key, data) {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
        request.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction(storeName, 'readwrite');
            let store = transaction.objectStore(storeName);
            store.put(data, key);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}