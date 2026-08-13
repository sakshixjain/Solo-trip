const express = require("express");
const app= express();
require("dotenv").config();
const userRoutes= require("./routes/userRoutes");
const db= require("./config/db");
const cors= require("cors");

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/",userRoutes);


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

app.get("/", (req,res)=>{
res.send("backend is running");
});


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
 
