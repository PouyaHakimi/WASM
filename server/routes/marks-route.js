const express = require('express');
const router = express.Router();
const marksController= require('../controller/marks-controller')


router.get('/marks',marksController.getMarks);

module.exports=router;