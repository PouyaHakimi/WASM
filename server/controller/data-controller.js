const sequelize = require('../db');
const path = require('path');
const fetchQueryData = require('../data/fetchQueryJson')
const writeJosnFile = require(`../data/writeJsonFile`)


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



