
import { getFilteredStdCourseMark, readStreamJsonFile } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';
import { faker, Faker, it } from '@faker-js/faker';
import { fetchJsonData } from "./data/fetchAllJson";



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

        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        // await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

        let jsonQuery;

        if (!query) {
            jsonQuery = `
            SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Students s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname;
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
        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        // await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

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


export async function jsonAttendedStdDataDuckDB() {


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
        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        // await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);


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


///////******************* Json Stream   ***** */


export async function jsonStreamDataDuckDB({ query }) {


    try {


        let data = await readStreamJsonFile()

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

        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        // await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

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

            // Register JSON files as virtual tables instead of fully creating them

            jsonQuery = query  // Use double quotes for paths;  // Use provided query
            result = await c.query(`${jsonQuery}`)


        }


        const resultArray = result.toArray().map(row => ({ ...row }))

        const convertedBigIntResult = resultArray.map(row =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key, typeof value === 'bigint' ? Number(value) : value])
            )
        );
        await c.close()
        return { convertedBigIntResult }





    } catch (error) {

        console.error("error of fetching in BrowserDB", error)
        return { error: true, message: error.message }

    }
}

export async function jsonStreamStdMarkDataDuckDB() {


    try {


        let data = await readStreamJsonFile()


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

        await c.query(`CREATE VIEW students AS SELECT * FROM read_json_auto('students')`);
        await c.query(`CREATE VIEW marks AS SELECT * FROM read_json_auto('marks')`);
        await c.query(`CREATE VIEW courses AS SELECT * FROM read_json_auto('courses')`);

        //await c.query(`CREATE TABLE students AS SELECT * FROM read_json_auto('students')`);
        // await c.query(`CREATE TABLE marks AS SELECT * FROM read_json_auto('marks')`);
        // await c.query(`CREATE TABLE courses AS SELECT * FROM read_json_auto('courses')`);

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