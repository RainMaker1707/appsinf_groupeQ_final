let bcrypt = require('bcrypt');
let login = require('./login');
let Mail = require('./mail');
let {generateKeyPair} = require('crypto');

module.exports = function editUser(req, res, db){
    db.db('amagus').collection('users').findOne({pseudo: req.session.pseudo}, (err, doc) => {
        if (err) throw err;
        else {
            // check if same password
            if (req.body.rpassword === "") {
                bcrypt.compare(req.body.password, doc.password, (err, check) => {
                    if (err) throw err;
                    else if (!check) {
                        console.log("does not matches"); //TODO debug
                        res.redirect('back');
                    } else {
                        db.db('amagus').collection('users').updateOne({pseudo: req.session.pseudo},
                            {$set: {favoriteMap: req.body.maps, favoriteColor: req.body.colors, country: req.body.country, language: req.body.language}});
                        res.redirect('/user-page?user=' + req.session.pseudo);
                    }
                });
            } else {
                // change password
                if (req.body.password !== req.body.rpassword) {
                    console.log("different password"); //TODO debug
                    res.redirect('back');
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            bcrypt.hash(req.session.username + Math.random() + req.session.mail + Math.random(), salt, (err, key) => {
                                if (err) throw err;
                                key = key.replace(/\$/g, '');

                                generateKeyPair('rsa', {
                                        modulusLength: 8192,
                                        publicKeyEncoding: {
                                            type: 'spki',
                                            format: 'pem'
                                        },
                                        privateKeyEncoding: {
                                            type: 'pkcs8',
                                            format: 'pem',
                                            cipher: 'aes-256-cbc',
                                            passphrase: key
                                        }
                                    },
                                    (err, publicKey, privateKey) => {
                                        if (err) throw err;
                                        else {
                                            db.db('amagus').collection('users').updateOne({pseudo: req.session.pseudo},
                                                {$set: {password: hash, uniqKey: key, publicKey: privateKey, privateKey: privateKey, favoriteMap: req.body.maps, favoriteColor: req.body.colors, country: req.body.country, language: req.body.language}});
                                            let mail = new Mail();
                                            // doc.activated = false;
                                            mail.send(req.session.mail,
                                                "Password Changed",
                                                "Your password has been changed, please click on the link to confirm it: \n" +
                                                "https://localhost/confirm?key=" + key + "&user=" + req.session.pseudo
                                            );
                                            // login(req, res, db, true);
                                            res.redirect('/user-page?user=' + req.session.pseudo);
                                        }
                                    });
                            });
                        });
                    });
                }
            }
        }
    });
};