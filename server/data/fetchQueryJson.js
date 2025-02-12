const duckdb = require('duckdb')
const db = new duckdb.Database(':memory:')


async function fetchQueryJson(studentPath,markPath,coursePath,query) {
    
    try {
        
    const connection = db.connect()
   
        
       let jsonQuery;
       connection.all(`CREATE VIEW students AS SELECT * FROM read_json_auto('${studentPath}')`);
       connection.all(`CREATE VIEW marks AS SELECT * FROM read_json_auto('${markPath}')`);
       connection.all(`CREATE VIEW courses AS SELECT * FROM read_json_auto('${coursePath}')`);

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

    
        

    const result = await new Promise((resolve, reject) => {
        connection.all(jsonQuery, (err, rows) => {
            if (err) {
               console.error(err);
               reject({ error: true, message: err.message });
                
            } else {
                // Convert BigInt values to regular numbers
                const formattedRows = rows.map(row => {
                    return Object.fromEntries(
                        Object.entries(row).map(([key, value]) => [
                            key, typeof value === "bigint" ? Number(value) : value
                        ])
                    );
                });
    
                console.log(formattedRows); // Debugging
                resolve(formattedRows);
            }
        });
    });
    
    
    return result

} catch (error) {
    console.error("Error querying JSON with DuckDB:" + error); 
    return { error: true, message: error.message }
}
 
}



module.exports = fetchQueryJson