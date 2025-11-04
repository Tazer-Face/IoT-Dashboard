const device = require('../controllers/deviceApi');

const express = require("express");
const router = express.Router();

router.get('/findAllDevices',device.findAllDevices);
router.post('/createDevice',device.createDevice);
router.put('/updateDeviceDetails',device.updateDeviceDetails);
router.delete('/deleteDeviceDetails',device.deleteDeviceDetails);

module.exports = router;