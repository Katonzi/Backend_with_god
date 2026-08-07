const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

async function logConnection(){
    try{
        const connection = await pool.getConnection();
        console.log(`Connexion au serveur Mysql réussie ✅`);
        connection.release(); 
    }
    catch(err){
        console.error("❌ Erreur de connexion au serveur Mysql : ", err.message.toUpperCase());
    }
}
  
logConnection();

module.exports = pool; 