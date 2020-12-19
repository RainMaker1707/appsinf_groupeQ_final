let bcrypt = require('bcrypt');

module.exports = function login(req, res, db, justSigned=false){
    db.db('amagus').collection('users').findOne({pseudo: req.body.pseudoIn}, (err, doc)=>{
        if(err) throw err;
        else if(doc === null) {
            console.log('pseudo not registered'); // TODO display message instead of log
            res.redirect('/');
        }else{
            bcrypt.compare(req.body.passIn, doc.password, (err, check)=>{
                if(err) throw err;
                else if (!check) {
                    console.log('bad password'); // TODO display message instead of log
                    res.redirect('/');
                }else {
                    req.session._id = doc._id;
                    req.session.mail = doc.mail;
                    req.session.activated = doc.activated;
                    req.session.master = doc.master;
                    req.session.admin = doc.admin;
                    req.session.pseudo = doc.pseudo;
                    req.session.publicKey = doc.publicKey;
                    req.session.privateKey = doc.privateKey;
                    req.session.notifications = doc.notifications;
                    req.session.friends = doc.friends;
                    req.session.friendRequests = doc.friendRequests;
                    req.session.friendReceived = doc.friendReceived;
                    req.session.chatBar = "";
                    justSigned?res.redirect('/edit-user'):res.redirect('back');
                }
            })
        }
    })
};