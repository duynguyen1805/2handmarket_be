const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Do_giai_tri = new Schema(
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
      //nhaccu, sach, dothethao, thietbichoigame, other
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    tinhtrang: {
      type: Number,
      require: false,
    },
    //nhaccu
    loainhaccu: {
      type: String,
      require: false,
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
    trangthai: {
      type: Number,
      default: 1,
    },
    lydoantin: {
      type: String,
      require: false,
    },
    ngayduyettin: {
      type: Date,
      require: false,
    },
    // expireAt: { type: Date, default: Date.now, index: { expires: "30d" } },
    expires_tindang: {
      type: Date,
      require: false,
    },
    expires_tinbituchoi_tinan: {
      type: Date,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

var mongoose_delete = require("mongoose-delete");
Do_giai_tri.plugin(mongoose_delete);
Do_giai_tri.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Do_giai_tri", Do_giai_tri, "Do_giai_tri");
