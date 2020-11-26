module.exports = friends = {

    requested: (req, res, db)=>{
        let dbo = db.db('amagus').collection('users');
        dbo.findOne({pseudo: req.session.pseudo}, (err, data)=>{
            if(err) throw err;
            dbo.findOne({pseudo: req.query.user}, (err, doc)=>{
                if(err) throw err;
                 let receiver = {
                    "pseudo": data.pseudo,
                    "publicKey": data.publicKey
                };
                let requester = {
                    "pseudo": doc.pseudo,
                    "publicKey": doc.publicKey,
                };

                let notif = {
                    "type": "friendRequest",
                    "content": {
                        "pseudo": data.pseudo,
                        "picture": data.picture,
                        "date": new Date().toISOString(),
                    }
                };

                dbo.updateOne({pseudo: doc.pseudo}, {$addToSet:{friendReceived: receiver, notifications: notif}}, (err)=>{
                    if(err) throw err;
                    dbo.updateOne({pseudo: data.pseudo}, {$addToSet:{friendRequests: requester}}, (err)=>{
                        if(err) throw err;
                        res.url ='/';
                        res.render('index.ejs', {user: data.pseudo, notif: notif, to: doc.pseudo});
                    });
                });
            });
        });
    },
    accept: (req, res, db)=>{
        res.url = '/';
        res.redirect('/');
    },
    refuse: (req, res, db)=>{
        res.url = '/';
        res.redirect('/');
    }
};