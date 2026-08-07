const Review = require("../models/Review");
const User = require("../models/User");
const Place = require("../models/Place");

// ==========================
// Add Review
// ==========================
const addReview = async (req, res) => {

    try {

        const { user_id, place_id, rating, comment } = req.body;

        if (!user_id || !place_id || !rating) {
            return res.status(400).json({
                message: "User, Place and Rating are required",
                error: true,
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
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

        const alreadyReviewed = await Review.findOne({
            where: {
                user_id,
                place_id,
            },
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this place",
                error: true,
            });
        }

        const review = await Review.create({
            user_id,
            place_id,
            rating,
            comment,
        });

        return res.status(201).json({
            message: "Review added successfully",
            error: false,
            data: review,
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
// Get All Reviews
// ==========================
const getAllReviews = async (req, res) => {

    try {

        const reviews = await Review.findAll({

            include: [
                {
                    model: User,
                    attributes: ["user_id", "name"],
                },
                {
                    model: Place,
                    attributes: ["place_id", "place_name"],
                },
            ],

            order: [["review_id", "DESC"]],

        });

        return res.status(200).json({
            message: "Reviews fetched successfully",
            error: false,
            total: reviews.length,
            data: reviews,
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
// Get Review By Id
// ==========================
const getReviewById = async (req, res) => {

    try {

        const { id } = req.params;

        const review = await Review.findByPk(id, {

            include: [
                {
                    model: User,
                    attributes: ["user_id", "name"],
                },
                {
                    model: Place,
                    attributes: ["place_id", "place_name"],
                },
            ],

        });

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
                error: true,
            });
        }

        return res.status(200).json({
            message: "Review fetched successfully",
            error: false,
            data: review,
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
// Get Reviews By Place
// ==========================
const getReviewsByPlace = async (req, res) => {

    try {

        const { place_id } = req.params;

        const reviews = await Review.findAll({

            where: {
                place_id,
            },

            include: [
                {
                    model: User,
                    attributes: ["user_id", "name"],
                },
            ],

            order: [["review_id", "DESC"]],

        });

        return res.status(200).json({
            message: "Reviews fetched successfully",
            error: false,
            total: reviews.length,
            data: reviews,
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
// Update Review
// ==========================
const updateReview = async (req, res) => {

    try {

        const { id } = req.params;

        const { rating, comment } = req.body;

        const review = await Review.findByPk(id);

        if (!review) {

            return res.status(404).json({
                message: "Review not found",
                error: true,
            });

        }

        if (rating) {

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5",
                    error: true,
                });
            }

            review.rating = rating;

        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        return res.status(200).json({
            message: "Review updated successfully",
            error: false,
            data: review,
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
// Delete Review
// ==========================
const deleteReview = async (req, res) => {

    try {

        const { id } = req.params;

        const review = await Review.findByPk(id);

        if (!review) {

            return res.status(404).json({
                message: "Review not found",
                error: true,
            });

        }

        await review.destroy();

        return res.status(200).json({
            message: "Review deleted successfully",
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
    addReview,
    getAllReviews,
    getReviewById,
    getReviewsByPlace,
    updateReview,
    deleteReview,
};