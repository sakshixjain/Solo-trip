const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Trip = db.define("Trip", {
    trip_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    trip_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    start_date: {
        type: DataTypes.DATEONLY,
    },

    end_date: {
        type: DataTypes.DATEONLY,
    },

    budget: {
        type: DataTypes.INTEGER,
    },

    status: {
        type: DataTypes.ENUM("Planning", "Completed", "Cancelled"),
        defaultValue: "Planning",
    }
});

module.exports = Trip;