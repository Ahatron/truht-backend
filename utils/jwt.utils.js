import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

export default { generateToken, verifyToken };
