const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "195.201.114.229",
  user: "abd",
  password: "abd1",
  database: "abd",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    throw err;
  }
  console.log("Connected to MySQL Database!");
});

module.exports = connection;
