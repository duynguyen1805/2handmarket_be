const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const port = process.env.PORT;
const route = require("./router");
const db = require("./config/db");
const methodOverride = require("method-override");
const cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const cron = require("node-cron");
const Hoc_tap = require("./models/Hoc_tap");
const Do_dien_tu = require("./models/Do_dien_tu");
const Phuong_tien = require("./models/Phuong_tien");
const Do_noi_that = require("./models/Do_noi_that");
const Dien_lanh = require("./models/Dien_lanh");
const Do_ca_nhan = require("./models/Do_ca_nhan");
const Do_giai_tri = require("./models/Do_giai_tri");
const Thu_cung = require("./models/Thu_cung");

const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

// Connect DB
db.connect();
const app = express();

// const allowedOrigins = process.env.URL_FONTEND.split(",");
let allowedOrigins;
if (process.env.NODE_ENV === "development") {
  // Lấy biến môi trường từ .env.local trong môi trường development
  require("dotenv").config({ path: ".env" });
  allowedOrigins = process.env.URL_FONTEND;
} else {
  allowedOrigins = process.env.URL_FONTEND;
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app.use(Middleware)
// HTTP logger
app.use(morgan("combined"));
// Template engine

// config cookieparser
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is active.");
});

app.get("/show-ip-server", async (req, res) => {
  try {
    const response = await axios.get("https://api64.ipify.org?format=json");
    console.log("Server IP:", response?.data);
  } catch (error) {
    console.error("Không lấy được IP:", error);
  }
});

route(app);

// cấu hình socket push noti
const server = http.createServer(app);
const io = new Server(server, {
  // cors: {
  //   origin: process.env.URL_FONTEND,
  //   methods: ["GET", "POST"],
  // },
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Đính đối tượng socket.io vào ứng dụng Express
app.set("socket", io);

// tạo cv định thời chạy mỗi ngày (0 0 * * *) lúc 00:00 để kiểm tra => cập nhật trangthaithanhtoan và xóa tin đăng quá hạn
cron.schedule("0 0 * * *", async () => {
  const collections = [
    Hoc_tap,
    Do_dien_tu,
    Phuong_tien,
    Do_noi_that,
    Dien_lanh,
    Do_ca_nhan,
    Do_giai_tri,
    Thu_cung,
  ]; // Thêm tên các collection bạn muốn tìm trong đây
  // Tạo mảng các promise cho việc tìm và cập nhật trong từng collection
  const promises = collections.map(async (collection) => {
    try {
      // Tìm tất cả các tin đăng có trạng thái thanh toán là 1 và thời gian kết thúc quảng cáo đã qua 7 ngày
      const tinDangCanCapNhat = await collection.find({
        trangthaithanhtoan: 1,
        thoiGianKetThucQuangCao: { $lt: new Date() },
      });
      // tìm tất cả tin đăng đang hiển thị và kiểm tra hết hạn hiển thị chưa ?
      const check_thoihantindang = await collection.find({
        trangthai: 2,
        expires_tindang: { $lt: new Date() },
      });
      const check_thoihantindang_trangthai3 = await collection.find({
        trangthai: 3,
        expires_tinbituchoi_tinan: { $lt: new Date() },
      });
      // Cập nhật trạng thái của các tin đăng về 0
      await Promise.all(
        [
          tinDangCanCapNhat.map(async (tinDang) => {
            tinDang.trangthaithanhtoan = 0;
            tinDang.thoiGianKetThucQuangCao = new Date();
            await tinDang.save();
          }),
        ],
        [
          check_thoihantindang.map(async (tinDang) => {
            // delete tinDang trangthai_2
            await tinDang.remove();
          }),
        ],
        [
          check_thoihantindang_trangthai3.map(async (tinDang) => {
            // delete tinDang trangthai_3
            await tinDang.remove();
          }),
        ]
      );
      console.log(
        `Đã cập nhật trạng thái tin đăng trong collection ${collection.modelName}.`
      );
    } catch (error) {
      console.error(
        `Lỗi trong quá trình cập nhật trạng thái tin đăng trong collection ${collection.modelName}:`,
        error
      );
    }
  });

  // Chạy tất cả các promise
  Promise.all(promises)
    .then(() => {
      console.log("Đã hoàn thành tất cả các cập nhật.");
      // Thực hiện bất kỳ công việc nào khác sau khi đã cập nhật xong trong tất cả các collection
    })
    .catch((err) => {
      console.error("Lỗi trong quá trình cập nhật tin đăng:", err);
    });
});

// không idea server
// Cron job chạy mỗi 5 phút
cron.schedule("*/5 * * * *", async () => {
  try {
    const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
    await axios.get(serverUrl);
    console.log("Ping server thành công.");
  } catch (error) {
    console.error("Ping server thất bại:", error.message);
  }
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
