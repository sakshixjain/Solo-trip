const Favorite = require("../models/Favorite");
const User = require("../models/User");
const Place = require("../models/Place");

// ==========================
// Add Favorite
// ==========================
const addFavorite = async (req, res) => {

    try {

        const { user_id, place_id } = req.body;

        if (!user_id || !place_id) {
            return res.status(400).json({
                message: "User Id and Place Id are required",
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

        const checkPlace = await Place.findByPk(place_id);

        if (!checkPlace) {
            return res.status(404).json({
                message: "Place not found",
                error: true,
            });
        }

        const alreadyFavorite = await Favorite.findOne({
            where: {
                user_id,
                place_id,
            },
        });

        if (alreadyFavorite) {
            return res.status(400).json({
                message: "Place already added to favorites",
                error: true,
            });
        }

        const favorite = await Favorite.create({
            user_id,
            place_id,
        });

        return res.status(201).json({
            message: "Added to favorites successfully",
            error: false,
            data: favorite,
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
// Get All Favorites
// ==========================
const getAllFavorites = async (req, res) => {

    try {

        const favorites = await Favorite.findAll({

            include: [

                {
                    model: User,
                    attributes: ["user_id", "name", "email"],
                },

                {
                    model: Place,
                    attributes: [
                        "place_id",
                        "place_name",
                        "city",
                        "state",
                        "entry_fee",
                    ],
                },

            ],

            order: [["favorite_id", "DESC"]],

        });

        return res.status(200).json({
            message: "Favorites fetched successfully",
            error: false,
            total: favorites.length,
            data: favorites,
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
// Get Favorites By User
// ==========================
const getFavoritesByUser = async (req, res) => {

    try {

        const { user_id } = req.params;

        const favorites = await Favorite.findAll({

            where: {
                user_id,
            },

            include: [

                {
                    model: Place,
                    attributes: [
                        "place_id",
                        "place_name",
                        "city",
                        "state",
                        "entry_fee",
                        "average_rating",
                    ],
                },

            ],

            order: [["favorite_id", "DESC"]],

        });

        return res.status(200).json({
            message: "Favorites fetched successfully",
            error: false,
            total: favorites.length,
            data: favorites,
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
// Remove Favorite
// ==========================
const removeFavorite = async (req, res) => {

    try {

        const { id } = req.params;

        const favorite = await Favorite.findByPk(id);

        if (!favorite) {

            return res.status(404).json({
                message: "Favorite not found",
                error: true,
            });

        }

        await favorite.destroy();

        return res.status(200).json({
            message: "Favorite removed successfully",
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

// ==========================
// Check Favorite
// ==========================
const checkFavorite = async (req, res) => {

    try {

        const { user_id, place_id } = req.params;

        const favorite = await Favorite.findOne({

            where: {
                user_id,
                place_id,
            },

        });

        return res.status(200).json({

            message: "Status fetched successfully",
            error: false,
            isFavorite: favorite ? true : false,

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

    addFavorite,
    getAllFavorites,
    getFavoritesByUser,
    removeFavorite,
    checkFavorite,

};