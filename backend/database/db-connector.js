require('dotenv').config(); // load .env variables
// Get an instance of mysql we can use in the app
let mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host: process.env.DB_HOST,          //'classmysql.engr.oregonstate.edu'
    user: process.env.DB_USER,          //'cs340_[your_onid]'
    password: process.env.DB_PASSWORD,  // '[your_db_password]'
    database: process.env.DB_NAME       //'cs340_[your_onid]'
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
module.exports = pool;