const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Dien_lanh = new Schema(
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
      //tulanh, maylanh, maygiat
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
    hang: {
      // toshiba, samsung,...
      type: String,
      require: false,
    },
    // tulanh
    thetich: {
      type: String,
      require: false,
    },
    // maylanh
    congsuat: {
      type: String,
      require: false,
    },
    // maygiat
    khoiluonggiat: {
      type: String,
      require: false,
    },
    cuagiat: {
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
  },
  {
    timestamps: true,
  }
);

var mongoose_delete = require("mongoose-delete");
Dien_lanh.plugin(mongoose_delete);
Dien_lanh.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Dien_lanh", Dien_lanh, "Dien_lanh");
