const { DataTypes } = require('sequelize');
const sequelize =require('../db');

const Course = sequelize.define('course',{

    cid:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    cname:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    credits:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    tableName:'courses',
    timestamps:false
})

module.exports=Course