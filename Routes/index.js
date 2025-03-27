const express = require('express')
const router = express.Router() 

// admin
router.use('/admin/auth', require('./Admin/Auth.js'))
router.use('/user/auth', require('./User/Auth.js'))

module.exports = router;