const express = require("express");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");


const register = async (req, res) => {
    try{

        const {name, email, password, address, city, state, pincode}= req.body;

        if(!name || !email || !password  ){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

        if (typeof password !== 'string' || password.trim().length < 6) {
            return res.status(400).json({
                message: "password must be a string with at least 6 characters"
            });
        }
        console.log(name, email, password);

        const checkEmail = await User.findOne({ where: { email: email } });
        if(checkEmail){
            return res.status(400).json({
                message:"email already exists"
            })
        }

        console.log(checkEmail);
        const generatePassword = await bcrypt.hash(password, 10);

        console.log(generatePassword);

        const createUser = await User.create({
            name:name,
            email:email,
            password:generatePassword,
            address:address,
            city:city,
            state:state,
            pincode:pincode
        });

        console.log(createUser);

        return res.status(201).json({
            message:"user created successfully",
            error:false,
            data:createUser
        });

    }catch (err) {
    console.error(err);

    return res.status(500).json({
        message: err.message,
        error: true,
    });
}
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
            });
        }

        const checkEmail = await User.findOne({
            where: { email }
        });

        if (!checkEmail) {
            return res.status(400).json({
                message: "User not found",
                error: true,
            });
        }

        const checkPass = await bcrypt.compare(
            password,
            checkEmail.password
        );

        if (!checkPass) {
            return res.status(400).json({
                message: "Password is incorrect",
                error: true,
            });
        }

        // Generate token after successful authentication
        const token = generateToken(checkEmail);

        return res.status(200).json({
            message: "User logged in successfully",
            error: false,
            token,
            user: {
                user_id: checkEmail.user_id,
                name: checkEmail.name,
                email: checkEmail.email,
                address: checkEmail.address,
                city: checkEmail.city,
                state: checkEmail.state,
                pincode: checkEmail.pincode,
            },
        });

    } catch (err) {
        console.error(err);

        console.error(err);

    return res.status(500).json({
        message: err.message,
        error: true,
    });
    }
};
module.exports = { register, login };