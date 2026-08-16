const express = require("express");
const router = express.Router();

const {
    addReview,
    getAllReviews,
    getReviewById,
    getReviewsByPlace,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

router.post("/", addReview);
router.get("/", getAllReviews);
router.get("/place/:place_id", getReviewsByPlace);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
