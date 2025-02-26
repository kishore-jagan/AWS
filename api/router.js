const express = require('express');
const { getEcfsData, getAwsData, getSensors } = require('./controller');

const router = express.Router();

router.get('/ecfsData', getEcfsData);
router.get('/awsData', getAwsData);
router.get('/getSensorsData', getSensors);

module.exports = router;