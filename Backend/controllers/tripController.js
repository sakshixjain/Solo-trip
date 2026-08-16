const { Trip, User } = require("../models");

// ==========================
// Create Trip
// ==========================
const createTrip = async (req, res) => {
    try {

        const { user_id, trip_name, start_date, end_date, budget } = req.body;

        if (!user_id || !trip_name) {
            return res.status(400).json({
                message: "User Id and Trip Name are required",
                error: true,
            });
        }

        const checkUser = await User.findByPk(user_id);

        if (!checkUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
            });
        }

        const trip = await Trip.create({
            user_id,
            trip_name,
            start_date,
            end_date,
            budget,
        });

        return res.status(201).json({
            message: "Trip created successfully",
            error: false,
            data: trip,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }
};

// ==========================
// Get All Trips
// ==========================
const getAllTrips = async (req, res) => {

    try {

        const trips = await Trip.findAll({
            include: [
                {
                    model: User,
                    attributes: ["user_id", "name", "email"],
                },
            ],
            order: [["trip_id", "DESC"]],
        });

        return res.status(200).json({
            message: "Trips fetched successfully",
            error: false,
            total: trips.length,
            data: trips,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

// ==========================
// Get Trip By Id
// ==========================
const getTripById = async (req, res) => {

    try {

        const { id } = req.params;

        const trip = await Trip.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ["user_id", "name", "email"],
                },
            ],
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
                error: true,
            });
        }

        return res.status(200).json({
            message: "Trip fetched successfully",
            error: false,
            data: trip,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

// ==========================
// Get Trips By User
// ==========================
const getTripsByUser = async (req, res) => {

    try {

        const { user_id } = req.params;

        const trips = await Trip.findAll({
            where: { user_id },
            order: [["trip_id", "DESC"]],
        });

        return res.status(200).json({
            message: "Trips fetched successfully",
            error: false,
            total: trips.length,
            data: trips,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

// ==========================
// Update Trip
// ==========================
const updateTrip = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            trip_name,
            start_date,
            end_date,
            budget,
            status,
        } = req.body;

        const trip = await Trip.findByPk(id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
                error: true,
            });
        }

        if (trip_name) trip.trip_name = trip_name;
        if (start_date) trip.start_date = start_date;
        if (end_date) trip.end_date = end_date;
        if (budget) trip.budget = budget;
        if (status) trip.status = status;

        await trip.save();

        return res.status(200).json({
            message: "Trip updated successfully",
            error: false,
            data: trip,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

// ==========================
// Delete Trip
// ==========================
const deleteTrip = async (req, res) => {

    try {

        const { id } = req.params;

        const trip = await Trip.findByPk(id);

        if (!trip) {

            return res.status(404).json({
                message: "Trip not found",
                error: true,
            });

        }

        await trip.destroy();

        return res.status(200).json({
            message: "Trip deleted successfully",
            error: false,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    getTripsByUser,
    updateTrip,
    deleteTrip,
};