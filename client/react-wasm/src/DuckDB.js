
import { getDuckDBStd, getDuckDBCourses, getDuckDBMarks,getFilteredStdCourseMark, getAllJsonData,writeJsonFile, readStreamJsonFile } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';
import { faker, Faker,it } from '@faker-js/faker';
import { fetchJsonData } from "./data/fetchAllJson";



export async function jsonDataDuckDB({query}) {

 let data = await readStreamJsonFile () 
 console.log(JSON.stringify(data.students) +"induckdddddbbbbbbbb");
 
   
 const studentsJsonPath = process.env.REACT_APP_STUDENTS_JSON; 
 const marksJsonPath = process.env.REACT_APP_MARKS_JSON
 const coursesJsonPath = process.env.REACT_APP_COURSES_JSON

 console.log(studentsJsonPath);
 console.log(marksJsonPath);
 console.log(coursesJsonPath);
 
// const std = await fetch(process.env.REACT_APP_STUDENTS_JSON).then(res => res.json());
// const mrk = await fetch(process.env.REACT_APP_MARKS_JSON).then(res => res.json());
// const crs = await fetch(process.env.REACT_APP_COURSES_JSON).then(res => res.json());



 


//   const std = await fetchJsonData(studentsJsonPath)
//   const mrk = await fetchJsonData(marksJsonPath)
//   const crs = await fetchJsonData(coursesJsonPath)

//   console.log(std);
//   console.log(mrk);
//   console.log(crs);
  
  
  


    try {


        // await writeJsonFile()   

        const [std, mrk, crs] = await Promise.all([
            fetchJsonData(studentsJsonPath),
            fetchJsonData(marksJsonPath),
            fetchJsonData(coursesJsonPath)
          ]);
        
        console.log("Fetched students:", std);
        console.log("Fetched marks:", mrk);
        console.log("Fetched courses:", crs);

     
        // const std = await fetch('/data/students.json').then(response => response.json());
        // const mrk = await fetch('/data/marks.json').then(response => response.json());
        // const crs = await fetch('/data/courses.json').then(response => response.json());



        // console.log("Students:", std);
        // console.log("Marks:", mrk);
        // console.log("Courses:", crs);

        query = query.replace(/studentsData/g, 'students.json')
                 .replace(/marksData/g, 'marks.json')
                 .replace(/coursesData/g, 'courses.json');
      

        
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);
       

        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");


        const c = await db.connect()

        console.log("Database connection established");
        
        await db.registerFileText('students.json', JSON.stringify(std));
        await db.registerFileText('marks.json', JSON.stringify(mrk));
        await db.registerFileText('courses.json', JSON.stringify(crs));

       let jsonQuery;

       if (!query) {
           jsonQuery = `
              WITH students AS (SELECT * FROM read_json_auto('students.json')),
              marks AS (SELECT * FROM read_json_auto('marks.json')),
             courses AS (SELECT * FROM read_json_auto('courses.json'))
             SELECT c.cname AS courseName, COUNT(DISTINCT s.id) AS fullMark
             FROM marks m
             JOIN students s ON s.id = m.sid 
             JOIN courses c ON c.cid = m.cid
             WHERE m.marks = 30
             GROUP BY c.cid, c.cname;
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

       console.log(resultArray +"in duckDB");
       console.log(Array.isArray(resultArray) +"in duckDB");
       console.log(typeof resultArray +"in duckDB");

       
        return convertedBigInt

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return {error:true, message:error.message}

    }
}



export async function jsonStreamDataDuckDB({query}) {

    
      
    // const studentsJsonPath = process.env.REACT_APP_STUDENTS_JSON; 
    // const marksJsonPath = process.env.REACT_APP_MARKS_JSON
    // const coursesJsonPath = process.env.REACT_APP_COURSES_JSON
   
    // console.log(studentsJsonPath);
    // console.log(marksJsonPath);
    // console.log(coursesJsonPath);
     
     
       try {
   

    let data = await readStreamJsonFile () 
    // console.log(JSON.stringify(data.students) +"induckdddddbbbbbbbb");
    // console.log(JSON.stringify(data.marks) +"induckdddddbbbbbbbb");
    // console.log(JSON.stringify(data.courses) +"induckdddddbbbbbbbb");
   
           
   
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
           
           await db.registerFileText('students', JSON.stringify(data.students));
           await db.registerFileText('marks', JSON.stringify(data.marks));
           await db.registerFileText('courses', JSON.stringify(data.courses));
   
          let jsonQuery;
   
          if (!query) {
            //   jsonQuery = `
            //      WITH students AS (SELECT * FROM read_json_auto('students')),
            //      marks AS (SELECT * FROM read_json_auto('marks')),
            //     courses AS (SELECT * FROM read_json_auto('courses'))
            //     SELECT c.cname AS courseName, COUNT(DISTINCT s.id) AS fullMark
            //     FROM marks m
            //     JOIN students s ON s.id = m.sid 
            //     JOIN courses c ON c.cid = m.cid
            //     WHERE m.marks = 30
            //     GROUP BY c.cid, c.cname;
            //   `;
            jsonQuery = `
            WITH students AS(select * from read_json_auto (students)),
            marks AS (select * from read_json_auto (marks)),
            courses AS (select * from read_json_auto (courses))
            SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname;
            `
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
   
          console.log("in duckDB" + JSON.stringify(convertedBigInt.map((item)=>item.cname)) );
        //   console.log(Array.isArray(resultArray) +"in duckDB");
        //   console.log(typeof resultArray +"in duckDB");
   
          
           return convertedBigInt
   
       } catch (error) {
   
           console.error("error of fetching in BrowserDB", error)
           return {error:true, message:error.message}
   
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


