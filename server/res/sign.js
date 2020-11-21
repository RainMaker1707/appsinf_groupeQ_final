let bcrypt = require('bcrypt');
let login = require('./login');
let Mail = require('./mail');

module.exports = function sign(req, res, db){
    if(req.body.passIn !== req.body.passInC){
        console.log("Passwords don't matches"); //TODO remove after debug
        res.redirect('/');
    }else{
        db.db('amagus').collection('users').findOne({"mail": req.body.mailIn}, (err, doc)=>{
            if(err) throw err;
            if(doc !== null) {
                console.log('mail already registered');// TODO remove after debug
                res.redirect('/');
            }else{
                db.db('amagus').collection('users').findOne({"pseudo": req.body.pseudoIn}, (err, doc)=>{
                    if(err) throw err;
                    else if(doc !== null){
                        console.log('pseudo already taken'); //TODO remove after debug
                        res.redirect('/')
                    }else {
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) throw err;
                            bcrypt.hash(req.body.passIn, salt, (err, hash) => {
                                bcrypt.hash(req.body.pseudo + Math.random() + req.body.mailIn + Math.random(), salt,
                                    (err, key)=>{
                                    if (err) throw err;
                                    key = key.replace(/\$/g, '');
                                    let newUser = {
                                        "activated": false,
                                        "mail": req.body.mailIn,
                                        "pseudo": req.body.pseudoIn,
                                        "password": hash,
                                        "uniqKey": key,
                                        "picture": undefined,
                                        "birthday": undefined,
                                        "publicKey": undefined, // TODO generate pair of SSL key
                                        "privateKey": undefined,
                                        "favoriteMap": undefined,
                                        "favoriteColor": undefined,
                                        "country": undefined,
                                        "language" : undefined,
                                        "friends": {}
                                    };
                                    db.db('amagus').collection('users').insertOne(newUser, (err) => {
                                        if (err) throw err;
                                        let mail = new Mail();
                                        mail.send(req.body.mailIn,
                                            "Amagus Account confirmation",
                                            "Please confirm your account register on A-Mag Us: \n" +
                                                    "https://localhost/confirm?key=" + key + "&user=" + newUser.pseudo
                                        );
                                        login(req, res, db , true);
                                    });
                                })
                            })
                        });
                    }
                });
            }
        });
    }
};