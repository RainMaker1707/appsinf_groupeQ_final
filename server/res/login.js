let bcrypt = require('bcrypt');

module.exports = function login(req, res, db){
    console.log(req.body.passIn, req.body.pseudoIn);
    db.db('amagus').collection('users').findOne({pseudo: req.body.pseudoIn}, (err, doc)=>{
        if(err) throw err;
        else if(doc === null) res.redirect('/');
        else{
            bcrypt.compare(req.body.passIn, doc.password, (err, check)=>{
                if(err) throw err;
                else if (!check) res.redirect('/');
                else res.redirect('/userPage');
            })
        }
    })
};