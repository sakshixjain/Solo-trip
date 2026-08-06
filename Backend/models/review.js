const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Review = db.define("Review", {
    review_id: {
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
    },

    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    comment: {
        type: DataTypes.TEXT,
    }
});

module.exports = Review;