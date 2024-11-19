const { DataTypes } = require('sequelize');
const sequelize=require('../db');
const { all } = require('../routes/wasm-route');

const Student= sequelize.define('User',{

 id:{
  type:DataTypes.INTEGER,
  allowNull:false,
  primaryKey:true

 },
  sname:{

    type:DataTypes.TEXT,
    allowNull:false
    

  },
  marks:{
    type:DataTypes.INTEGER,
    allowNull:false
  
  }
},{
  tableName:'student',
  timestamps:false
  
})

module.exports=Student