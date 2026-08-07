const express = require("express");
const router = express.Router();

const {

    addImage,
    getAllImages,
    getImagesByPlace,
    updateImage,
    deleteImage,

} = require("../controllers/placeImageController");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const {
    createTrip,
    getAllTrips,
    getTripById,
    getTripsByUser,
    updateTrip,
    deleteTrip,
} = require("../controllers/tripController");


const {
    addReview,
    getAllReviews,
    getReviewById,
    getReviewsByPlace,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

const {
    addFavorite,
    getAllFavorites,
    getFavoritesByUser,
    removeFavorite,
    checkFavorite,
} = require("../controllers/favoriteController");


router.post("/", createCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);


router.post("/", createTrip);

router.get("/", getAllTrips);

router.get("/:id", getTripById);

router.get("/user/:user_id", getTripsByUser);

router.put("/:id", updateTrip);

router.delete("/:id", deleteTrip);

router.post("/", addReview);

router.get("/", getAllReviews);

router.get("/place/:place_id", getReviewsByPlace);

router.get("/:id", getReviewById);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

router.post("/", createPlace);

router.get("/", getAllPlaces);

router.get("/search", searchPlace);

router.get("/category/:category_id", getPlacesByCategory);

router.get("/:id", getPlaceById);

router.put("/:id", updatePlace);

router.delete("/:id", deletePlace);


router.post("/", addFavorite);

router.get("/", getAllFavorites);

router.get("/user/:user_id", getFavoritesByUser);

router.get("/check/:user_id/:place_id", checkFavorite);

router.delete("/:id", removeFavorite);


router.post("/", addImage);

router.get("/", getAllImages);

router.get("/place/:place_id", getImagesByPlace);

router.put("/:id", updateImage);

router.delete("/:id", deleteImage);


module.exports = router;