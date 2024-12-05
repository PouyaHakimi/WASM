import { useEffect, useState } from "react";
import { getDuckDBStd } from "./API/API";
import DockDBTable from "./components/DockDBTable";
import * as duckdb from '@duckdb/duckdb-wasm';



async function DockDB(props) {


    try {



        const data = await getDuckDBStd();
        console.log("dataaa" +data);
        


        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
       
        
        const worker =await duckdb.createWorker(bundle.mainWorker);// The worker was correctly instantiated as an actual Worker object.
        
        const logger = new duckdb.ConsoleLogger();
        
        
        const db = new duckdb.AsyncDuckDB(logger, worker);
        console.log("db"+db);
        
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

        console.log("DuckDB initialized successfully!");
        console.log(data, "Fetched Data");

        const c = await db.connect()

        console.log("Database connection established");

        await c.query(`
            CREATE TABLE students (
                id INTEGER,
                sname TEXT,
                marks INTEGER
            );
        `);
        console.log("Table created");

        for (const row of data) {
            await c.query(`
                INSERT INTO students (id, sname, marks)
                VALUES (${row.id}, '${row.sname}', ${row.marks});
            `);
        }
        console.log("Data inserted into table");

       const result = c.query(`select * from students`)

       console.log("Raw Query Result:", result);

       
const table = await result;  // Await the Promise to resolve it
console.log(table +"kiiiiiirrrrrr");



        await c.close()


     
        
        //SetDBdata(data);
        return table

    } catch (error) {

        console.error("error of fetching in BrowserDB", error)

    }
}









export default DockDB;