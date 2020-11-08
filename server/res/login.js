let bcrypt = require('bcrypt');

module.exports = function login(req, res, db){
    db.db('amagus').collection('users').findOne({pseudo: req.body.pseudoIn}, (err, doc)=>{
        if(err) throw err;
        else if(doc === null) res.redirect('/'); // pseudo not registered
        else{
            bcrypt.compare(req.body.passIn, doc.password, (err, check)=>{
                if(err) throw err;
                else if (!check) res.redirect('/'); //Bad password
                else res.redirect('/userPage'); // All ok connection ==>
            })
        }
    })
};