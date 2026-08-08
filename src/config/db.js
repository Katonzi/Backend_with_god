const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.LOCAL_DB_HOST,
    user: process.env.DB_USER || process.env.LOCAL_DB_USER,
    password: process.env.DB_PASSWORD || process.env.LOCAL_DB_PASSWORD,
    database: process.env.DB_NAME || process.env.LOCAL_DB_NAME,
    port: process.env.DB_PORT || process.env.LOCAL_DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0        
});         
  
async function logConnection(){
    try{
         
        const connection = await pool.getConnection();
        if(process.env.DB_HOST){
            console.log(`Connexion au serveur Mysql ${process.env.DB_USER} réussie ✅`);
        }
        else if(process.env.LOCAL_DB_HOST){
            console.log(`Connexion mysql local ${process.env.LOCAL_DB_USER} réussie ✅!`);
        }

        connection.release();  
    }
    catch(err){
        console.error("❌ Erreur de connexion au serveur Mysql : ", err.message.toUpperCase());
    }
}
  
logConnection();

module.exports = pool; 