const PlaceImage = require("../models/PlaceImage");
const Place = require("../models/Place");

// ==========================
// Add Image
// ==========================

const addImage = async (req, res) => {

    try {

        const { place_id, image_url } = req.body;

        if (!place_id || !image_url) {
            return res.status(400).json({
                message: "Place Id and Image URL are required",
                error: true,
            });
        }

        const place = await Place.findByPk(place_id);

        if (!place) {
            return res.status(404).json({
                message: "Place not found",
                error: true,
            });
        }

        const image = await PlaceImage.create({
            place_id,
            image_url,
        });

        return res.status(201).json({
            message: "Image uploaded successfully",
            error: false,
            data: image,
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
// Get All Images
// ==========================

const getAllImages = async (req, res) => {

    try {

        const images = await PlaceImage.findAll({

            include: [
                {
                    model: Place,
                    attributes: [
                        "place_id",
                        "place_name",
                    ],
                },
            ],

            order: [["image_id", "DESC"]],

        });

        return res.status(200).json({
            message: "Images fetched successfully",
            error: false,
            total: images.length,
            data: images,
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
// Get Images By Place
// ==========================

const getImagesByPlace = async (req, res) => {

    try {

        const { place_id } = req.params;

        const images = await PlaceImage.findAll({

            where: {
                place_id,
            },

            order: [["image_id", "ASC"]],

        });

        return res.status(200).json({

            message: "Images fetched successfully",
            error: false,
            total: images.length,
            data: images,

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
// Update Image
// ==========================

const updateImage = async (req, res) => {

    try {

        const { id } = req.params;

        const { image_url } = req.body;

        const image = await PlaceImage.findByPk(id);

        if (!image) {

            return res.status(404).json({
                message: "Image not found",
                error: true,
            });

        }

        image.image_url = image_url;

        await image.save();

        return res.status(200).json({

            message: "Image updated successfully",
            error: false,
            data: image,

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
// Delete Image
// ==========================

const deleteImage = async (req, res) => {

    try {

        const { id } = req.params;

        const image = await PlaceImage.findByPk(id);

        if (!image) {

            return res.status(404).json({

                message: "Image not found",
                error: true,

            });

        }

        await image.destroy();

        return res.status(200).json({

            message: "Image deleted successfully",
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

    addImage,
    getAllImages,
    getImagesByPlace,
    updateImage,
    deleteImage,

};