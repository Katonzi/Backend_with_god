const express = require('express');

const cors = require("cors");
const morgan = require("morgan");
const app = express();


//////////////////////////////////////////////////////////////////////////////
//                          MIDDLEWARES GLOBAUX                            //
////////////////////////////////////////////////////////////////////////////
app.use(express.json());  
app.use(cors());
app.use(express.urlencoded({extended:true})); 


app.use(morgan('dev'));      

//Route de test
app.get("/api/with-god", (req, res)=>{     
    res.status(200).json({
        status:"OK",
        message : "Serveur with god est fonctionnel"
    });
});
///////////////////////////////////////////////////////////////////////////////
//LES DIFFERENTES ROUTES DE REQUETES DANS LE SERVEUR DE WITH GOD            //
/////////////////////////////////////////////////////////////////////////////

//AUTHENTIFICATION
const authRoutes = require("./routes/authRoute");
app.use("/api/with-god/auth", authRoutes);   
//VERSETS
const verseRoutes = require("./routes/verseRoutes");  
app.use("/api/with-god/verses", verseRoutes);
//PRIERES
const prayerRoutes = require('./routes/prayerRoutes');
app.use('/api/with-god/prayers', prayerRoutes);
//Route de soutien pour les prières
const prayerSoutienRoutes = require('./routes/prayerSoutienRoutes');
app.use('/api/with-god/prayers', prayerSoutienRoutes);
//INTERCESSIONS
const intercessionRoutes = require('./routes/intercessionRoutes');
app.use('/api/with-god/intercessions', intercessionRoutes); 
//Routes de commentaitres
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/with-god/comments', commentRoutes);
// Permet d'accéder aux fichiers du dossier 'uploads' via l'URL /uploads
app.use('/uploads', express.static('uploads'));
//ROUTE DE LA BIBLE
const bibleRoutes = require('./routes/bibleRoutes');
app.use('/api/with-god/bible', bibleRoutes); 
//CHARGER LES HISTORIQUES DES MESSAGE
const chatRoute = require('./routes/chatRoutes');
app.use('/api/with-god/chats', chatRoute);
//ROUTE DES NOTIFICATIONS
const notificationRoutes = require('./routes/notificationsRoutes');
app.use('/api/with-god/notifications', notificationRoutes);
///////////////////////////////////////////////////////////////////////////////////////////
//GESTION DES MAUVAISES ROUTES                                                          //
/////////////////////////////////////////////////////////////////////////////////////////
app.use((req, res)=>{ 
    res.status(404).json({
        Erreur:"Route introuvable.",
        status:404
    })
})
module.exports = app;         
