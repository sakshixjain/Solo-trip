const { Place, Category, Review, PlaceImage } = require("../models");
const { Op } = require("sequelize");


// ========================================
// Create Place
// ========================================

const createPlace = async (req, res) => {

    try {

        const {
            category_id,
            place_name,
            description,
            address,
            city,
            state,
            latitude,
            longitude,
            opening_time,
            closing_time,
            entry_fee,
        } = req.body;

        if (
            !category_id ||
            !place_name ||
            !city ||
            !state
        ) {
            return res.status(400).json({
                message: "Required fields are missing",
                error: true,
            });
        }

        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }

        const alreadyExist = await Place.findOne({
            where: {
                place_name,
                city,
            },
        });

        if (alreadyExist) {
            return res.status(400).json({
                message: "Place already exists",
                error: true,
            });
        }

        const place = await Place.create({
            category_id,
            place_name,
            description,
            address,
            city,
            state,
            latitude,
            longitude,
            opening_time,
            closing_time,
            entry_fee,
        });

        return res.status(201).json({
            message: "Place created successfully",
            error: false,
            data: place,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};


// ========================================
// Get All Places
// ========================================

const getAllPlaces = async (req, res) => {

    try {

        const places = await Place.findAll({

            include: [

                {
                    model: Category,
                    attributes: [
                        "category_id",
                        "category_name",
                    ],
                },

                {
                    model: Review,
                },

                {
                    model: PlaceImage,
                },

            ],

            order: [
                ["place_name", "ASC"],
            ],

        });

        return res.status(200).json({

            message: "Places fetched successfully",
            error: false,
            total: places.length,
            data: places,

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            message: "Internal Server Error",
            error: true,

        });

    }

};


// ========================================
// Get Place By Id
// ========================================

const getPlaceById = async (req, res) => {

    try {

        const { id } = req.params;

        const place = await Place.findByPk(id, {

            include: [

                {
                    model: Category,
                    attributes: [
                        "category_id",
                        "category_name",
                    ],
                },

                {
                    model: Review,
                },

                {
                    model: PlaceImage,
                },

            ],

        });

        if (!place) {

            return res.status(404).json({

                message: "Place not found",
                error: true,

            });

        }

        return res.status(200).json({

            message: "Place fetched successfully",
            error: false,
            data: place,

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            message: "Internal Server Error",
            error: true,

        });

    }

};

const updatePlace = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            category_id,
            place_name,
            description,
            address,
            city,
            state,
            latitude,
            longitude,
            opening_time,
            closing_time,
            entry_fee,
        } = req.body;

        const place = await Place.findByPk(id);

        if (!place) {
            return res.status(404).json({
                message: "Place not found",
                error: true,
            });
        }

        if (category_id) {

            const category = await Category.findByPk(category_id);

            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                    error: true,
                });
            }

            place.category_id = category_id;
        }

        if (place_name) place.place_name = place_name;
        if (description) place.description = description;
        if (address) place.address = address;
        if (city) place.city = city;
        if (state) place.state = state;

        if (latitude) place.latitude = latitude;
        if (longitude) place.longitude = longitude;

        if (opening_time) place.opening_time = opening_time;
        if (closing_time) place.closing_time = closing_time;

        if (entry_fee !== undefined)
            place.entry_fee = entry_fee;

        await place.save();

        return res.status(200).json({
            message: "Place updated successfully",
            error: false,
            data: place,
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
        });

    }

};

const deletePlace = async (req, res) => {

    try {

        const { id } = req.params;

        const place = await Place.findByPk(id);

        if (!place) {
            return res.status(404).json({
                message: "Place not found",
                error: true,
            });
        }

        await place.destroy();

        return res.status(200).json({
            message: "Place deleted successfully",
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

const searchPlace = async (req, res) => {

    try {

        const { keyword } = req.query;

        if (!keyword) {

            return res.status(400).json({
                message: "Search keyword is required",
                error: true,
            });

        }

        const places = await Place.findAll({

            where: {

                [Op.or]: [

                    {
                        place_name: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },

                    {
                        city: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },

                    {
                        state: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },

                ],

            },

            include: [
                {
                    model: Category,
                    attributes: [
                        "category_id",
                        "category_name",
                    ],
                },
            ],

        });

        return res.status(200).json({

            message: "Search completed",
            error: false,
            total: places.length,
            data: places,

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            message: "Internal Server Error",
            error: true,

        });

    }

};

const getPlacesByCategory = async (req, res) => {

    try {

        const { category_id } = req.params;

        const category = await Category.findByPk(category_id);

        if (!category) {

            return res.status(404).json({

                message: "Category not found",
                error: true,

            });

        }

        const places = await Place.findAll({

            where: {
                category_id,
            },

            include: [

                {
                    model: Category,
                    attributes: [
                        "category_name",
                    ],
                },

                {
                    model: Review,
                },

                {
                    model: PlaceImage,
                },

            ],

        });

        return res.status(200).json({

            message: "Places fetched successfully",
            error: false,
            total: places.length,
            data: places,

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

    createPlace,
    getAllPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    searchPlace,
    getPlacesByCategory,

};