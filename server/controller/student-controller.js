const { json } = require('sequelize');
const sequelize = require('../db');
const Students = require('../models/student-model');
const { Op } = require("sequelize");


// here we should do export here to pass data as an callback function not an object
exports.getAllStudents = async (req, res) => {


  const sqlQuery = "select * from student"
  try {
    const std = await sequelize.query(sqlQuery,{type:sequelize.QueryTypes.SELECT})//await Students.findAll();

    res.status(200).json(std);

  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: 'Failed to fetch students' })
  }
}


exports.getFiteredStd= async(req,res)=>{

  
  const {q} = req.query
  
  
  const keys = ["id","sname","cname","marks"]
  

  const stdCourseMarkQuery = ` SELECT r.* ,s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Student s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname; 
                      `
  const stdCourseMark = await sequelize.query(stdCourseMarkQuery,{type:sequelize.QueryTypes.SELECT})

  let filteredResults= stdCourseMark.filter(item => 
    keys.some(key =>item[key]?.toString().toLowerCase().includes(q.toLowerCase())))
   
   
    let sid = [...new Set(filteredResults.map(item =>item.sid))]
    let cid = [...new Set(filteredResults.map(item => item.cid))]
    
     const sqlSid =sid.join(',')
     const sqlCid = cid.join(',')

     if (cid.length === 0 || sid.length === 0) {
      console.log("No data to query");
      return res.status(200).json([]); // Return empty result
  } 

  const stdsqlQuery = `select distinct s.id,s.sname,s.age 
  from marks m
  JOIN student s ON m.sid = s.id
  where m.cid IN (${sqlCid}) and m.sid IN (${sqlSid})`

  const std = await sequelize.query(stdsqlQuery,{type:sequelize.QueryTypes.SELECT})

  
  const courseSqlQuery = `select DISTINCT c.cid,c.cname,c.credits
   from marks m
   JOIN courses c ON m.cid=c.cid
   where m.cid IN (${sqlCid}) and m.sid IN (${sqlSid})
   `
   const course = await sequelize.query(courseSqlQuery,{type:sequelize.QueryTypes.SELECT})
   

  const marksSqlQuery = `
  SELECT distinct *
  FROM marks m
  where m.cid IN (${sqlCid}) and m.sid IN (${sqlSid})
`;

 const marks = await sequelize.query(marksSqlQuery,{type:sequelize.QueryTypes.SELECT})
 

  try {
    
   //await Students.findAll();
  
    res.status(200).json({
      students: std,
      courses: course,
      marks: marks,
    });

  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: 'Failed to fetch students' })
  }


}





exports.getStudentCourseMark = async (req, res) => {
  const keys = ["id","sname","cname","marks"]
  const {q} = req.query
  try {
    const sqlQuery = ` SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Student s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname; 
                      `


   const result = await sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }) 

  let filteredResults = result.filter(item =>
    keys.some(key =>
      item[key]?.toString().toLowerCase().includes(q.toLowerCase()) // Full match with spaces
      
    )
  );
  
    
           
    res.status(200).json(filteredResults)


  } catch (error) {
    console.error("Error fetching Data")
    res.status(500).json({ error: error.message })
  }

}

exports.getCourseAttendedStudents = async (req, res) => {
  const sqlQuery = `SELECT c.cname AS course_name, COUNT(DISTINCT m.sid) AS attended_students
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.cid IN (
                    SELECT DISTINCT cid
                    FROM marks
                    WHERE marks = 30
                    )
            GROUP BY c.cname
            ORDER BY c.cname;`

  try {
    const data = await sequelize.query(sqlQuery)
    res.status(200).json(data[0])
  } catch (error) {
    console.error("Error in Retrieve Data")
    res.status(500).json({ error: error.message })
  }

}


exports.getSearchData = async (req, res) => {


  const {q} =req.query
  try {
    const sqlQuery = ` SELECT s.id, s.sname, c.cname , r.marks
            FROM marks r
            JOIN Student s ON r.sid = s.id
            JOIN Courses c ON r.cid = c.cid
            ORDER BY s.sname; 
                      `

  const results = await sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });
 
  
  if (!Array.isArray(results)) {
      console.error("Query did not return an array.");
      return res.status(500).json({ error: "Unexpected query result format" });
  }
  
  //const keys = ["sname", "cname"]; // Add keys you want to search for
  const keys = ["id","sname","cname","marks"]
  const filteredResults = results.filter(item =>
      keys.some(key => item[key]?.toString().toLowerCase().includes(q.toLowerCase()))
  );
  
  console.log("Filtered Results:", filteredResults);
  res.status(200).json(filteredResults);
  

  } catch (error) {
    console.error("Error fetching Data")
    res.status(500).json({ error: error.message })
  }


}


// ********* Insert*******

exports.insertStd = async (req, res) => {
  console.log(req.body);

  try {
    const { table, records } = req.body;


    records.map(async (data) => {
      const id = data.id
      const sname = data.sname.replace(/'/g, "''")
      const age = data.age

      const sqlQuery = `insert into ${table}(id,sname,age) values (${id},'${sname}',${age})`
      try {
        await sequelize.query(sqlQuery)
      } catch (error) {
        console.error(error.message+"In Insert Student")

      }

    }
    )

    res.status(200).json({ message: "inserted successfully" })

  } catch (error) {
    console.error("fail to insert")
    res.status(500).json({ error: error.message })

  }

}
