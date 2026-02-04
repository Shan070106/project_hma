import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config(); // loads jwt-secret-token on process.env from .env file

const signinToken = (userId) => {
    return jwt.sign(
        {userId},  
        process.env.JWT_SECRET,
        { expiresIn: "1d"}
    );
}

export default signinToken;