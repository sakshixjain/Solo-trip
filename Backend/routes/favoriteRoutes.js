const express = require("express");
const router = express.Router();

const {
    addFavorite,
    getAllFavorites,
    getFavoritesByUser,
    removeFavorite,
    checkFavorite,
} = require("../controllers/favoriteController");

router.post("/", addFavorite);
router.get("/", getAllFavorites);
router.get("/user/:user_id", getFavoritesByUser);
router.get("/check/:user_id/:place_id", checkFavorite);
router.delete("/:id", removeFavorite);

module.exports = router;
