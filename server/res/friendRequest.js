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
                dbo.updateOne({pseudo: doc.pseudo}, {$addToSet:{friendReceived: receiver}}, (err)=>{
                    if(err) throw err;
                    dbo.updateOne({pseudo: data.pseudo}, {$addToSet:{friendRequests: requester}}, (err)=>{
                        if(err) throw err;
                        //TODO add message to confirm the friend request
                        res.redirect('/');
                    });
                });
            });
        });
    },
    accept: (req, res, db)=>{

    },
    refuse: (req, res, db)=>{

    }
};