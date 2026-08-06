const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Category = db.define("Category", {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
    }
});

module.exports = Category;