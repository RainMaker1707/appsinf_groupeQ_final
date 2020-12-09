module.exports = (req, res, db)=>{
    let conv = req.query.conv.split(' ');
    let title = conv[0].replace(/</g, '\'').replace(/_/g, ' ');
    let author = conv[1].replace(/</g, '\'').replace(/_/g, ' ');
    let date = conv[2].replace(/</g, '\'').replace(/_/g, ' ');
    console.log(title, author, date);
    res.redirect('/forum');
};