const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "new_project",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;