const express = require('express');
const router = express.Router();
const marksController= require('../controller/marks-controller')


router.get('/marks',marksController.getMarks);
router.get('/fullmark',marksController.getCourseFullMarkCount)

module.exports=router;