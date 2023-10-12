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
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log("Lỗi verify JWT: ", error);
  }
  return decoded;
};

// const check_user_login = (req, res, next) => {
//   let cookies = req.cookies;
//   // let cookies = req.headers.cookie;
//   console.log("check cookies: ", cookies.jwt_token);
//   if (cookies && cookies.jwt_token) {
//     let decoded = verify_token(cookies.jwt_token);
//     if (decoded) {
//       req.user = decoded;
//       next();
//     } else {
//       return res.status(401).json({
//         errorCode: 401,
//         message: "Cần đăng nhập trên truy cập",
//       });
//     }
//   } else {
//     return res.status(401).json({
//       errorCode: 401,
//       message: "Cần đăng nhập trên truy cập",
//     });
//   }
// };
const check_user_login = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    const decoded = verify_token(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({
        errorCode: 401,
        message: "Cần đăng nhập trước khi truy cập",
      });
    }
  } else {
    return res.status(401).json({
      errorCode: 401,
      message: "Cần đăng nhập trước khi truy cập",
    });
  }
};

const check_user_permission = (req, res, next) => {
  if (req.user) {
    let role = req.user.role;
    if (role && role == "Admin") {
      next();
    } else {
      return res.status(403).json({
        error: 403,
        message: "Không có quyền truy cập tài nguyên này",
      });
    }
  } else {
    return res.status(401).json({
      error: 401,
      message: "Cần đăng nhập trên truy cập",
    });
  }
};

module.exports = {
  createJWT,
  verify_token,
  check_user_login,
  check_user_permission,
};
