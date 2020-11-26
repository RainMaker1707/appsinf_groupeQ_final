//npm modules
let express = require('express');
let parser = require('body-parser');
let session = require('express-session');
let MongoClient = require('mongodb').MongoClient;
let multer = require('multer');
let upload = multer({});
let http = require('http');
let https = require('https');
let path = require('path');
let fs= require('fs');

//DIM modules
let login = require('./res/login.js');
let sign = require('./res/sign.js');
let confirm = require('./res/confirm.js');
let userPage = require('./res/userPage.js');
let loadForum = require('./res/loadForum.js');
let friends = require('./res/friendRequest.js');

// Global variables
let app = express();
let dbUrl = 'mongodb://localhost:27017';


// App configs
let middleWare = session({
    secret : "not_s3cr3t_s3nt3nc3",
    resave : false,
    saveUninitialized : true,
    cookie : {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 , //One week cookie lifetime
        secure: true
    }
});

app.use(express.static('static'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../server/views'));
app.use(parser.urlencoded({extended: true}));
app.use(middleWare);

// server and router (http to https) declaration and configuration
let server = https.createServer({
    key: fs.readFileSync('./server/cert.key'),
    cert: fs.readFileSync('./server/cert.crt')
}, app).listen(443);

http.createServer((req, res)=>{
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
}).listen(80);

// declaration of socket module
let io = require('socket.io')(server);
io.use((socket, next)=>{
    middleWare(socket.request, socket.request.res || {}, next);
});

// noinspection JSIgnoredPromiseFromCall
MongoClient.connect(dbUrl, {useUnifiedTopology: true}, (err, db)=>{
    if(err) throw err;
    else{
        console.log("------- CONNECTED ------");

        io.on('connection', (socket)=>{
            let ioSession = socket.request.session;
            if(ioSession.pseudo !== undefined){
                socket.join(ioSession.pseudo);
                io.emit('message', '🔵 <i>' + ioSession.pseudo + ' joined the chat..</i>');

                socket.on('disconnect', ()=>{
                    io.emit('message', '🔴 <i>' + ioSession.pseudo + ' left the chat..</i>');
                });

                socket.on('message', (message)=>{
                    io.emit('message', '<strong>' + ioSession.pseudo + '</strong>: ' + message);
                });

                socket.on('notif', (notif, to)=>{
                    if (notif.type === "friendRequest"){
                        io.to(to).emit('notif', notif); //don't work idk why
                    }
                    else console.log('notif error');
                });
           }
        });

        app.get('/', (req, res)=>{
            if(!req.session.pseudo) res.render('index.ejs', {cookie: req.session.cookieShowed});
            else{res.render('index.ejs', {user: req.session.pseudo, cookie: req.session.cookieShowed})}
        });

        app.post('/login', (req, res)=>{
            login(req, res, db);
        });

        app.post('/signup', (req, res)=>{
            sign(req, res, db);
        });

        app.get('/user-page', (req, res)=>{
            if(!req.session.pseudo) res.redirect('/');
            else if(req.session.pseudo === req.query.user) userPage(req, res, db, true);
            else userPage(req, res, db, false);
        });

        app.get('/edit-user', (req, res)=>{
            if(!req.session.pseudo) res.redirect('/');
            else res.render('editUser.ejs', {user: req.session.pseudo});
        });

        app.get('/forum', (req, res)=>{
            loadForum(req, res, db);
        });

        app.get('/about-us', (req, res)=>{
            res.render('aboutUs.ejs', {user: req.session.pseudo, cookie: req.session.cookieShowed});
        });

        app.get('/disconnect', (req, res)=>{
            delete req.session._id;
            delete req.session.mail;
            delete req.session.pseudo;
            delete req.session.cookieShowed;
            delete req.session.friends;
            delete req.session.friendRequests;
            delete req.session.friendReceived;
            delete res.redirect('/');
        });

        app.get('/confirm', (req, res)=>{
           if(req.query.user === undefined || req.query.key === undefined) res.redirect('/');
           else confirm(req, res, db);
        });

        app.get('/friendReq', (req, res)=>{
            friends.requested(req, res, db);
        });

        app.get('/refuseFriend', (req, res)=>{
            friends.refuse(req, res, db);
        });

        app.get('/acceptFriend', (req, res)=>{
            friends.accept(req, res, db);
        });

        app.get('/cookieDump', (req, res)=>{
            req.session.cookieShowed = true;
            res.redirect('/');
        });

        app.get('/*', (req, res)=>{
            res.render('error404.ejs');
        });
    }
});