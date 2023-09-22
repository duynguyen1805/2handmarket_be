var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");

// Get
// Lấy tất cả người dùng
router.get("/admin/get-user", adminController.getAllUser);
// // Lấy tin đăng cho homepage
router.get("/admin/get-all-collection", adminController.getALL_collection);

//Post
// xử lý input Search tìm sản phẩm
router.post(
  "/admin/search-tindang-daduyet",
  adminController.Search_tindang_daduyet
);
// Lấy tất cả sản phẩm trong collection
router.post(
  "/admin/get-product-do-hoc-tap",
  adminController.getProduct_Dohoctap
);
router.post(
  "/admin/get-product-do-dien-tu",
  adminController.getProduct_Dodientu
);
router.post(
  "/admin/get-product-phuong-tien",
  adminController.getProduct_Phuongtien
);
router.post(
  "/admin/get-product-do-noi-that",
  adminController.getProduct_Donoithat
);
router.post(
  "/admin/get-product-dien-lanh",
  adminController.getProduct_Dienlanh
);
router.post(
  "/admin/get-product-do-ca-nhan",
  adminController.getProduct_Docanhan
);
router.post(
  "/admin/get-product-do-giai-tri",
  adminController.getProduct_Dogiaitri
);
router.post("/admin/get-product-thu-cung", adminController.getProduct_Thucung);
// Lấy sản phẩm cụ thể theo mã sản phẩm
router.post("/admin/get-product-by-id", adminController.getProductbyId);
// // Lấy 1 người dùng
router.post("/admin/get-user-by-id", adminController.getUserbyId);
// // Lấy tin đăng của 1 người dùng
router.post(
  "/admin/get-tindang-by-id-user",
  adminController.getTindangbyIdUser
);

// //Tạo tất cả sản phẩm chung 1 collection Product
router.post(
  "/admin/create-dang-tin/:id_user-:type",
  adminController.create_Dangtin
);

// // Cập nhật trạng thái đơn hàng
router.put(
  "/admin/update-status-tindang",
  adminController.updateTrangthaiDuyettin
);
router.put(
  "/admin/update-status-antin-by-user",
  adminController.updateTrangthai_Antin_byuser
);
router.put(
  "/admin/update-status-thanhtoan",
  adminController.updateTrangthai_thanhtoan
);
// // delete
// // XÓa 1 người dùng, 1 sản phẩm
router.delete("/admin/delete-user/:id", adminController.deleteUser);
router.delete("/admin/delete-tindang/:type/:id", adminController.deleteBaidang);

// // Login
router.post("/login", adminController.login);
// // Tạo 1 người dùng mới
router.post("/admin/register-user", adminController.registerUser); // path
// // Cập nhật thông tin người dùng
router.put("/admin/update-user", adminController.updateUser);

module.exports = router;
