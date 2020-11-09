let bcrypt = require('bcrypt');

module.exports = function sign(req, res, db){
    db.db('amagus').collection('users').findOne({email: req.body.mailIn}, (err, doc)=>{
        if(err) throw err;
        if(doc !== null){
            console.log('mail already registered');// TODO debug
            res.redirect('/');
        }else{
            console.log('ok now signed in'); //TODO debug
            res.redirect('/editUser');
        }
    });
};