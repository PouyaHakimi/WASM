const express= require('express');
const router = express.Router();
const dataController = require('../controller/data-controller')
const writeDataController = require('../controller/write-data-controller');
const { getStreamDataController } = require('../controller/streamData-controller');


router.get('/queryData',dataController.getJsonDataController)
router.get('/writeJsonData',writeDataController.writeJsonDataController)
router.get('/streamData' , getStreamDataController)
module.exports = router