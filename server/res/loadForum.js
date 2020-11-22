module.exports = function loadForum(req, res, db){
    db.db('amagus').collections('forum').find().toArray((err,doc)=>{
        if(err) throw err;
        if(doc === null) res.render('../server/views/forum.ejs', {});
        else res.render('../server/views/forum.ejs', {});
    });
};