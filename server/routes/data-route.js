const express= require('express');
const router = express.Router();
const dataController = require('../controller/data-controller')


router.get('/all',dataController.getAllDataController)

module.exports = router