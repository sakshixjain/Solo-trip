const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "new_project",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = db;