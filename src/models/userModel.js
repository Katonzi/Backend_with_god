const db = require('../config/db');

const User = { 
    // Trouver un utilisateur par son email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    
    findByName : async (username)=>{
        const rows = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);

        return rows[0];
    },

    // Créer un nouvel utilisateur
    create: async (username, email, password) => {
        const connection = await db.getConnection();
        try{
            await connection.beginTransaction();

            const [result] = await connection.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        await connection.commit()
        return result.insertId;
        }
        catch(err){
            connection.rollback();
            throw error
        }
        finally{
            await connection.release();
        }
    }
};

module.exports = User; 