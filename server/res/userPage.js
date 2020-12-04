module.exports = function userPage(req, res, db, owner=false){
    let user = owner?req.session.pseudo:req.query.user;
    db.db('amagus').collection('users').findOne({pseudo: user}, (err, doc)=>{
      if(err) throw err;
      else if(doc === null) res.redirect('/error404');
      res.render('userPage.ejs', {user: req.session.pseudo, doc: doc});
    });
};