const user = require('../controllers/userApi')

const express = require("express");
const router = express.Router();

router.get('/findAllusers',user.findAllusers);
router.post('/createUser',user.createUser);
router.post('/login',user.login);
router.put('/updateUserDetails',user.updateUserDetails);
router.delete('/deleteUserDetails',user.deleteUserDetails);

module.exports = router;