const express= require('express');
const router = express.Router();
const courseController =require('../controller/course-controller');


router.get('/courses',courseController.getAllCourses);
router.post('/courses',courseController.insertCourse)

module.exports=router;