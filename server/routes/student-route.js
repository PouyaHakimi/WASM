const express = require('express');
const router = express.Router();
const studentController = require('../controller/student-controller');


//get data

router.get('/students',studentController.getAllStudents);
router.get('/dockDB',studentController.getAllStudents)
router.get('/studentCourseMark',studentController.getStudentCourseMark)
router.get('/attended',studentController.getCourseAttendedStudents)
router.post('/std',studentController.insertStd)

module.exports=router;