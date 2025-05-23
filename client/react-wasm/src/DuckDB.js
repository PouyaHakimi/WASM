
import { getDuckDBStd, getDuckDBCourses, getDuckDBMarks,getFilteredStdCourseMark, getJsonData, getAllJsonData,writeJsonFile } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';
import { faker, Faker,it } from '@faker-js/faker';




export async function jsonDataDuckDB({query}) {
    let std 
    let crs
    let mrk

    try {

       //  await writeJsonFile()   


         await fetch('/students.json')  // Path to JSON file in the `public` folder
        .then(response => response.json())
        .then(data => {
          std=(data);  // Store the fetched data in the state
        })
        .catch(error => console.error('Error loading JSON:', error));
        console.log("PPPP"+JSON.stringify(std));

        await fetch('/marks.json')  // Path to JSON file in the `public` folder
        .then(response => response.json())
        .then(data => {
          mrk=(data);  // Store the fetched data in the state
        })
        .catch(error => console.error('Error loading JSON:', error));
        console.log("PPPP"+JSON.stringify(mrk));
     
        await fetch('/courses.json')  // Path to JSON file in the `public` folder
        .then(response => response.json())
        .then(data => {
          crs=(data);  // Store the fetched data in the state
        })
        .catch(error => console.error('Error loading JSON:', error));
        console.log("PPPP"+JSON.stringify(crs));
     
     
        
        
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);
       

        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");
        

       let jsonQuery;

       if (!query) {
           jsonQuery = `
              WITH students AS (SELECT * FROM read_json_auto('${std}')),
              marks AS (SELECT * FROM read_json_auto('${mrk}')),
             courses AS (SELECT * FROM read_json_auto('${crs}'))
             SELECT c.cname AS courseName, COUNT(DISTINCT s.id) AS fullMark
             FROM marks m
             JOIN students s ON s.id = m.sid 
             JOIN courses c ON c.cid = m.cid
             WHERE m.marks = 18
             GROUP BY c.cid, c.cname;
           `;
       } else {
           jsonQuery = query  // Use double quotes for paths;  // Use provided query
       }
       
       
    
       const result = c.query(`${jsonQuery}`)
        
       console.log(result);
       
        await c.close()

    
        return []//result

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)

    }
}


//*********************create and join all tables in DuckDB******** 

export async function mainDataDuckDB({search}) {

    try {

        const filteredData = await getFilteredStdCourseMark({search})
     
     
        
        const studentData =filteredData.students
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

        const allAttended= c.query(`SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
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
        const  attendedTable = await allAttended;
    
        
        


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

        const dataRangeMin =1
        const dataRangeMax =2000000
        
        const customFaker = new Faker({ locale: [it] });
        for(let i = dataRangeMin ; i<=dataRangeMax ; i++){
            studentData.push({
                id:i,
                sname: customFaker.person.fullName().replace(/'/g, "''"),
                age:faker.number.int({ min: 18, max: 25 })

            })
        }

        for(let i = 1 ; i<=5 ; i++){
        
            courseData.push({
                cid: i,
                cname:faker.commerce.productName(),
                credits:faker.number.int({ min: 1, max: 10 })
            })

        }
        for(let i = dataRangeMin ; i<=dataRangeMax ; i++){
            const sid = faker.number.int({ min: dataRangeMin, max: dataRangeMax });
            const cid = faker.number.int({ min: 1, max: 5 });
            markData.push({
                id:i,
                sid:sid,
                cid:cid,
                marks: faker.number.int({min:17, max:30})

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

        const allAttended= c.query(`SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
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
        const  attendedTable = await allAttended;
    
        
        


        await c.close()


        // convert data from arrow format retrieved from query to standard plain array of js

        const dataArray = table.toArray().map(row=>({...row}))    // Convert each row to a plain object
        const fullMarksArray = fullMarksTable.toArray().map(row =>({...row}))
        const allAttendedArray = attendedTable.toArray().map(row =>({...row}))

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

//******************DuckDb JSON File */


// Load DuckDB-WASM asynchronously
// async function initDuckDB() {
//     const JSDELIVR_BUNDLES = await duckdb.selectBundle();
//     const bundle = await duckdb.instantiateBundle(JSDELIVR_BUNDLES);

//     const db = new duckdb.Database(bundle);
//     const conn = await db.connect();

//     return { db, conn };
// }

// export async function duckDBJsonFile({search}) {

        
//     const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

//     const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


//     const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

//     const logger = new duckdb.ConsoleLogger();


//     const db = new duckdb.AsyncDuckDB(logger, worker);
    

//     await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

//     console.log("DuckDB initialized successfully!");


//     const c = await db.connect()
//     const filteredData = await getFilteredStdCourseMark({ search });

//     const studentData = filteredData.students;
//     const courseData = filteredData.courses;
//     const markData = filteredData.marks;

//     // Convert to JSON
//     const jsonData = JSON.stringify({ students: studentData, courses: courseData, marks: markData }, null, 2);

//     // Save JSON to a file
//     const jsonBlob = new Blob([jsonData], { type: "application/json" });
//     const jsonUrl = URL.createObjectURL(jsonBlob);
//     downloadFile(jsonUrl, "data.json");

    
    
// }


