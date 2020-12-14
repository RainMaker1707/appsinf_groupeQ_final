module.exports = friends = {
    requested: (req, res, db)=>{
        let dbo = db.db('amagus').collection('users');
        dbo.findOne({pseudo: req.session.pseudo}, (err, requesterData)=>{
            if(err) throw err;
            dbo.findOne({pseudo: req.query.user}, (err, receiverData)=>{
                if(err) throw err;
                 let receiver = {
                    "pseudo": requesterData.pseudo,
                    "publicKey": requesterData.publicKey
                };
                let requester = {
                    "pseudo": receiverData.pseudo,
                    "publicKey": receiverData.publicKey
                };

                let notif = {
                    "type": "friendRequest",
                    "pseudo": requesterData.pseudo,
                    "picture": requesterData.picture,
                    "date": new Date().toISOString()
                };

                dbo.updateOne({pseudo: receiverData.pseudo}, {$addToSet:{friendReceived: receiver, notifications: notif}}, (err)=>{
                    if(err) throw err;
                    dbo.updateOne({pseudo: requesterData.pseudo}, {$addToSet:{friendRequests: requester}}, (err)=>{
                        if(err) throw err;
                        res.url ='/';
                        dbo.findOne({pseudo: req.session.pseudo}, (err, doc)=> {
                            if (err) throw err;
                            req.session.friendRequests = doc.friendRequests;
                            res.render('userPage.ejs', {
                                user: req.session,
                                doc: receiverData,
                                notif: notif,
                                to: receiverData.pseudo,
                            });
                        });
                    });
                });
            });
        });
    },
    accept: (req, res, db)=>{
        let dbo = db.db('amagus').collection('users');
        dbo.findOne({pseudo: req.query.user}, (err, requesterData)=>{
            if(err) throw err;
            dbo.findOne({pseudo: req.session.pseudo}, (err, receiverData)=>{
                if(err) throw err;
                let requesterFriend = {
                    "pseudo": receiverData.pseudo,
                    "publicKey": receiverData.publicKey
                };
                let receiverFriend = {
                    "pseudo": requesterData.pseudo,
                    "publicKey": requesterData.publicKey
                };
                dbo.updateOne({pseudo: requesterData.pseudo}, {$pull:{friendRequests: {pseudo: receiverData.pseudo}},
                        $addToSet: {friends:requesterFriend}}, (err)=>{
                    if(err) throw err;
                    dbo.updateOne({pseudo: receiverData.pseudo}, {$pull:{friendReceived: {pseudo: requesterData.pseudo},
                    notifications: { pseudo: requesterData.pseudo}}, $addToSet:{friends: receiverFriend}}, (err)=>{
                        if(err) throw err;
                        let notif = {
                            "type": "friendAcceptation",
                            "pseudo": receiverData.pseudo,
                            "picture": receiverData.picture,
                            "date": new Date().toISOString()
                        };
                        dbo.findOne({pseudo: req.session.pseudo}, (err, doc)=> {
                            if (err) throw err;
                            req.session.friendReceived = doc.friendReceived;
                            req.session.friends = doc.friends;
                            db.db('amagus').collection('news').find({}).toArray((err, news)=>{
                                if(err) throw err;
                                res.render('index.ejs', {
                                    user: req.session,
                                    notif: notif,
                                    to: requesterData.pseudo,
                                    news: news
                                });
                            });
                        });
                    })
                });
            });
        });
    },
    refuse: (req, res, db)=>{
        let dbo = db.db('amagus').collection('users');
        let requester = req.query.user.toString();
        let receiver = req.session.pseudo.toString();
        dbo.updateOne({pseudo: requester}, {$pull:{friendRequests: {pseudo: receiver}}}, (err)=>{
            if(err) throw err;
            dbo.updateOne({pseudo: receiver}, {$pull:{friendReceived: {pseudo: requester},
                    notifications:{pseudo: requester}}}, (err)=>{
                    if(err) throw err;
                dbo.findOne({pseudo: req.session.pseudo}, (err, doc)=> {
                    if (err) throw err;
                    req.session.friendReceived = doc.friendReceived;
                    res.redirect('back');
                });
            });
        });
    }
};