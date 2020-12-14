# APPSINF LINFO1212 Groupe Q Projet Final
## A-Mag-Us
#### Table des matières
<ol>
    <li>Résumé</li>
    <li>Installation des modules</li>
    <li>Préset de la base de données [optionnel]
    <ul><li>Préset</li><li>Utilisateurs</li><li>News</li><li>Forum</li></ul>
    </li>
    <li>Lancement du serveur</li>
    <li>Pages du sites</li>
    <li>Fonctionnalitées</li>
</ol>

#### Résumé
Ce projet a été initié dans le cadre du cours LINFO1212 de l'UCLouvain. \
Il a pour but de prouver les connaissances d'un groupe de 3 élèves sur les
 technologies de base du web tel que la triade html css et JavaScript et 
 leur module propre tels que nodeJs Bootstrap et MongoDB. \
 Nous avons donc décidé d'implémenter un site dédié à la communauté d'un jeu vidéo 
 du moment: <a href="https://www.innersloth.com/gameAmongUs.php">AmongUs</a>
 
 Pour ce projet veillez donc a bien avoir installer <a href="https://nodejs.org/en/download/">NodeJs</a> et 
 <a href="https://www.mongodb.com/try/download/community">MongoDB</a> sur votre machine.
 Si vous ne pouvez pas executer les commande <a href="https://www.npmjs.com/get-npm">npm</a> 
 veillez à ce que celui-ci soit correctement installer sur votre machine aussi
 
 Nous utilisons beaucoup de modules NodeJs, veillez donc a 
 les avoirs correctement installé avant de lancer le serveur.
 Ces modules sont:
 <ol>
    <li>express</li>
    <li>express-session</li>
    <li>body-parser</li>
    <li>mongodb</li>
    <li>ejs</li>
    <li>multer</li>
    <li>http</li>
    <li>https</li>
    <li>path</li>
    <li>fs</li>
    <li>bcrypt</li>
    <li>crypto</li>
    <li>nodemailer</li>
    <li>socket.io</li>
 </ol>
 
#### Installation des modules
Les modules peuvent être installer par une simple commande npm\
    ````npm install <module-name>````\
    par exemple : ```npm install express-session```
    
Veuillez installer tous les modules requis avant d'essayer de lancer le serveur,
celui-ci pourrait ne pas correctement tourné, voir ne pas se lancer du tout, si tous
les modules ne lui sont pas fournis!

#### Présets de la base de données [optionnel]
Les présets ne sont pas obligatoire mais sachez que sans un utilisateur administrateur
vous ne pourrez pas accéder à la plupart des fonctionnalités du sites web comme 
ajouter un sujet dans le forum, et comme les post sont lier à un sujet s'il n'y a pas de sujet disponible 
les utilisateurs lambda ne pourront rien poster.

Ensuite seul les administrateurs sont autorisé à ajouter des 'news' sur la page d'accueil depuis 
une page similaire à celle du post sur le forum, donc s'il n'y a pas d'aministrateurs aucune news 
(hors présets) ne pourra être ajouter.\
Vous pouvez aussi après avoir inscrit un utilisateurs modifier manuellement les valeurs suivantes 
afin que celui-ci accède à toutes les fonctionnalités du site web.

Un utilisateurs à peine inscrit, qui n'a pas confirmer son inscription via le lien reçu par email ressemble à 
ceci dans la base de données:\
```json
   {
      "activated" : false,
      "master" : false,
      "admin" : false,
      "mail" : "YOUR MAIL @ SFTP . EXT",
      "pseudo" : "YOUR PSEUDO",
      "password" : "YOUR PASSWORD HASH",
      "uniqKey" : "YOUR UNIQ KEY HASH",
      "picture" : null,
      "birthday" : null,
      "publicKey" : "YOUR PUBLIC SSH KEY",
      "privateKey" : "YOUR PRIVATE SSH KEY",
      "favoriteMap" : null,
      "favoriteColor" : null,
      "country" : null,
      "language" : null,
      "friends" : [],
      "friendRequests": [],
      "friendReceived": [],
      "notifications": []
    }
```

Vous devrez setup les trois premiers attributs sur true comme dans l'exemple suivant:

```json
   {
      "activated" : true,
      "master" : true,
      "admin" : true,
      "mail" : "YOUR MAIL @ SFTP . EXT",
      "pseudo" : "YOUR PSEUDO",
      "password" : "YOUR PASSWORD HASH",
      "uniqKey" : "YOUR UNIQ KEY HASH",
      "picture" : null,
      "birthday" : null,
      "publicKey" : "YOUR PUBLIC SSH KEY",
      "privateKey" : "YOUR PRIVATE SSH KEY",
      "favoriteMap" : null,
      "favoriteColor" : null,
      "country" : null,
      "language" : null,
      "friends" : [],
      "friendRequests": [],
      "friendReceived": [],
      "notifications": []
    }
```
Vous pouvez le faire en lançant un terminal mongo depuis n'importe quel terminal de votre machine\
Une fois ce terminal standart ouvert tapé:
    ``mongo``
et le shell mongo s'ouvrira vous permettant de communquer avec la database.
Vous pourrez alors taper:
    ```
    use amagus
    ```
afin d'utiliser la base de données liée à notre site internet.
ensuite taper la commande suivante en remplaçant \<pseudo\> par le pseudo de votre compte.
```shell
    db.forum.updateOne({pseudo: <pseudo>}, {$set:{activated: true, admin: true, master: true}})
```

###### 1° Présets

###### 2° Utilisateurs


###### 3° News


###### 4° Forum


#### Lancement du serveur


#### Pages du sites


#### Fonctionnalitées


