//npm modules
let express = require('express');
let parser = require('body-parser');
let session = require('express-session');
let MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const upload = multer({});
let http = require('http');
let https = require('https');
let fs= require('fs');

//DIM modules
let login = require('./res/login.js');
let sign = require('./res/sign.js');
let confirm = require('./res/confirm.js');

// Global variables
let app = express();
let dbUrl = 'mongodb://localhost:27017';

// App configs
app.use(express.static('static'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended: true}));
app.use(session({
    secret : "not_s3cr3t_s3nt3nc3",
    resave : false,
    saveUninitialized : true,
    cookie : {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 , //One week cookies lifetime
        secure: true
    }
}));

MongoClient.connect(dbUrl, {useUnifiedTopology: true}, (err, db)=>{
    if(err) throw err;
    else{
        console.log("------- CONNECTED ------");

        app.get('/', (req, res)=>{
            if(!req.session.pseudo) res.render('../server/views/index.ejs', {cookie: req.session.cookieShowed});
            else{res.render('../server/views/index.ejs', {user: req.session.pseudo, cookie: req.session.cookieShowed})}
        });

        app.post('/login', (req, res)=>{
            login(req, res, db);
        });

        app.post('/signup', (req, res)=>{
            sign(req, res, db);
        });

        app.get('/user-page', (req, res)=>{
            if(!req.session.pseudo) res.redirect('/');
            else res.render('../server/views/userPage.ejs', {user: req.session.pseudo, doc: {pseudo: "RainMaker"}});
        });

        app.get('/edit-user', (req, res)=>{
            if(!req.session.pseudo) res.redirect('/');
            else res.render('../server/views/editUser.ejs', {user: req.session.pseudo});
        });

        app.get('/forum', (req, res)=>{
            res.render('../server/views/forum.ejs');
        });

        app.get('/about-us', (req, res)=>{
            res.render('../server/views/aboutUs.ejs');
        });

        app.get('/disconnect', (req, res)=>{
            delete req.session._id;
            delete req.session.mail;
            delete req.session.pseudo;
            delete req.session.cookieShowed;
            res.redirect('/');
        });

        app.get('/confirm', (req, res)=>{
           if(req.query.user === undefined || req.query.key === undefined) res.redirect('/');
           else confirm(req, res, db);
        });

        app.get('/cookieDump', (req, res)=>{
            req.session.cookieShowed = true;
            res.redirect('/');
        });

        app.get('/*', (req, res)=>{
            res.render('../server/views/error404.ejs');
        });
    }
});

https.createServer({
    key: fs.readFileSync('./server/cert.key'),
    cert: fs.readFileSync('./server/cert.crt')
}, app).listen(443);

http.createServer((req, res)=>{
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);
