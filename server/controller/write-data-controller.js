const sequelize = require('../db');
const path = require('path');
const writeJosnFile = require(`../data/writeJsonFile`)


exports.writeJsonDataController = async (req, res) => {

    const { q } = req.query

     const stdPathFront2 = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'src', 'data', 'students.json');
    // const mrkPathFront = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'src', 'data', 'marks.json');
    // const crsPathFront = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'src', 'data', 'courses.json');

    
    
     console.log(stdPathFront2 +"paaaatttthhhh");
    

    const stdPathFront = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'public', 'students.json');
    const mrkPathFront = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'public', 'marks.json');
    const crsPathFront = path.join(__dirname, '..', '..', 'client', 'react-wasm', 'public', 'courses.json');

    const stdQuery = `select * from student`
    const crsQuery = `select * from courses`
    const mrkQuery = `select * from marks`

    try {
        const std = await sequelize.query(stdQuery, { type: sequelize.QueryTypes.SELECT })
        const crs = await sequelize.query(crsQuery, { type: sequelize.QueryTypes.SELECT })
        const mrk = await sequelize.query(mrkQuery, { type: sequelize.QueryTypes.SELECT })


        console.log("+++++++" + q);

        await Promise.all([
            writeJosnFile(stdPathFront, std),
            writeJosnFile(mrkPathFront, mrk),
            writeJosnFile(crsPathFront, crs)
        ])

        
        return res.status(200).json("data write success")

    } catch (error) {
        console.error("Error processing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}


