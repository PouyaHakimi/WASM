const express = require('express');
const router = express.Router();
const userController = require('../controller/student-controller');


//get data

router.get('/users',userController.getAllStudents);
router.get('/dockDB',userController.getAllStudents)


module.exports=router;