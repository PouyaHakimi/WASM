const sequelize = require('../db');
const path = require('path');
const fetchQueryData = require('../data/fetchQueryJson')
const writeJosnFile = require(`../data/writeJsonFile`)
const duckdb = require('duckdb');
const { rejects } = require('assert');
const { error } = require('console');
const db = new duckdb.Database(':memory:')


exports.getJsonDataController = async (req, res) => {

    let { q } = req.query

    const stdPath = path.join(__dirname, '..', 'data', 'students.json');
    const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
    const crsPath = path.join(__dirname, '..', 'data', 'courses.json');



    q = q.replace(/studentsData/g, `'${stdPath}'`)
        .replace(/marksData/g, `'${mrkPath}'`)
        .replace(/coursesData/g, `'${crsPath}'`);






    const stdQuery = `select * from student`
    const crsQuery = `select * from courses`
    const mrkQuery = `select * from marks`

    try {
        const std = await sequelize.query(stdQuery, { type: sequelize.QueryTypes.SELECT })
        const crs = await sequelize.query(crsQuery, { type: sequelize.QueryTypes.SELECT })
        const mrk = await sequelize.query(mrkQuery, { type: sequelize.QueryTypes.SELECT })

        await Promise.all([
            writeJosnFile(stdPath, std),
            writeJosnFile(mrkPath, mrk),
            writeJosnFile(crsPath, crs)
        ])

        console.log("✅ All JSON files written successfully");


        const queryResult = await fetchQueryData(stdPath, mrkPath, crsPath, q);
        if (queryResult.error) {
            return res.status(400).json(queryResult)
        } else {
            return res.status(200).json(queryResult)
        }
    } catch (error) {
        console.error("Error processing data:", error);
        res.status(500).json({ error: "Internal Server Error" });

        // return res.status(500).json({ error: true, message: error.message });

    }
}


exports.getJsonCourseFullMarkCount = async (req, res) => {


    const stdPath = path.join(__dirname, '..', 'data', 'students.json');
    const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
    const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

    const stdQuery = `select * from student`
    const crsQuery = `select * from courses`
    const mrkQuery = `select * from marks`

    try {
        const std = await sequelize.query(stdQuery, { type: sequelize.QueryTypes.SELECT })
        const crs = await sequelize.query(crsQuery, { type: sequelize.QueryTypes.SELECT })
        const mrk = await sequelize.query(mrkQuery, { type: sequelize.QueryTypes.SELECT })


        await Promise.all([
            writeJosnFile(stdPath, std),
            writeJosnFile(mrkPath, mrk),
            writeJosnFile(crsPath, crs)
        ])

        const connection = db.connect()


        
        connection.all(`CREATE VIEW students AS SELECT * FROM read_json_auto('${stdPath}')`);
        connection.all(`CREATE VIEW marks AS SELECT * FROM read_json_auto('${mrkPath}')`);
        connection.all(`CREATE VIEW courses AS SELECT * FROM read_json_auto('${crsPath}')`);


        const FullMarkQuery = `SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;`
       



        const result = await new Promise( (resolve,rejects) =>{
           
         connection.all(FullMarkQuery,(err,rows)=>{
           if(err){
            console.error(err)
            rejects({error:true , message:err.message})
           }else{
            const formatedRow = rows.map((row)=>{
               return Object.fromEntries(
                Object.entries(row).map(([key,value]) => [
                    key , typeof value === 'bigint' ? Number(value):value 
                ])
               )
            })
            console.log(formatedRow);  
            resolve(formatedRow)
           }
         } )
        })
         connection.close()
        if (result.error) {
           return res.status(400).json(result)
        } else {
            return res.status(200).json(result)
        }
       

    } catch (error) {
        console.error("Error in retrieve Data")
        return res.status(500).json({ error: error.message })
    }

}


exports.getJsonAttendedStdCount = async (req, res) => {


    const stdPath = path.join(__dirname, '..', 'data', 'students.json');
    const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
    const crsPath = path.join(__dirname, '..', 'data', 'courses.json');


    try {
     
        const connection = db.connect()


        
        connection.all(`CREATE VIEW students AS SELECT * FROM read_json_auto('${stdPath}')`);
        connection.all(`CREATE VIEW marks AS SELECT * FROM read_json_auto('${mrkPath}')`);
        connection.all(`CREATE VIEW courses AS SELECT * FROM read_json_auto('${crsPath}')`);


        const AttendedQuery = `
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
        `



        const result = await new Promise( (resolve,rejects) =>{
           
         connection.all(AttendedQuery,(err,rows)=>{
           if(err){
            console.error(err)
            rejects({error:true , message:err.message})
           }else{
            const formatedRow = rows.map((row)=>{
               return Object.fromEntries(
                Object.entries(row).map(([key,value]) => [
                    key , typeof value === 'bigint' ? Number(value):value 
                ])
               )
            })
            console.log(formatedRow);  
            resolve(formatedRow)
           }
         } )
        })
         connection.close()
        if (result.error) {
           return res.status(400).json(result)
        } else {
            return res.status(200).json(result)
        }
       

    } catch (error) {
        console.error("Error in retrieve Data")
        return res.status(500).json({ error: error.message })
    }

}
