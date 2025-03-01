const express = require('express');
const { getEcfsData, getAwsData, getSensors, getSensorstest } = require('./controller');

const router = express.Router();

router.get('/ecfsData', getEcfsData);
router.get('/awsData', getAwsData);
router.get('/getSensorsData', getSensors);
router.get('/getSensorsDataTest', getSensorstest);

module.exports = router;