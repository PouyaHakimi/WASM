import { getDuckDBStd } from "./API/API";
import * as duckdb from '@duckdb/duckdb-wasm';



async function DuckDB(props) {


    try {

        const data = await getDuckDBStd();

        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);


        const worker = await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.

        const logger = new duckdb.ConsoleLogger();


        const db = new duckdb.AsyncDuckDB(logger, worker);
        console.log("db" + db);

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

        for (const row of data) {
            
            
            await c.query(`
                INSERT INTO students (id, sname, age)
                VALUES (${row.id}, '${row.sname}', ${row.age});
            `);
        }
        console.log("Data inserted into table");

        const result = c.query(`select * from students`)

        console.log("Raw Query Result:", result);


        const table = await result;  // Await the Promise to resolve it



        await c.close()

        // convert data from arrow format retrieved from query to standard array of js
        const dataArray = table.toArray()
        return dataArray

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)

    }
}









export default DuckDB;