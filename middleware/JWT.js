require("dotenv").config;
const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log("Lỗi tạo JWT: ", error);
  }
  return token;
};

const verify_token = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    let decode = jwt.verify(token, key);
    data = decode;
  } catch (error) {
    console.log("Lỗi verify JWT: ", error);
  }
  return data;
};

module.exports = {
  createJWT,
  verify_token,
};
