let bcrypt = require('bcrypt');
let login = require('./login');

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
                                if (err) throw err;
                                let newUser = {
                                    "activated": false,
                                    "mail": req.body.mailIn,
                                    "pseudo": req.body.pseudoIn,
                                    "password": hash,
                                    "picture": undefined,
                                    "birthday": undefined,
                                    "publicKey": undefined,
                                    "privateKey": undefined,
                                    "friends": {},
                                    "favoriteMap": undefined
                                };
                                db.db('amagus').collection('users').insertOne(newUser, (err) => {
                                    if (err) throw err;
                                    //TODO send mail
                                    login(req, res, db , true);
                                });
                            })
                        });
                    }
                });
            }
        });
    }
};