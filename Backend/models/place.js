const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Place = db.define("Place", {
    place_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    place_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
    },

    address: {
        type: DataTypes.STRING,
    },

    city: {
        type: DataTypes.STRING,
    },

    state: {
        type: DataTypes.STRING,
    },

    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },

    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },

    opening_time: {
        type: DataTypes.TIME,
    },

    closing_time: {
        type: DataTypes.TIME,
    },

    entry_fee: {
        type: DataTypes.INTEGER,
    },

    average_rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    }
});

module.exports = Place;