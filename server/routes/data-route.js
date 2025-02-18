const express= require('express');
const router = express.Router();
const {getJsonDataController,getJsonCourseFullMarkCount,getJsonAttendedStdCount} = require('../controller/data-controller')
const writeDataController = require('../controller/write-data-controller');
const { getStreamDataController } = require('../controller/streamData-controller');
const { getAllPagedJsonController } = require('../controller/allJsons-paged-Controller');


router.get('/queryData',getJsonDataController)
router.get('/writeJsonData',writeDataController.writeInClientJsonDataController)
router.get('/writeJsonDataServer',writeDataController.writeInServerJsonDataController)
router.get('/streamData' , getStreamDataController)
router.get('/allPagedJsonData' , getAllPagedJsonController)
router.get('/jsonfullmark',getJsonCourseFullMarkCount)
router.get('/jsonattended',getJsonAttendedStdCount)
module.exports = router