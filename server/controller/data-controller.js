const sequelize = require('../db');
const fs = require('fs');
const path = require('path');

exports.getAllDataController = async (req, res) => {

    const {q} = req.query

    const stdPath = path.join(__dirname, '..', 'data', 'students.json');
    const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
    const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

    const stdQuery = `select * from student`
    const crsQuery = `select * from courses`
    const mrkQuery = `select * from marks`

    try {


        const std = await sequelize.query(crsQuery, { type: sequelize.QueryTypes.SELECT })
        console.log(std);
        console.log(q);
        
        





    } catch (error) {

    }

}

