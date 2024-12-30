
import { getDuckDBStd, getDuckDBCourses, getDuckDBMarks } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';




export async function studentDuckDB(props) {


    try {

        const studentData = await getDuckDBStd();
        
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
                id INTEGER,
                sname TEXT,
                age INTEGER
            );
        `);
        console.log("Table created");

        for (const row of studentData) {


            await c.query(`
                INSERT INTO students (id, sname, age)
                VALUES (${row.id}, '${row.sname}', ${row.age});
            `);
        }
        console.log("Data inserted into student table");

        const result = c.query(`select * from students`)



        const table = await result;  // Await the Promise to resolve it



        await c.close()

        // convert data from arrow format retrieved from query to standard array of js
        const dataArray = table.toArray()
        
        return dataArray

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)

    }
}


//*********************create and join all tables in DuckDB******** 

export async function mainDataDuckDB(params) {

    try {

        const studentData = await getDuckDBStd();
        const courseData = await getDuckDBCourses();
        const markData = await getDuckDBMarks();        

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

    }

}



//*********************create and join all tables in fake DuckDB******** 
export async function fakeDataDuckDB(params) {

    try {


        const studentData = []//await getDuckDBStd();
        const courseData = []//await getDuckDBCourses();
        const markData = []//await getDuckDBMarks();        

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

    }

}


