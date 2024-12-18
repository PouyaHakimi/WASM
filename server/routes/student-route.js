const express = require('express');
const router = express.Router();
const userController = require('../controller/student-controller');


//get data

router.get('/students',userController.getAllStudents);
router.get('/dockDB',userController.getAllStudents)


module.exports=router;