const sequelize = require("sequelize");

const db=require("./config/db");

const User= db.define("user",{
    user_id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,    
    },
    name:{
        type:sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:sequelize.STRING,
        allowNull:false,
    },
    address:{
        type:sequelize.STRING,
        allowNull:true,
    },
    city:{
        type:sequelize.STRING,
        allowNull:true,
    },
    state:{
        type:sequelize.STRING,
        allowNull:true,
    },
    pincode:{
        type:sequelize.STRING,
        allowNull:true,
    },


});

module.exports=User;