const express = require("express");
const router = express.Router();

const {
    createTrip,
    getAllTrips,
    getTripById,
    getTripsByUser,
    updateTrip,
    deleteTrip,
} = require("../controllers/tripController");

router.post("/", createTrip);
router.get("/", getAllTrips);
router.get("/user/:user_id", getTripsByUser);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
