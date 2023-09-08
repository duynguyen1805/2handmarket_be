const bcrypt = require("bcrypt");
const User = require("../models/user");
const { MongooseObject, mutiMongooseObject } = require("../util/Mongoose");
require("dotenv").config();
const unidecode = require("unidecode");
//format phonenumber
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const Hoc_tap = require("../models/Hoc_tap");
const Do_dien_tu = require("../models/Do_dien_tu");
const Phuong_tien = require("../models/Phuong_tien");
const Do_noi_that = require("../models/Do_noi_that");
const Dien_lanh = require("../models/Dien_lanh");
const Do_ca_nhan = require("../models/Do_ca_nhan");
const Do_giai_tri = require("../models/Do_giai_tri");
const Thu_cung = require("../models/Thu_cung");
const phoneUtil = PhoneNumberUtil.getInstance();
var salt = bcrypt.genSaltSync(10);
const crypto = require("crypto");

class AdminController {
  // NGƯỜI DÙNG
  // Đăng ký user
  registerUser = async (req, res, next) => {
    if (req.body) {
      const user = await User.findOne({ account: req.body.account });
      if (user) {
        return res.status(200).json({
          errCode: 2,
          message: "Tài khoản đã tồn tại",
        });
      } else {
        let hashPassword = await bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPassword;
        // Lưu user
        req.body = new User(req.body);
        req.body
          .save()
          .then(async () => {
            res.json({
              errCode: 0,
              message: "Đăng ký tài khoản thành công.",
            });
          })
          .catch(next);
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thông tin rỗng, vui lòng nhập lại",
      });
    }
  };
  // Đăng nhập
  login = async (req, res, next) => {
    const account = req.body.account;
    const password = req.body.password;
    console.log("req.body", req.body);
    if (!account || !password) {
      return res.status(200).json({
        errCode: 1,
        message: "Tài khoản hoặc mật khẩu rỗng",
      });
    } else {
      const user = await User.findOne({ account: account });
      if (user) {
        let result = await bcrypt.compareSync(password, user.password);
        if (result) {
          return res
            .status(200)
            .json({ errCode: 0, message: "Đăng nhập thành công", user: user });
        } else {
          return res.status(200).json({
            errCode: 2,
            message: "Mật khẩu không đúng, vui lòng thử lại",
          });
        }
      } else {
        return res.status(200).json({
          errCode: 3,
          message: "Tài khoản không tồn tại",
        });
      }
    }
  };
  // Lấy tất cả user
  getAllUser(req, res, next) {
    User.find()
      .then((users) => {
        res.json({
          users: mutiMongooseObject(users),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Lấy người dùng theo id
  getUserbyId = async (req, res, next) => {
    if (req.body) {
      Promise.all([User.find({ _id: req.body.id })])
        .then(([User]) => {
          res.json({
            User: mutiMongooseObject(User),
          });
        })
        .catch(next);
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin người dùng bị lỗi.",
      });
    }
  };
  // Xóa người dùng
  deleteUser(req, res, next) {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          errCode: 0,
          message: "Xóa người dùng thành công.",
        });
      })
      .catch(next);
  }
  // cập nhật thông tin người dùng (không password)
  updateUser = async (req, res, next) => {
    if (req.body.account && req.body.password) {
      const user = await User.findOne({ account: req.body.account });
      if (user) {
        let result = bcrypt.compareSync(req.body.password, user.password);
        if (result) {
          if (req.body.newpassword) {
            //hash newpassword
            let hashPassword = bcrypt.hashSync(req.body.newpassword, salt);
            req.body.password = hashPassword;
          } else {
            //hashpassword update luôn
            let hashPassword = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hashPassword;
          }
          User.updateOne({ account: req.body.account }, req.body)
            .then(() => {
              return res.json({
                errCode: 0,
                message: `Cập nhật thông tin người dùng thành công.`,
              });
            })
            .catch(next);
        } else {
          return res.status(200).json({
            errCode: 3,
            message: "Mật khẩu không chính xác",
          });
        }
      } else {
        return res.status(200).json({
          errCode: 2,
          message: "Tài khoản không tồn tại",
        });
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Không có thông tin account và password",
      });
    }
  };
  // ĐĂNG TIN
  //Tạo tin đăng từng collection
  async create_Dangtin(req, res, next) {
    const { id_user, type } = req.params;
    if (req.body && type) {
      if (type === "hoctap") {
        req.body = new Hoc_tap(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "phuongtien") {
        req.body = new Phuong_tien(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "dodientu") {
        req.body = new Do_dien_tu(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "donoithat") {
        req.body = new Do_noi_that(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "dienlanh") {
        req.body = new Dien_lanh(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "dodungcanhan") {
        req.body = new Do_ca_nhan(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "dogiaitri") {
        req.body = new Do_giai_tri(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
      if (type === "thucung") {
        req.body = new Thu_cung(req.body);
        req.body.id_user = id_user;
        req.body
          .save()
          .then(() =>
            res.json({
              errCode: 0,
              message: "Tạo tin đăng thành công.",
            })
          )
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        message: "Thông tin tin đăng không đủ, vui lòng nhập đủ",
      });
    }
  }
  phanhoiMomo = (req, res, next) => {
    console.log("check req: ", req.body);
    // const data = req.body;
    // const secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
    // // Check the signature
    // const signature = req.headers["x-partner-signature"];
    // const expectedSignature = crypto
    //   .createHmac("sha256", secretKey)
    //   .update(JSON.stringify(data))
    //   .digest("hex");

    // if (signature === expectedSignature) {
    //   // Verify the request's validity
    //   if (data.partnerCode === partnerCode && data.paymentStatus === 0) {
    //     // Process payment information here
    //     // Update payment status, store in the database, etc.

    //     // Respond to MoMo
    //     res.status(200).send("OK");
    //   } else {
    //     res.status(400).send("Bad Request");
    //   }
    // } else {
    //   res.status(401).send("Unauthorized");
    // }
    // if (data) {
    //   console.log("check data: ", data);
    //   console.log("check signature: ", signature);
    //   console.log("check expectedSignature: ", expectedSignature);
    // } else {
    //   console.log("no data here");
    // }
  };

  getALL_collection = async (req, res, next) => {
    try {
      //moi collection lay 3 tin moi nhat
      const all_collection = await Promise.all([
        Hoc_tap.find({ trangthai: 2 }).sort({ createdAt: -1 }).limit(3).exec(),
        Phuong_tien.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Do_dien_tu.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Do_noi_that.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Dien_lanh.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Do_ca_nhan.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Do_giai_tri.find({ trangthai: 2 })
          .sort({ createdAt: -1 })
          .limit(3)
          .exec(),
        Thu_cung.find({ trangthai: 2 }).sort({ createdAt: -1 }).limit(3).exec(),
      ]);
      // merge chung 1 [] sort bên FE
      const merged_Allcollection = [].concat(...all_collection);
      res
        .status(200)
        .json({ all_collection: mutiMongooseObject(merged_Allcollection) });
    } catch (error) {
      res.status(200).json({
        error: 1,
        message: "Lấy getALL bị lỗi",
      });
    }
  };

  getProduct_Dohoctap = async (req, res, next) => {
    //type: giaotrinh, sachthamkhao, other_hoctap
    const { type, soluong, trangthai, pagehientai } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      // if (type === "ALL") {
      // const typesArray = ["giaotrinh", "sachthamkhao", "other_hoctap"];
      //   const options = {
      //     sort: { createdAt: -1 },
      //     limit: soluong_int,
      //     skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
      //   };
      //   const filter = {
      //     type: type,
      //     trangthai: 2,
      //   };
      //   if (trangthai) {
      //     filter.trangthai = trangthai;
      //   }
      //   var promises = typesArray.map((typeItem) => {
      //     filter.type = typeItem;
      //     const countPromise = Hoc_tap.countDocuments(filter); // dem item
      //     const dataPromise = Hoc_tap.find(filter, null, options).exec();
      //     return Promise.all([countPromise, dataPromise]);
      //   });
      //   Promise.all(promises)
      //     .then((results) => {
      //       let totalCount = 0;
      //       let all_dohoctap = [];
      //       results.forEach(([count, data]) => {
      //         totalCount += count;
      //         all_dohoctap.push(...mutiMongooseObject(data));
      //       });
      //       const totalpages = Math.ceil(totalCount / 12);
      //       res.status(200).json({
      //         errCode: 0,
      //         message: "Lấy thông tin tin đăng thành công",
      //         all_dohoctap,
      //         totalpages: totalpages,
      //       });
      //     })
      //     .catch(next);
      // }
      if (type === "ALL") {
        const filter = {
          trangthai: 2,
        };
        let pipeline = [];
        if (trangthai) {
          filter.trangthai = trangthai;
          pipeline = [
            {
              $match: filter,
            },
          ];
        } else {
          pipeline = [
            {
              $match: filter,
            },
            {
              $addFields: {
                tralendauList: {
                  $cond: {
                    if: { $eq: ["$trangthaithanhtoan", 1] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
            {
              $sort: {
                tralendauList: -1,
                createdAt: -1,
              },
            },
            {
              $skip: (pagehientai - 1) * soluong_int,
            },
            {
              $limit: soluong_int,
            },
          ];
        }
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Hoc_tap.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Hoc_tap.aggregate(pipeline)
            .then((all_dohoctap) => resolve(all_dohoctap))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_dohoctap]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_dohoctap.length; i++) {
              const id_user = all_dohoctap[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_dohoctap[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // all_dohoctap: mutiMongooseObject(all_dohoctap), aggregate => trả về json thô, không cần mutiMongooseObject
              all_dohoctap: all_dohoctap,
              totalpages: totalpages,
            });
          })
          .catch(next);
      } else {
        // const options = {
        //   sort: { createdAt: -1 },
        //   limit: soluong_int,
        //   skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
        // };
        const filter = {
          type: type,
          trangthai: 2,
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Hoc_tap.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Hoc_tap.aggregate(pipeline)
            .then((all_dohoctap) => resolve(all_dohoctap))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_dohoctap]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_dohoctap.length; i++) {
              const id_user = all_dohoctap[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_dohoctap[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // all_dohoctap: mutiMongooseObject(all_dohoctap), aggregate => trả về json thô, không cần mutiMongooseObject
              all_dohoctap: all_dohoctap,
              totalpages: totalpages,
            });
          })
          .catch(next);
        // Promise.all([
        //   Hoc_tap.countDocuments(filter),
        //   Hoc_tap.find(filter, null, options).exec(),
        // ])
        //   .then(([totalCount, Hoc_tap]) => {
        //     const totalpages = Math.ceil(totalCount / 12);
        //     res.status(200).json({
        //       errCode: 0,
        //       message: "Lấy thông tin tin đăng thành công",
        //       all_dohoctap: mutiMongooseObject(Hoc_tap),
        //       totalpages: totalpages,
        //     });
        //   })
        //   .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Dodientu = async (req, res, next) => {
    const {
      type,
      hang,
      cpu,
      ram,
      dungluong,
      sim,
      screensize,
      ocung,
      loaiocung,
      displaycard,
      loaimayanh,
      loaithietbideo,
      loaiphukien,
      loailinhkien,
      mausac,
      tinhtrang,
      trangthai, // 1:doiduyet, 2:daduyet, 3:tuchoi, 4:nguoidungAn admin moi them de lay ALL (macdinh cac hang lay trangthai 1)
      soluong, //so luong item muon lay moi trang
      pagehientai, // trang hien tai
    } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const typesArray = [
          "dienthoai",
          "maytinhbang",
          "laptop",
          "desktop",
          "thietbideothongminh",
          "mayanh",
          "phukien",
          "linhkien",
        ];
        const options = {
          sort: { createdAt: -1 },
          limit: soluong_int,
          skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
        };
        const filter = {
          type: type,
          trangthai: 2,
        };
        if (trangthai) {
          filter.trangthai = trangthai;
        }
        var promises = typesArray.map((type) => {
          filter.type = type;
          return Do_dien_tu.find(filter, null, options).exec(); // Lấy soluong tin đăng đầu tiên của mỗi loại
        });
        // theo thứ tự typesArray
        Promise.all(promises)
          .then((results) => {
            let all_dodientu = [];
            results.forEach((products) => {
              all_dodientu = all_dodientu.concat(mutiMongooseObject(products));
            });
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng thành công",
              all_dodientu,
            });
          })
          .catch(next);
      }
      if (type === "dienthoai") {
        // type, soluong, hang, pagehientai
        // const options = {
        //   sort: { createdAt: -1 },
        //   limit: soluong_int,
        //   skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
        // };
        // const filter = {
        //   type: type,
        //   trangthai: 2,
        //   ...(hang !== "ALL" && { hang }),
        //   ...(ram && { ram }),
        //   ...(dungluong && { dungluong }),
        //   ...(mausac && { mausac }),
        //   ...(tinhtrang && { tinhtrang }),
        // };
        // Promise.all([
        //   Do_dien_tu.countDocuments(filter),
        //   Do_dien_tu.find(filter, null, options).exec(),
        // ])
        //   .then(([totalCount, dienthoai]) => {
        //     const totalpages = Math.ceil(totalCount / soluong_int);
        //     res.status(200).json({
        //       errCode: 0,
        //       message: "Lấy thông tin tin đăng ALL",
        //       dienthoai: mutiMongooseObject(dienthoai),
        //       totalpages: totalpages,
        //     });
        //   })
        //   .catch(next);
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(ram && { ram }),
          ...(dungluong && { dungluong }),
          ...(mausac && { mausac }),
          ...(tinhtrang && { tinhtrang }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((dienthoai) => resolve(dienthoai))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, dienthoai]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < dienthoai.length; i++) {
              const id_user = dienthoai[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                dienthoai[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              dienthoai: dienthoai,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "maytinhbang") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(ram && { ram }),
          ...(dungluong && { dungluong }),
          ...(mausac && { mausac }),
          ...(tinhtrang && { tinhtrang }),
          ...(sim && { sim }),
          ...(screensize && { screensize }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((maytinhbang) => resolve(maytinhbang))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, maytinhbang]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < maytinhbang.length; i++) {
              const id_user = maytinhbang[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                maytinhbang[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              maytinhbang: maytinhbang,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "laptop") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(cpu && { cpu }),
          ...(ram && { ram }),
          ...(ocung && { ocung }),
          ...(loaiocung && { loaiocung }),
          ...(tinhtrang && { tinhtrang }),
          ...(displaycard && { displaycard }),
          ...(screensize && { screensize }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((laptop) => resolve(laptop))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, laptop]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < laptop.length; i++) {
              const id_user = laptop[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                laptop[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              laptop: laptop,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "desktop") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(cpu !== "ALL" && { cpu }),
          ...(ram && { ram }),
          ...(ocung && { ocung }),
          ...(loaiocung && { loaiocung }),
          ...(tinhtrang && { tinhtrang }),
          ...(displaycard && { displaycard }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((desktop) => resolve(desktop))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, desktop]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < desktop.length; i++) {
              const id_user = desktop[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                desktop[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              desktop: desktop,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "mayanh") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(loaimayanh && { loaimayanh }),
          ...(tinhtrang && { tinhtrang }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((mayanh) => resolve(mayanh))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, mayanh]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < mayanh.length; i++) {
              const id_user = mayanh[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                mayanh[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              mayanh: mayanh,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "thietbideothongminh") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loaithietbideo !== "ALL" && { loaithietbideo }),
          ...(tinhtrang && { tinhtrang }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((thietbideothongminh) => resolve(thietbideothongminh))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, thietbideothongminh]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < thietbideothongminh.length; i++) {
              const id_user = thietbideothongminh[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                thietbideothongminh[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              thietbideothongminh: thietbideothongminh,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "phukien") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loaiphukien !== "ALL" && { loaiphukien }),
          ...(tinhtrang && { tinhtrang }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((phukien) => resolve(phukien))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, phukien]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < phukien.length; i++) {
              const id_user = phukien[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                phukien[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              phukien: phukien,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "linhkien") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loailinhkien !== "ALL" && { loailinhkien }),
          ...(tinhtrang && { tinhtrang }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_dien_tu.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_dien_tu.aggregate(pipeline)
            .then((linhkien) => resolve(linhkien))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, linhkien]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < linhkien.length; i++) {
              const id_user = linhkien[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                linhkien[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              linhkien: linhkien,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Phuongtien = async (req, res, next) => {
    //type: oto, xemay, xetai, xedien, xedap, phutung
    //hang: honda, yamaha, ....
    //: phutungxemay, phutungoto
    const {
      type,
      hang,
      dongxe,
      loaixemay,
      dungtich,
      hopso,
      nhienlieu,
      taitrong,
      sochongoi,
      soluong,
      loaixedien,
      dongcoxedien,
      loaixedap,
      loaiphutung,
      trangthai,
      pagehientai,
    } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const typesArray = [
          "oto",
          "xemay",
          "xetai",
          "xedien",
          "xedap",
          "phutung",
        ];
        const options = {
          sort: { createdAt: -1 },
          limit: soluong_int,
          skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
        };
        const filter = {
          type: type,
          trangthai: 2,
        };
        if (trangthai) {
          filter.trangthai = trangthai;
        }
        var promises = typesArray.map((type) => {
          filter.type = type;
          return Phuong_tien.find(filter, null, options).exec();
        });
        // theo thứ tự typesArray
        Promise.all(promises)
          .then((results) => {
            let all_phuongtien = [];
            results.forEach((products) => {
              all_phuongtien = all_phuongtien.concat(
                mutiMongooseObject(products)
              );
            });
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng thành công",
              all_phuongtien,
            });
          })
          .catch(next);
      }
      if (type === "oto") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(dongxe && { dongxe }),
          ...(hopso && { hopso }),
          ...(nhienlieu && { nhienlieu }),
          ...(sochongoi && { sochongoi }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((oto) => resolve(oto))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, oto]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < oto.length; i++) {
              const id_user = oto[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                oto[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              oto: oto,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "xemay") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(dongxe && { dongxe }),
          ...(loaixemay && { loaixemay }),
          ...(dungtich && { dungtich }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((xemay) => resolve(xemay))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, xemay]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < xemay.length; i++) {
              const id_user = xemay[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                xemay[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              xemay: xemay,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "xetai") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(taitrong && { taitrong }),
          ...(nhienlieu && { nhienlieu }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((xetai) => resolve(xetai))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, xetai]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < xetai.length; i++) {
              const id_user = xetai[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                xetai[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              xetai: xetai,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "xedien") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loaixedien !== "ALL" && { loaixedien }),
          ...(dongcoxedien && { dongcoxedien }),
        };
        //loaixedien: ["xedapdien", "xemaydien"]
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((xedien) => resolve(xedien))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, xedien]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < xedien.length; i++) {
              const id_user = xedien[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                xedien[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              xedien: xedien,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "xedap") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loaixedap !== "ALL" && { loaixedap }),
        };
        //loaixedap: ["xedapphothong","xedapthethao","xedaptreem"]
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((xedap) => resolve(xedap))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, xedap]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < xedap.length; i++) {
              const id_user = xedap[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                xedap[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              xedap: xedap,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "phutung") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(loaiphutung !== "ALL" && { loaiphutung }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Phuong_tien.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Phuong_tien.aggregate(pipeline)
            .then((phutung) => resolve(phutung))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, phutung]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < phutung.length; i++) {
              const id_user = phutung[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                phutung[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              phutung: phutung,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Donoithat = async (req, res, next) => {
    //type: banghe, tuke, giuong, bep, dungcubep, quat, den
    const { type, soluong, trangthai, pagehientai } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const filter = {
          trangthai: 2,
        };
        let pipeline = [];
        if (trangthai) {
          filter.trangthai = trangthai;
          pipeline = [
            {
              $match: filter,
            },
          ];
        } else {
          pipeline = [
            {
              $match: filter,
            },
            {
              $addFields: {
                tralendauList: {
                  $cond: {
                    if: { $eq: ["$trangthaithanhtoan", 1] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
            {
              $sort: {
                tralendauList: -1,
                createdAt: -1,
              },
            },
            {
              $skip: (pagehientai - 1) * soluong_int,
            },
            {
              $limit: soluong_int,
            },
          ];
        }
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_noi_that.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        const getDataPromise = new Promise((resolve, reject) => {
          Do_noi_that.aggregate(pipeline)
            .then((all_donoithat) => resolve(all_donoithat))
            .catch((error) => reject(error));
        });
        Promise.all([countDocumentsPromise, getDataPromise]).then(
          async ([totalCount, all_donoithat]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            for (let i = 0; i < all_donoithat.length; i++) {
              const id_user = all_donoithat[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_donoithat[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_donoithat: all_donoithat,
              totalpages: totalpages,
            });
          }
        );
      } else {
        const filter = {
          type: type,
          trangthai: 2,
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_noi_that.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        const getDataPromise = new Promise((resolve, reject) => {
          Do_noi_that.aggregate(pipeline)
            .then((all_donoithat) => resolve(all_donoithat))
            .catch((error) => reject(error));
        });
        Promise.all([countDocumentsPromise, getDataPromise]).then(
          async ([totalCount, all_donoithat]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_donoithat.length; i++) {
              const id_user = all_donoithat[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_donoithat[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_donoithat: all_donoithat,
              totalpages: totalpages,
            });
          }
        );
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Dienlanh = async (req, res, next) => {
    //type: tulanh, maylanh, maygiat
    //hang: toshiba, samsung,...
    const {
      type,
      hang,
      thetich,
      congsuat,
      khoiluonggiat,
      cuagiat,
      soluong,
      trangthai,
      pagehientai,
    } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const typesArray = ["tulanh", "maylanh", "maygiat"];
        const options = {
          sort: { createdAt: -1 },
          limit: soluong_int,
          skip: (pagehientai - 1) * soluong_int, // Tính vị trí bắt đầu lấy dữ liệu
        };
        const filter = {
          type: type,
          trangthai: 2,
        };
        if (trangthai) {
          filter.trangthai = trangthai;
        }
        var promises = typesArray.map((type) => {
          filter.type = type;
          return Dien_lanh.find(filter, null, options).exec();
        });
        Promise.all(promises)
          .then((results) => {
            let all_dienlanh = [];
            results.forEach((products) => {
              all_dienlanh = all_dienlanh.concat(mutiMongooseObject(products));
            });

            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng thành công",
              all_dienlanh,
            });
          })
          .catch(next);
      }
      if (type === "tulanh") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(thetich && { thetich }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Dien_lanh.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Dien_lanh.aggregate(pipeline)
            .then((tulanh) => resolve(tulanh))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, tulanh]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < tulanh.length; i++) {
              const id_user = tulanh[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                tulanh[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              tulanh: tulanh,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "maylanh") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(congsuat && { congsuat }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Dien_lanh.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Dien_lanh.aggregate(pipeline)
            .then((maylanh) => resolve(maylanh))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, maylanh]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < maylanh.length; i++) {
              const id_user = maylanh[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                maylanh[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              maylanh: maylanh,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
      if (type === "maygiat") {
        const filter = {
          type: type,
          trangthai: 2,
          ...(hang !== "ALL" && { hang }),
          ...(khoiluonggiat && { khoiluonggiat }),
          ...(cuagiat && { cuagiat }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Dien_lanh.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Dien_lanh.aggregate(pipeline)
            .then((maygiat) => resolve(maygiat))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, maygiat]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < maygiat.length; i++) {
              const id_user = maygiat[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                maygiat[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              // dienthoai: mutiMongooseObject(dienthoai), aggregate => trả về json thô, không cần mutiMongooseObject
              maygiat: maygiat,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Docanhan = async (req, res, next) => {
    //type: quanao, dongho, giaydep, nuochoa, balo, other
    const { type, soluong, trangthai, pagehientai, chogioitinh } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const filter = {
          trangthai: 2,
          ...(chogioitinh && { chogioitinh }),
        };
        let pipeline = [];
        if (trangthai) {
          filter.trangthai = trangthai;
          pipeline = [
            {
              $match: filter,
            },
          ];
        } else {
          pipeline = [
            {
              $match: filter,
            },
            {
              $addFields: {
                tralendauList: {
                  $cond: {
                    if: { $eq: ["$trangthaithanhtoan", 1] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
            {
              $sort: {
                tralendauList: -1,
                createdAt: -1,
              },
            },
            {
              $skip: (pagehientai - 1) * soluong_int,
            },
            {
              $limit: soluong_int,
            },
          ];
        }
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_ca_nhan.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_ca_nhan.aggregate(pipeline)
            .then((all_docanhan) => resolve(all_docanhan))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_docanhan]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_docanhan.length; i++) {
              const id_user = all_docanhan[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_docanhan[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_docanhan: all_docanhan,
              totalpages: totalpages,
            });
          })
          .catch(next);
      } else {
        const filter = {
          type: type,
          trangthai: 2,
          ...(chogioitinh && { chogioitinh }),
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_ca_nhan.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_ca_nhan.aggregate(pipeline)
            .then((all_docanhan) => resolve(all_docanhan))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_docanhan]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_docanhan.length; i++) {
              const id_user = all_docanhan[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_docanhan[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng thành công",
              all_docanhan: all_docanhan,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Dogiaitri = async (req, res, next) => {
    //type: nhaccu, sach, dothethao, thietbichoigame, other
    const { type, soluong, trangthai, pagehientai } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const filter = {
          trangthai: 2,
        };
        let pipeline = [];
        if (trangthai) {
          filter.trangthai = trangthai;
          pipeline = [
            {
              $match: filter,
            },
          ];
        } else {
          pipeline = [
            {
              $match: filter,
            },
            {
              $addFields: {
                tralendauList: {
                  $cond: {
                    if: { $eq: ["$trangthaithanhtoan", 1] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
            {
              $sort: {
                tralendauList: -1,
                createdAt: -1,
              },
            },
            {
              $skip: (pagehientai - 1) * soluong_int,
            },
            {
              $limit: soluong_int,
            },
          ];
        }
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_giai_tri.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_giai_tri.aggregate(pipeline)
            .then((all_dogiaitri) => resolve(all_dogiaitri))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_dogiaitri]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_dogiaitri.length; i++) {
              const id_user = all_dogiaitri[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_dogiaitri[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_dogiaitri: all_dogiaitri,
              totalpages: totalpages,
            });
          })
          .catch(next);
      } else {
        const filter = {
          type: type,
          trangthai: 2,
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Do_giai_tri.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Do_giai_tri.aggregate(pipeline)
            .then((all_dogiaitri) => resolve(all_dogiaitri))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_dogiaitri]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_dogiaitri.length; i++) {
              const id_user = all_dogiaitri[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_dogiaitri[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_dogiaitri: all_dogiaitri,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProduct_Thucung = async (req, res, next) => {
    //type: cho, meo, ca, other
    const { type, soluong, trangthai, pagehientai } = req.body;
    const soluong_int = parseInt(soluong, 10); // ép kiểu xài postman
    if (req.body) {
      if (type === "ALL") {
        const filter = {
          trangthai: 2,
        };
        let pipeline = [];
        if (trangthai) {
          filter.trangthai = trangthai;
          pipeline = [
            {
              $match: filter,
            },
          ];
        } else {
          pipeline = [
            {
              $match: filter,
            },
            {
              $addFields: {
                tralendauList: {
                  $cond: {
                    if: { $eq: ["$trangthaithanhtoan", 1] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
            {
              $sort: {
                tralendauList: -1,
                createdAt: -1,
              },
            },
            {
              $skip: (pagehientai - 1) * soluong_int,
            },
            {
              $limit: soluong_int,
            },
          ];
        }
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Thu_cung.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Thu_cung.aggregate(pipeline)
            .then((all_thucung) => resolve(all_thucung))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_thucung]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_thucung.length; i++) {
              const id_user = all_thucung[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_thucung[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_thucung: all_thucung,
              totalpages: totalpages,
            });
          })
          .catch(next);
      } else {
        const filter = {
          type: type,
          trangthai: 2,
        };
        const pipeline = [
          {
            $match: filter,
          },
          {
            $addFields: {
              tralendauList: {
                $cond: {
                  if: { $eq: ["$trangthaithanhtoan", 1] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
          {
            $sort: {
              tralendauList: -1,
              createdAt: -1,
            },
          },
          {
            $skip: (pagehientai - 1) * soluong_int,
          },
          {
            $limit: soluong_int,
          },
        ];
        // promise để đếm số lượng dựa trên option
        const countDocumentsPromise = new Promise((resolve, reject) => {
          Thu_cung.countDocuments(filter)
            .then((totalCount) => resolve(totalCount))
            .catch((error) => reject(error));
        });
        // promise để lấy dữ liệu dựa trên pipeline
        const getDataPromise = new Promise((resolve, reject) => {
          Thu_cung.aggregate(pipeline)
            .then((all_thucung) => resolve(all_thucung))
            .catch((error) => reject(error));
        });
        // Promise.all để thực hiện cả hai đếm và lấy data
        Promise.all([countDocumentsPromise, getDataPromise])
          .then(async ([totalCount, all_thucung]) => {
            const totalpages = Math.ceil(totalCount / soluong_int);
            // lấy data user
            for (let i = 0; i < all_thucung.length; i++) {
              const id_user = all_thucung[i].id_user;
              // Sử dụng id_user để lấy thông tin user từ model User
              try {
                const user = await User.findOne({ _id: id_user }).select(
                  "-account -password -role -img"
                );
                all_thucung[i].infor_user = user;
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            }
            res.status(200).json({
              errCode: 0,
              message: "Lấy thông tin tin đăng ALL",
              all_thucung: all_thucung,
              totalpages: totalpages,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  getProductbyId = async (req, res, next) => {
    // type: dienthoai, laptop,... or oto, xemay,...or banghe, tuke,...
    const { type, id, id_nguoidung } = req.body;
    const validTypes_dohoctap = ["giaotrinh", "sachthamkhao", "other_hoctap"];
    const validTypes_dodientu = [
      "dienthoai",
      "laptop",
      "maytinhbang",
      "desktop",
      "thietbideothongminh",
      "mayanh",
      "phukien",
      "linhkien",
    ];
    const validTypes_phuongtien = [
      "oto",
      "xemay",
      "xetai",
      "xedien",
      "xedap",
      "phutung",
    ];
    const validTypes_donoithat = [
      "banghe",
      "tuke",
      "giuong",
      "bep",
      "dungcubep",
      "quat",
      "den",
      "other_donoithat",
    ];
    const validTypes_docanhan = [
      "quanao",
      "dongho",
      "giaydep",
      "nuochoa",
      "balo",
      "other_docanhan",
    ];
    const validTypes_dogiaitri = [
      "nhaccu",
      "sach",
      "dothethao",
      "thietbichoigame",
      "other_dogiaitri",
    ];
    const validTypes_thucung = ["cho", "meo", "ca", "other_thucung"];
    const validTypes_dienlanh = ["tulanh", "maylanh", "maygiat"];

    if (req.body) {
      if (validTypes_dohoctap.includes(type)) {
        return Promise.all([Hoc_tap.find({ _id: id })])
          .then(([Hoc_tap]) => {
            if (!Hoc_tap) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Hoc_tap[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Hoc_tap),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_dodientu.includes(type)) {
        return Promise.all([Do_dien_tu.find({ _id: id })])
          .then(([Do_dien_tu]) => {
            if (!Do_dien_tu) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Do_dien_tu[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Do_dien_tu),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_phuongtien.includes(type)) {
        return Promise.all([Phuong_tien.find({ _id: id })])
          .then(([Phuong_tien]) => {
            if (!Phuong_tien) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Phuong_tien[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Phuong_tien),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_donoithat.includes(type)) {
        return Promise.all([Do_noi_that.find({ _id: id })])
          .then(([Do_noi_that]) => {
            if (!Do_noi_that) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Do_noi_that[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Do_noi_that),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_dienlanh.includes(type)) {
        return Promise.all([Dien_lanh.find({ _id: id })])
          .then(([Dien_lanh]) => {
            if (!Dien_lanh) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Dien_lanh[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Dien_lanh),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_docanhan.includes(type)) {
        return Promise.all([Do_ca_nhan.find({ _id: id })])
          .then(([Do_ca_nhan]) => {
            if (!Do_ca_nhan) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Do_ca_nhan[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Do_ca_nhan),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_dogiaitri.includes(type)) {
        return Promise.all([Do_giai_tri.find({ _id: id })])
          .then(([Do_giai_tri]) => {
            if (!Do_giai_tri) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Do_giai_tri[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Do_giai_tri),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
      if (validTypes_thucung.includes(type)) {
        return Promise.all([Thu_cung.find({ _id: id })])
          .then(([Thu_cung]) => {
            if (!Thu_cung) {
              return res
                .status(404)
                .json({ errCode: 1, message: "Tin đăng không tồn tại." });
            }
            const id_nguoidung = Thu_cung[0].id_user;
            return User.find({ _id: id_nguoidung })
              .select("-account -password") // ẩn các trường không cần thiết
              .then((User) => {
                if (!User) {
                  return res
                    .status(404)
                    .json({ error: "Không tìm thấy thông tin người dùng." });
                }
                res.json({
                  dataItem: mutiMongooseObject(Thu_cung),
                  userInfo: mutiMongooseObject(User),
                });
              })
              .catch(next);
          })
          .catch(next);
      }
    }
  };
  // lấy tin đăng của 1 người dùng
  getTindangbyIdUser = async (req, res, next) => {
    try {
      const { id } = req.body;
      const infor_user = await Promise.all([
        User.findOne({ _id: id }).select("-account -password"),
      ]);
      const tindang = await Promise.all([
        Hoc_tap.find({ id_user: id }),
        Phuong_tien.find({ id_user: id }),
        Do_dien_tu.find({ id_user: id }),
        Do_noi_that.find({ id_user: id }),
        Dien_lanh.find({ id_user: id }),
        Do_ca_nhan.find({ id_user: id }),
        Do_giai_tri.find({ id_user: id }),
        Thu_cung.find({ id_user: id }),
      ]);
      const info = [].concat(...infor_user);
      const merged_tindang = info.concat(...tindang);
      res.status(200).json({ tindang: mutiMongooseObject(merged_tindang) });
    } catch (error) {
      res.status(200).json({
        errCode: 1,
        message: "Lấy tin đăng của 1 người dùng bị lỗi.",
      });
    }
  };
  // Cập nhật trạng thái duyệt tin trangthai:
  // (1: doiduyet, 2: daduyet, 3: antin(kem lido) )
  updateTrangthaiDuyettin = async (req, res, next) => {
    const { id, typecollection, lydoantin } = req.body;
    if (id && typecollection) {
      if (!lydoantin) {
        if (typecollection === "hoctap") {
          let tindang = await Hoc_tap.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Hoc_tap.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dodientu") {
          let tindang = await Do_dien_tu.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Do_dien_tu.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "phuongtien") {
          let tindang = await Phuong_tien.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Phuong_tien.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "donoithat") {
          let tindang = await Do_noi_that.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Do_noi_that.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dienlanh") {
          let tindang = await Dien_lanh.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Dien_lanh.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dodungcanhan") {
          let tindang = await Do_ca_nhan.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Do_ca_nhan.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dogiaitri") {
          let tindang = await Do_giai_tri.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Do_giai_tri.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "thucung") {
          let tindang = await Thu_cung.findOne({ _id: id });
          tindang.trangthai = tindang.trangthai += 1;
          if (tindang) {
            Thu_cung.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
      } else {
        if (typecollection === "hoctap") {
          let tindang = await Hoc_tap.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Hoc_tap.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dodientu") {
          let tindang = await Do_dien_tu.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_dien_tu.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Tin không được duyệt, đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "phuongtien") {
          let tindang = await Phuong_tien.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Phuong_tien.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "donoithat") {
          let tindang = await Do_noi_that.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_noi_that.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dienlanh") {
          let tindang = await Dien_lanh.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Dien_lanh.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dodungcanhan") {
          let tindang = await Do_ca_nhan.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_ca_nhan.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "dogiaitri") {
          let tindang = await Do_giai_tri.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_giai_tri.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (typecollection === "thucung") {
          let tindang = await Thu_cung.findOne({ _id: id });
          tindang.trangthai = 3;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Thu_cung.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Update trạng thái tin đăng thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thiếu thông tin input update trangthai",
      });
    }
  };
  updateTrangthai_Antin_byuser = async (req, res, next) => {
    const { id, typeTindang, lydoantin } = req.body;
    const validTypes_dohoctap = ["giaotrinh", "sachthamkhao", "other_hoctap"];
    const validTypes_dodientu = [
      "dienthoai",
      "laptop",
      "maytinhbang",
      "desktop",
      "thietbideothongminh",
      "mayanh",
      "phukien",
      "linhkien",
    ];
    const validTypes_phuongtien = [
      "oto",
      "xemay",
      "xetai",
      "xedien",
      "xedap",
      "phutung",
    ];
    const validTypes_donoithat = [
      "banghe",
      "tuke",
      "giuong",
      "bep",
      "dungcubep",
      "quat",
      "den",
      "other_donoithat",
    ];
    const validTypes_docanhan = [
      "quanao",
      "dongho",
      "giaydep",
      "nuochoa",
      "balo",
      "other_docanhan",
    ];
    const validTypes_dogiaitri = [
      "nhaccu",
      "sach",
      "dothethao",
      "thietbichoigame",
      "other_dogiaitri",
    ];
    const validTypes_thucung = ["cho", "meo", "ca", "other_thucung"];
    const validTypes_dienlanh = ["tulanh", "maylanh", "maygiat"];
    if (id && typeTindang) {
      if (lydoantin) {
        if (validTypes_dohoctap.includes(typeTindang)) {
          let tindang = await Hoc_tap.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Hoc_tap.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dodientu.includes(typeTindang)) {
          let tindang = await Do_dien_tu.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_dien_tu.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_phuongtien.includes(typeTindang)) {
          let tindang = await Phuong_tien.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Phuong_tien.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_donoithat.includes(typeTindang)) {
          let tindang = await Do_noi_that.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_noi_that.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dienlanh.includes(typeTindang)) {
          let tindang = await Dien_lanh.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Dien_lanh.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_docanhan.includes(typeTindang)) {
          let tindang = await Do_ca_nhan.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_ca_nhan.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dogiaitri.includes(typeTindang)) {
          let tindang = await Do_giai_tri.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Do_giai_tri.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_thucung.includes(typeTindang)) {
          let tindang = await Thu_cung.findOne({ _id: id });
          tindang.trangthai = 4;
          tindang.lydoantin = lydoantin;
          if (tindang) {
            Thu_cung.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
      } else {
        if (validTypes_dohoctap.includes(typeTindang)) {
          let tindang = await Hoc_tap.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Hoc_tap.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dodientu.includes(typeTindang)) {
          let tindang = await Do_dien_tu.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Do_dien_tu.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_phuongtien.includes(typeTindang)) {
          let tindang = await Phuong_tien.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Phuong_tien.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_donoithat.includes(typeTindang)) {
          let tindang = await Do_noi_that.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Do_noi_that.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dienlanh.includes(typeTindang)) {
          let tindang = await Dien_lanh.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Dien_lanh.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_docanhan.includes(typeTindang)) {
          let tindang = await Do_ca_nhan.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Do_ca_nhan.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_dogiaitri.includes(typeTindang)) {
          let tindang = await Do_giai_tri.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Do_giai_tri.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
        if (validTypes_thucung.includes(typeTindang)) {
          let tindang = await Thu_cung.findOne({ _id: id });
          tindang.trangthai = 2;
          tindang.lydoantin = "";
          if (tindang) {
            Thu_cung.updateOne({ _id: id }, tindang)
              .then(() => {
                return res.json({
                  errCode: 0,
                  message: "Đã ẩn tin thành công",
                  trangthai: tindang.trangthai,
                });
              })
              .catch(next);
          }
        }
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thiếu thông tin input update trangthai",
      });
    }
  };
  updateTrangthai_thanhtoan = async (req, res, next) => {
    const { id, typeTindang } = req.body;
    const validTypes_dohoctap = ["giaotrinh", "sachthamkhao", "other_hoctap"];
    const validTypes_dodientu = [
      "dienthoai",
      "laptop",
      "maytinhbang",
      "desktop",
      "thietbideothongminh",
      "mayanh",
      "phukien",
      "linhkien",
    ];
    const validTypes_phuongtien = [
      "oto",
      "xemay",
      "xetai",
      "xedien",
      "xedap",
      "phutung",
    ];
    const validTypes_donoithat = [
      "banghe",
      "tuke",
      "giuong",
      "bep",
      "dungcubep",
      "quat",
      "den",
      "other_donoithat",
    ];
    const validTypes_docanhan = [
      "quanao",
      "dongho",
      "giaydep",
      "nuochoa",
      "balo",
      "other_docanhan",
    ];
    const validTypes_dogiaitri = [
      "nhaccu",
      "sach",
      "dothethao",
      "thietbichoigame",
      "other_dogiaitri",
    ];
    const validTypes_thucung = ["cho", "meo", "ca", "other_thucung"];
    const validTypes_dienlanh = ["tulanh", "maylanh", "maygiat"];
    if (id && typeTindang) {
      if (validTypes_dohoctap.includes(typeTindang)) {
        let tindang = await Hoc_tap.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Hoc_tap.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_dodientu.includes(typeTindang)) {
        let tindang = await Do_dien_tu.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Do_dien_tu.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_phuongtien.includes(typeTindang)) {
        let tindang = await Phuong_tien.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Phuong_tien.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_donoithat.includes(typeTindang)) {
        let tindang = await Do_noi_that.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Do_noi_that.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_dienlanh.includes(typeTindang)) {
        let tindang = await Dien_lanh.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Dien_lanh.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_docanhan.includes(typeTindang)) {
        let tindang = await Do_ca_nhan.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Do_ca_nhan.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_dogiaitri.includes(typeTindang)) {
        let tindang = await Do_giai_tri.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Do_giai_tri.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
      if (validTypes_thucung.includes(typeTindang)) {
        let tindang = await Thu_cung.findOne({ _id: id });
        tindang.trangthaithanhtoan = 1;
        if (tindang) {
          Thu_cung.updateOne({ _id: id }, tindang)
            .then(() => {
              return res.json({
                errCode: 0,
                message: "Đã cập nhật trangthaithanhtoan thành công",
                trangthaithanhtoan: tindang.trangthaithanhtoan,
              });
            })
            .catch(next);
        }
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thiếu thông tin input update trangthaithanhtoan",
      });
    }
  };
  // Xóa bài đăng
  async deleteBaidang(req, res, next) {
    //id: id baidang, type: xemay, dienthoai,...
    const { id, type } = req.params;
    const validTypes_dohoctap = ["giaotrinh", "sachthamkhao", "other_hoctap"];
    const validTypes_dodientu = [
      "dienthoai",
      "laptop",
      "maytinhbang",
      "desktop",
      "thietbideothongminh",
      "mayanh",
      "phukien",
      "linhkien",
    ];
    const validTypes_phuongtien = [
      "oto",
      "xemay",
      "xetai",
      "xedien",
      "xedap",
      "phutung",
    ];
    const validTypes_donoithat = [
      "banghe",
      "tuke",
      "giuong",
      "bep",
      "dungcubep",
      "quat",
      "den",
      "other_donoithat",
    ];
    const validTypes_docanhan = [
      "quanao",
      "dongho",
      "giaydep",
      "nuochoa",
      "balo",
      "other_docanhan",
    ];
    const validTypes_dogiaitri = [
      "nhaccu",
      "sach",
      "dothethao",
      "thietbichoigame",
      "other_dogiaitri",
    ];
    const validTypes_thucung = ["cho", "meo", "ca", "other_thucung"];
    const validTypes_dienlanh = ["tulanh", "maylanh", "maygiat"];

    if (id && type) {
      if (validTypes_dohoctap.includes(type)) {
        Hoc_tap.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_dodientu.includes(type)) {
        Do_dien_tu.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_phuongtien.includes(type)) {
        Phuong_tien.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_donoithat.includes(type)) {
        Do_noi_that.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_dienlanh.includes(type)) {
        Dien_lanh.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_docanhan.includes(type)) {
        Do_ca_nhan.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_dogiaitri.includes(type)) {
        Do_giai_tri.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
      if (validTypes_thucung.includes(type)) {
        Thu_cung.deleteOne({ _id: id, type: type })
          .then(() => {
            return res.status(200).json({
              errCode: 0,
              message: `Xóa bài đăng ${type} thành công`,
            });
          })
          .catch(next);
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: `Thiếu thông tin truyền vào`,
      });
    }
  }
  SearchHeader = async (req, res, next) => {
    const { keyword } = req.body;
    if (keyword) {
      try {
        const result = await Do_dien_tu.find({
          $or: [
            { hang: { $regex: keyword, $options: "i" } },
            { dongmay: { $regex: keyword, $options: "i" } },
          ],
        }).select(
          "-trangthaithanhtoan -trangthai -deleted -tinhtrang -type -hang -ram -dungluong -mausac -mota"
        );

        res.status(200).json({
          errCode: 0,
          message: "Search thành công",
          resultSearch: result,
        });
      } catch (error) {
        console.error(error);
        res.status(200).json({
          errCode: 1,
          message: "Lỗi khi tìm kiếm",
        });
      }
    } else {
      res.status(200).json({
        errCode: 1,
        message: "Không có keyword",
      });
    }
  };
  //----------------------------------------------------------------------------
  // Tạo loại tin đăng
  async createTypeProduct(req, res, next) {
    if (req.body) {
      const typename = await typeProduct.findOne({ name: req.body.name });
      if (typename) {
        return res.status(200).json({
          errCode: 2,
          message: "Loại tin đăng này đã tồn tại",
        });
      } else {
        // Lưu user
        req.body = new typeProduct(req.body);
        req.body
          .save()
          .then(async () => {
            res.json({
              errCode: 0,
              message: "Thêm loại thành công.",
            });
          })
          .catch(next);
      }
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thông tin rỗng, vui lòng nhập lại",
      });
    }
  }
  // Lấy loại tin đăng
  getTypeProduct = async (req, res, next) => {
    if (req.body) {
      Promise.all([typeProduct.find({ type: req.body.type })])
        .then(([typeProduct]) => {
          res.json({
            typeProduct: mutiMongooseObject(typeProduct),
          });
        })
        .catch(next);
    } else {
      return res.status(500).json({
        errCode: 1,
        mess: "Lấy thông tin bị lỗi.",
      });
    }
  };
  // cập nhật tin đăng collection Product
  updateProduct = async (req, res, next) => {
    if (req.params) {
      const code = req.body.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
      req.body.code = code;
      Product.updateOne({ _id: req.params.id }, req.body)
        .then(() => {
          return res.json({
            errCode: 0,
            message: `Cập nhật tin đăng ${req.params.type} thành công`,
          });
        })
        .catch(next);
    } else {
      return res.status(200).json({
        errCode: 1,
        message: `Thiếu tham số truyền vào`,
      });
    }
  };

  createOrder = async (req, res, next) => {
    if (req.body) {
      // Lưu Order
      req.body = new Order(req.body);
      const cartItems = req.body.cartItems;
      const promises = cartItems.map(async (item) => {
        try {
          // Tìm tin đăng trong collection dựa trên id và type
          const product = await Product.findOne({
            _id: item.id,
            type: item.type,
          });
          if (product) {
            // Trừ đi giá trị amount của tin đăng
            product.amount -= item.is_sold;
            //Cập nhật số lượng đã bán ra
            product.is_sold += item.is_sold;
            // Lưu lại tin đăng đã được cập nhật
            await product.save();
          }
        } catch (error) {
          console.error(error);
        }
      });

      Promise.all(promises)
        .then(async () => {
          req.body
            .save()
            .then(() => {
              res.json({
                errCode: 0,
                message: "Order thành công",
              });
            })
            .catch(next);
        })
        .catch(next);
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thông tin rỗng, vui lòng nhập lại",
      });
    }
  };
  // Lấy tất cả Order
  getAllOrder(req, res, next) {
    Order.find()
      .then((order) => {
        res.json({
          order: mutiMongooseObject(order),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Hủy đặt đơn hàng
  cancelOrder = async (req, res, next) => {
    const { id } = req.params;
    if (id) {
      let order = await Order.findOne({ _id: id });
      order.status = 4;
      if (order) {
        Order.updateOne({ _id: id }, order)
          .then(() => {
            return res.json({
              errCode: 0,
              message: "Huỷ thành công",
            });
          })
          .catch(next);
      } else {
        return res.json({ errCode: 1, message: "Không tìm thấy đơn hàng" });
      }
    }
  };
  // Xóa đơn hàng
  deleteOrder(req, res, next) {
    Order.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          errCode: 0,
          message: "Xóa đơn hàng thành công.",
        });
      })
      .catch(next);
  }
  //Tạo lịch sử order
  createHistoryOrder = async (req, res, next) => {
    if (req.body) {
      Order.deleteOne({ _id: req.body._id }).catch(next);
      // Lưu History
      req.body = new History(req.body);
      req.body
        .save()
        .then(async () => {
          res.status(200).json({
            errCode: 0,
            message: "Tạo lịch sử order thành công",
          });
        })
        .catch(next);
    } else {
      return res.status(200).json({
        errCode: 1,
        message: "Thông tin rỗng, vui lòng nhập lại",
      });
    }
  };
  // Lấy tất cả lịch sử Order
  getAllHistoryOrder(req, res, next) {
    History.find()
      .then((history_order) => {
        res.json({
          errCode: 0,
          message: "Lấy tất cả lịch sử order thành công",
          history_order: mutiMongooseObject(history_order),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //Xóa lịch sử order theo _id
  deleteHistoryOrder_Admin(req, res, next) {
    History.deleteOne({ _id: req.params.id })
      .then(() => {
        res.json({
          errCode: 0,
          message: "Xóa Lịch sử đơn hàng thành công.",
        });
      })
      .catch(next);
  }
  //lọc lịch sử order theo Tháng
  getHistoryOrderbyMonth = async (req, res, next) => {
    if (req.body) {
      const queryDate = req.body.time_order;
      try {
        const history = await History.find({
          time_order: {
            $regex: queryDate, // Tìm các kết quả có "MM/YYYY" trong "time_order"
          },
        });
        res.status(200).json({
          errCode: 0,
          message: "Lấy lịch sử đơn hàng theo THÁNG thành công",
          History: mutiMongooseObject(history),
        });
      } catch (error) {
        next(error);
      }
    } else {
      return res.status(500).json({
        errCode: 1,
        message: "Lọc lịch sử đơn hàng bị lỗi.",
      });
    }
  };
}
module.exports = new AdminController();
