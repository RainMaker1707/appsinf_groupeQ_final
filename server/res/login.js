let bcrypt = require('bcrypt');

module.exports = function login(req, res, db){
    db.db('amagus').collection('users').findOne({pseudo: req.body.pseudoIn}, (err, doc)=>{
        if(err) throw err;
        else if(doc === null) {
            console.log('pseudo not registered'); // TODO DEBUG
            res.redirect('/');
        }else{
            bcrypt.compare(req.body.passIn, doc.password, (err, check)=>{
                if(err) throw err;
                else if (!check) {
                    console.log('bad password'); // TODO DEBUG
                    res.redirect('/');
                }else {
                    console.log('connected'); //TODO DEBUG
                    res.redirect('/userPage');
                }
            })
        }
    })
};