const express= require('express');
const router = express.Router();
const dataController = require('../controller/data-controller')
const fronDataController = require('../controller/data-front-controller')

router.get('/queryData',dataController.getJsonDataController)
router.get('/allQueryData',fronDataController.getFrontJsonDataController)
module.exports = router