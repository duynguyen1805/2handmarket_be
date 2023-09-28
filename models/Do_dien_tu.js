const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Do_dien_tu = new Schema(
  {
    id_user: {
      type: String,
      require: true,
    },
    tieude: {
      type: String,
      require: true,
    },
    type: {
      //đt, mtb, laptop, desktop,...
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    mota: {
      type: String,
      require: true,
    },
    img: [],
    // 0: chuathanhtoan, 1: dathanhtoan (daytin)
    trangthaithanhtoan: {
      type: Number,
      require: true,
      default: 0,
    },

    // DIEN THOAI
    hang: {
      // apple, ss,...
      type: String,
      require: false,
    },
    tinhtrang: {
      type: Number,
      require: false,
    },
    dongmay: {
      type: String,
      require: false,
    },
    ram: {
      type: String,
      require: false,
    },
    dungluong: {
      type: String,
      require: false,
    },
    mausac: {
      type: String,
      require: false,
    },
    sim: {
      type: Number,
      require: false,
    },
    // dongmay của dienthoai,maytinhbang,laptop
    dongmay: {
      type: String,
      require: false,
    },

    // LAPTOP / DESKTOP
    cpu: {
      type: String,
      require: false,
    },
    ocung: {
      type: String,
      require: false,
    },
    loaiocung: {
      type: String,
      require: false,
    },
    screensize: {
      type: String,
      require: false,
    },
    displaycard: {
      type: String,
      require: false,
    },

    //MAYANH (mayanh, mayquay, phukien)
    loaimayanh: {
      type: String,
      require: false,
    },

    //THIETBIDEOTHONGMINH (dongho, vongtay)
    loaithietbideo: {
      type: String,
      require: false,
    },

    // PHUKIEN (manhinh, chuot, banphim, tainghe, capsac)
    loaiphukien: {
      type: String,
      require: false,
    },

    // LINHKIEN (linhkienmaytinh, linhkiendienthoai, linhkienkhac)
    loailinhkien: {
      type: String,
      require: false,
    },
    trangthai: {
      type: Number,
      default: 1,
    },
    lydoantin: {
      type: String,
      require: false,
    },

    // expireAt: { type: Date, default: Date.now, index: { expires: "60s" } },
  },
  {
    timestamps: true,
  }
);

var mongoose_delete = require("mongoose-delete");
Do_dien_tu.plugin(mongoose_delete);
Do_dien_tu.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Do_dien_tu", Do_dien_tu, "Do_dien_tu");
