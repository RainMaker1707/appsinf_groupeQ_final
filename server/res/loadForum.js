module.exports = function loadForum(req, res, db){
    db.db('amagus').collection('forum').find({}).toArray((err,doc)=>{
        if(err) throw err;
        else res.render('forum.ejs', {doc: doc});
    });
};