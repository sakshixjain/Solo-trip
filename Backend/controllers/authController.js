const express= require("express");
const User= require("../models/user");

const bcrpyt= require("bcrypt");



register = async(req,res)=>{
    try{

        const {name, email, password, address, city, state, pincode}= req.body;

        if(!name || !email || !password  ){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

        checkEmail = await User.findOne({where:{email:email}});
        if(checkEmail){
            return res.status(400).json({
                message:"email already exists"
            })
        }

        generatePassword= await bcrypt.hash(password, 10);

        const createUser = await User.create({
            name:name,
            email:email,
            password:generatePassword,
            address:address,
            city:city,
            state:state,
            pincode:pincode
        });

        return res.status(201).json({
            message:"user created successfully",
            error:false,
            data:createUser
        });

    }catch(err){
        return res.status(500).json({
            message:"internal server error", 
            error:err
        })
    }
}


login = async(req,res)=>{

    try{
    const {email, password}= req.body;

    if(!email || !password){
        return res.status(400).json({
            message:"All fields are required",
            error:true,
        })
    };

    checkEmail = await User.findByEmail({where:{email:email}});

    if(!checkEmail){
        return res.status(400).json({
            message:"user not found ",
            error:true
        })
    }

    checkPass= await User.compare({where:{password:password}});

    if(!checkPass){
        return res.status(400).json({
            message:"password is incorrect",
            error:true,
        })
    }

    return res.status(200).json({
        message:"user logged in successfully",
        error:false,
    })
}catch(err){
    return res.status(500).json({
        message:"internal server error",
        error:true,
    })
}
}