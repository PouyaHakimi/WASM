const express= require('express');
const router = express.Router();
const {getJsonDataController,getJsonCourseFullMarkCount,getJsonAttendedStdCount} = require('../controller/data-controller')
const writeDataController = require('../controller/write-data-controller');
const { getStreamDataController } = require('../controller/streamData-controller');


router.get('/queryData',getJsonDataController)
router.get('/writeJsonData',writeDataController.writeJsonDataController)
router.get('/streamData' , getStreamDataController)
router.get('/jsonfullmark',getJsonCourseFullMarkCount)
router.get('/jsonattended',getJsonAttendedStdCount)
module.exports = router