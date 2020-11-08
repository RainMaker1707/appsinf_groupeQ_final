//npm modules
let express = require('express');
let parser = require('body-parser');
let session = require('express-session');
const multer = require('multer');
const upload = multer({});
let MongoClient = require('mongodb').MongoClient;
let http = require('http');
let https = require('https');
let fs= require('fs');

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
            res.redirect('/userPage');
        });

        app.post('/signup', (req, res)=>{
            res.redirect('/editUser');
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
