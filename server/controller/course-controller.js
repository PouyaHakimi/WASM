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
