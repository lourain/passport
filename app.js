var express = require('express')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;
var localStrategy = require('passport-local').Strategy
var app = express()
var cookieParse = require('cookie-parser')
var session = require('express-session')
var ejs = require('ejs')
var BodyParser = require('body-parser')

var router_index = require('./routes/index')
var router_user = require('./routes/user')

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.set('views',__dirname + '/views')
app.set('view engine',ejs)
app.use(cookieParse())
app.use(session({secret:'lyw',name:'sess_id',resave:true,saveUninitialized:true}))
app.use(passport.initialize())
app.use(passport.session())

//配置local-passport并使用

passport.use(new localStrategy(function (username,password,done) {
    var user = {
        id: '1',
        username: 'admin',
        password: 'pass'
    }; // 可以配置通过数据库方式读取登陆账号
    
    if(username !== user.username){
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== user.password) { return done(null, false); }
    return done(null,user)
}))
passport.use(new GitHubStrategy({
    clientID: 'a1fb7a7b517b5133b30e',
    clientSecret: "d38f090dd61efc8e8a6b99566868951f8860fdfb ",
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(err, user);
    }
));
passport.serializeUser(function (user, done) {//保存user对象
    done(null, user);//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象
    done(null, user);//可以通过数据库方式操作
});

app.get('/',router_index)
app.get('/auth/github',passport.authenticate('github'));
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
    
app.post('/login',passport.authenticate('local',{failureRedirect:'/',successRedirect:'/user'}))
app.all('/user',isLoggedIn)
app.get('/user',router_user)
app.listen(3000)


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}
