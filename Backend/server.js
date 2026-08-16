const express = require("express");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const tripRoutes = require("./routes/tripRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const db = require("./config/db");
const cors = require("cors");

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
}));

// Mount Auth and API routes
app.use("/", userRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);


db.authenticate()
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));

// Avoid automatically altering the production schema (can create duplicate indexes).
// Use migrations for production. In development, perform a plain sync without `alter`.
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  db.sync()
    .then(() => console.log('Database synced (development)'))
    .catch(err => console.log(err));
} else {
  console.log('Skipping automatic db.sync in production; use migrations to change schema.');
}

app.get("/", (req, res) => {
  res.send("backend is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

