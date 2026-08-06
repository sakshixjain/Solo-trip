const { DataTypes } = require("sequelize");
const db = require("../config/db");

const PlaceImage = db.define("PlaceImage", {
    image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    place_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = PlaceImage;