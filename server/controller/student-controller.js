const Students = require('../models/student-model');

// here we should do export here to pass data as an callback function not an object
 exports.getAllStudents = async(req,res)=>{
  try {
        const users = await Students.findAll();

        
        // Log the plain data to the terminal
        const plainUsers = users.map(user => user.get({ plain: true }));
        console.log("Retrieved students:", plainUsers);
       
        res.status(200).json(users);
        
        
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({error:'Failed to fetch students'})
  }
}



