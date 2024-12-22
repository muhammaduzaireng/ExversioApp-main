const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "srv1134.hstgr.io", // Replace with your Hostinger database host
  user: "u518897449_artistMusic", // Replace with your database username
  password: "", // Replace with your database password
  database: "u518897449_artistMusic", // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0,
});

// Export a promise-based pool
const db = pool.promise();

module.exports = db;
