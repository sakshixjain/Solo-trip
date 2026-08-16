const express = require("express");
const router = express.Router();

const {
    createPlace,
    getAllPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    searchPlace,
    getPlacesByCategory,
} = require("../controllers/placeController");

router.post("/", createPlace);
router.get("/", getAllPlaces);
router.get("/search", searchPlace);
router.get("/category/:category_id", getPlacesByCategory);
router.get("/:id", getPlaceById);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;
