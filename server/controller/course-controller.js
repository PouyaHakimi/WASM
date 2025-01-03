const sequelize = require('../db');
const Courses = require('../models/course-model');

exports.getAllCourses=async(req,res)=>{

    try{
    const coursesData = await Courses.findAll();
    const plainCourse=coursesData.map((course)=>course.get({plain:true}));
    console.log("Retrieved courseee:", plainCourse);
    res.status(200).json(coursesData)
}catch(erorr){
    console.error("Error fetching courses:",erorr.message);
    res.status.json({error:'Failed to fetch courses'})
    
}

}



exports.insertCourse =async (req,res) => {
    console.log(req.body);
    
      try {
      const {table,records} =req.body;
      
    
      records.map(async (data)=>{
        const cid =data.cid
        const cname =data.cname.replace(/'/g, "''")
        const credits =data.credits
        
        const sqlQuery =`insert into ${table}(cid,cname,credits) values (${cid},'${cname}',${credits})`
        try {
          await sequelize.query(sqlQuery)
        } catch (error) {
          console.error(error.message +"&&&&&&&&&&")
          
        }
        
      }
      )
      
      res.status(200).json({message:"inserted successfully"})
    
      } catch (error) {
          console.error("fail to insert")
          res.status(500).json({error:error.message})
          
      }
     
    }
