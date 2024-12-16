const { FOREIGNKEYS } = require('sequelize/lib/query-types');
const marksModel =require('../db');
const Datatype = require('sequelize');
const Student = require('./student-model');
const Course = require('./course-model');

const Marks =marksModel.define('marks',{
    id:{
      
        type:Datatype.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    sid:{
    type:Datatype.INTEGER,
    allowNull:false,
    references:{
        model:Student,
        key:'id'
    }
    
},
    cid:{
    type:Datatype.INTEGER,
    allowNull:false,
    references:{
        model:Course,
        key:'cid'
    } 
},
    marks:{
      type:Datatype.TEXT,
      allowNull:false  
 }
},{
    tableName:'marks',
    timestamps:false
 })

module.exports=Marks