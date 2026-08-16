const User = require("./user");
const Category = require("./category");
const Place = require("./place");
const Review = require("./review");
const Favorite = require("./favorite");
const Trip = require("./trip");
const PlaceImage = require("./placeImage");

// Category -> Place
Category.hasMany(Place, { foreignKey: "category_id" });
Place.belongsTo(Category, { foreignKey: "category_id" });

// User -> Review
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Place -> Review
Place.hasMany(Review, { foreignKey: "place_id" });
Review.belongsTo(Place, { foreignKey: "place_id" });

// User -> Favorite
User.hasMany(Favorite, { foreignKey: "user_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

// Place -> Favorite
Place.hasMany(Favorite, { foreignKey: "place_id" });
Favorite.belongsTo(Place, { foreignKey: "place_id" });

// User -> Trip
User.hasMany(Trip, { foreignKey: "user_id" });
Trip.belongsTo(User, { foreignKey: "user_id" });

// Place -> Images
Place.hasMany(PlaceImage, { foreignKey: "place_id" });
PlaceImage.belongsTo(Place, { foreignKey: "place_id" });

module.exports = {
    User,
    Category,
    Place,
    Review,
    Favorite,
    Trip,
    PlaceImage,
};