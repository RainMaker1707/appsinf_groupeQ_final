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
let sign = require('./res/signup.js');

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
        console.log("-------CONNECTED------");

        app.get('/', (req, res)=>{
           res.render('../server/views/index.ejs');
        });

        app.post('/login', (req, res)=>{
            login(req, res, db);
        });

        app.post('/signup', (req, res)=>{
            sign(req, res, db);
        });

        app.get('/userPage', (req, res)=>{
            res.render('../server/views/userPage.ejs', {user: "pseudo"});
        });

        app.get('/editUser', (req, res)=>{
            res.render('../server/views/editUser.ejs', {user: "pseudo"});
        });
    }
});

app.listen(8080);
