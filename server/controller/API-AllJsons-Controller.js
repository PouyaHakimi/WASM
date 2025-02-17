const sequelize = require('../db');
const path = require('path');
const writeJosnFile = require(`../data/writeJsonFile`)
const duckdb = require('duckdb');
const { rejects } = require('assert');
const { error } = require('console');
const db = new duckdb.Database(':memory:')


exports.getAllJsonController = async (req, res) => {


    const stdPath = path.join(__dirname, '..', 'data', 'students.json');
    const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
    const crsPath = path.join(__dirname, '..', 'data', 'courses.json');
    
    const page =parseInt(req.query.page) || 1
    const limit =parseInt(req.query.limit)||1000000
    const offset = (page-1)*limit
  

    try {
        
        const connection = db.connect()


        const allStudentsQuery = `SELECT * FROM read_json_auto('${stdPath}') LIMIT ${limit} OFFSET ${offset}`
        const allMarksQuery= `SELECT * FROM read_json_auto('${mrkPath}') LIMIT ${limit} OFFSET ${offset}`
        const allCoursesQuery = `SELECT * FROM read_json_auto('${crsPath}')`



        const allStudentsResult = await new Promise((resolve, rejects) => {

            connection.all(allStudentsQuery, (err, rows) => {
                if (err) {
                    console.error(err)
                    rejects({ error: true, message: err.message })
                } else {
                    const formatedRow = FormatBigIntTonumber(rows)
                    console.log(formatedRow);
                    resolve(formatedRow)
                }
            })
        })
       
       
        const allMarksResult = await new Promise((resolve, rejects) => {

            connection.all(allMarksQuery, (err, rows) => {
                if (err) {
                    console.error(err)
                    rejects({ error: true, message: err.message })
                } else {
                    const formatedRow = FormatBigIntTonumber(rows)
                    console.log(formatedRow);
                    resolve(formatedRow)
                }
            })
        })
       


        const allCoursesResult = await new Promise((resolve, rejects) => {

            connection.all(allCoursesQuery, (err, rows) => {
                if (err) {
                    console.error(err)
                    rejects({ error: true, message: err.message })
                } else {
                    const formatedRow = FormatBigIntTonumber(rows)
                    console.log(formatedRow);
                    resolve(formatedRow)
                }
            })
        })
       
       
        connection.close()




        if (allStudentsResult.error) {
            return res.status(400).json(allStudentsResult)
        } else if(allMarksResult.error){
            return res.status(400).json(allMarksResult)
        } else if (allCoursesResult.error) {
            return res.status(400).json(allCoursesResult)
        } else{
            console.log("&&&&&&&"+allMarksResult);
            
            return res.status(200).json({
                students:allStudentsResult,
                marks: allMarksResult,
                courses: allCoursesResult,
                page,
                limit
               })
        }

    

    } catch (error) {
        console.error("Error in retrieve Data")
        return res.status(500).json({ error: error.message })
    }


    function FormatBigIntTonumber(rows) {
        return rows.map(row=>
            Object.fromEntries(
            Object.entries(row).map(([key,value]) =>[ key, typeof value === 'bigint' ? Number(value) : value] )
        ))
    }
 
}
