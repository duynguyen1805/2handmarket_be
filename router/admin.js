var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");
const {
  check_user_login,
  check_user_permission,
} = require("../middleware/JWT");

// Login
router.post("/login", adminController.login);
// Register
router.post("/register-user", adminController.registerUser);
// // Lấy tin đăng cho homepage
router.get("/get-all-collection", adminController.getALL_collection);
// Lấy số lượng tin mỗi collection
router.get("/get-all-soluongtin", adminController.get_soluongtin_moidanhmuc);
// Lấy tất cả sản phẩm trong collection
router.post("/get-tin-dang-do-hoc-tap", adminController.get_Tindang_Dohoctap);
router.post("/get-tin-dang-do-dien-tu", adminController.get_Tindang_Dodientu);
router.post(
  "/get-tin-dang-phuong-tien",
  adminController.get_Tindang_Phuongtien
);
router.post("/get-tin-dang-do-noi-that", adminController.get_Tindang_Donoithat);
router.post("/get-tin-dang-dien-lanh", adminController.get_Tindang_Dienlanh);
router.post("/get-tin-dang-do-ca-nhan", adminController.get_Tindang_Docanhan);
router.post("/get-tin-dang-do-giai-tri", adminController.get_Tindang_Dogiaitri);
router.post("/get-tin-dang-thu-cung", adminController.get_Tindang_Thucung);
// Lấy sản phẩm cụ thể theo mã sản phẩm
router.post("/get-tin-dang-by-id", adminController.get_TindangbyId);
// Lấy tin đăng của 1 người dùng
router.post("/get-tin-dang-by-id-user", adminController.getTindangbyIdUser);
// Search tin đăng đã duyệt
router.post("/search-tindang-daduyet", adminController.Search_tindang_daduyet);
// Search tin đăng trên Header
router.post("/search-tindang-header", adminController.Search_tindang_header);

// CẦN LOGIN ---------------------------------------------------------
// Lấy 1 người dùng
router.post("/get-user-by-id", check_user_login, adminController.getUserbyId);
// //Tạo tin đăng
router.post(
  "/create-dang-tin/:id_user-:type",
  check_user_login,
  adminController.create_Dangtin
);
router.put(
  "/update-status-antin-by-user",
  check_user_login,
  adminController.updateTrangthai_Antin_byuser
);
router.delete(
  "/admin/delete-tindang/:type/:id",
  check_user_login,
  adminController.deleteBaidang
);
router.put(
  "/update-status-thanhtoan",
  check_user_login,
  adminController.updateTrangthai_thanhtoan
);
// Cập nhật thông tin người dùng
router.put("/update-user", check_user_login, adminController.updateUser);

// CẦN THÊM ROLE ADMIN ------------------------------------------------
// Lấy tất cả người dùng
router.post(
  "/admin/get-user",
  check_user_login,
  check_user_permission,
  adminController.getAllUser
);
// Cập nhật trạng thái đơn hàng
router.put(
  "/admin/update-status-tindang",
  check_user_login,
  check_user_permission,
  adminController.updateTrangthaiDuyettin
);
// XÓa 1 người dùng, 1 tin đăng
router.delete(
  "/admin/delete-user/:id",
  check_user_login,
  check_user_permission,
  adminController.deleteUser
);

module.exports = router;
