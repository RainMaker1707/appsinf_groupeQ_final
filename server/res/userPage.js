module.exports = function userPage(req, res, db, owner=false){
    db.db('amagus').collection('users').findOne({pseudo: owner?req.session.pseudo:req.query.user}, (err, doc)=>{
      if(err) throw err;
      else if(doc === null) res.redirect('');
      else res.render('userPage.ejs', {user: req.session.pseudo, doc: doc});
    });
};