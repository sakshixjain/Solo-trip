const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
    return jwt.sign(
        {
            user_id:user.user_id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN || "12h",
        }
    );
};

module.exports= generateToken;