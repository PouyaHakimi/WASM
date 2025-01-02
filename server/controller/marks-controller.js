const sequelize = require('../db');
const Marks = require('../models/marks-model')

exports.getMarks = async (req,res) => {
    
 try{   
    const marksData = await Marks.findAll();
    const marksplain=marksData.map((mark)=>console.log(mark.get({plain:true})
    ));
    
    res.status(200).json(marksData);

}catch(error){
    console.error("Fail to fetch Marks" +error.message);
    res.status(500).json({error:"Fail to fetch marks"})
    
}
    
}


exports.getCourseFullMarkCount = async (req,res) => {
   
   
    const sqlQuery=`SELECT c.cname AS course_name, COUNT(*) AS student_count
            FROM marks m
            JOIN courses c ON m.cid = c.cid
            WHERE m.marks = 30
            GROUP BY c.cname
            ORDER BY c.cname;`

            try {
                const data = await sequelize.query(sqlQuery)
                res.status(200).json(data[0]) // [0] to eliminate metadata 
            } catch (error) {
                console.error("Error in retrieve Data")
                res.status(500).json({error: error.message})
            }
        
}