const express = require("express");
const app= express();
require("dotenv").config();
const userRoutes= require("./routes/userRoutes");
const db= require("./config/db");

app.use(express.json());

app.use("/",userRoutes);


db.authenticate()
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));

db.sync({ alter: true });

app.get("/", (req,res)=>{
res.send("backend is running");
});


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
 
