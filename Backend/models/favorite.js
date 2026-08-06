const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Favorite = db.define("Favorite", {
    favorite_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    place_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Favorite;