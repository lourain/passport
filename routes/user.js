var express = require('express')
var router = express.Router()
var ejs = require('ejs')


router.get('/user', function (req, res) {
    res.render('user.ejs')
})


module.exports = router