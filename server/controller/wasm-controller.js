const Students = require('../models/wasm-model');

// here we should do export here to pass data as an callback function not an object
 exports.getAllStudents = async(req,res)=>{
  try {
        const users = await Students.findAll();

        
        // Log the plain data to the terminal
        const plainUsers = users.map(user => user.get({ plain: true }));
        console.log("Retrieved users:", plainUsers);
       
        res.status(200).json(users);
        
        
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({error:'Failed to fetch user'})
  }
}



