const duckdb = require('duckdb')
const db = new duckdb.Database(':memory:')


async function fetchJson(studentPath,markPath,coursePath,query) {
    console.log(query+">>>>>>");
    console.log(studentPath);
    console.log(coursePath);
    console.log(markPath);
    try {
        
    const connection = db.connect()
   
       let jsonQuery;

       if (!query) {
           jsonQuery = `
              WITH students AS (SELECT * FROM read_json_auto('${studentPath}')),
              marks AS (SELECT * FROM read_json_auto('${markPath}')),
             courses AS (SELECT * FROM read_json_auto('${coursePath}'))
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

    const result = await new Promise((resolve, reject) => {
        connection.all(jsonQuery, (err, rows) => {
            if (err) {
                console.error(err);
                reject(err);
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
    return error     
}

}



module.exports = fetchJson