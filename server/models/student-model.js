const { DataTypes } = require('sequelize');
const sequelize=require('../db');
const { all } = require('../routes/student-route');

const Student= sequelize.define('student',{

 id:{
  type:DataTypes.INTEGER,
  allowNull:false,
  primaryKey:true

 },
  sname:{

    type:DataTypes.TEXT,
    allowNull:false
    

  },
  age:{
    type:DataTypes.INTEGER,
    allowNull:false
  
  }
},{
  tableName:'student',
  timestamps:false
  
})

module.exports=Student