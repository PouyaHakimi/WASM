const Marks = require('../models/marks-model')

exports.getMarks = async (req,res) => {
    
 try{   
    const marksData = await Marks.findAll();
    const marksplain=marksData.map((mark)=>console.log(mark.get({plain:true})
    ));
    
    res.status(200).json(marksData);

}catch(error){
    console.error("Fail to fetch Marks" +error.message);
    req.status(500).json({error:"Fail to fetch marks"})
    
}
    
}

