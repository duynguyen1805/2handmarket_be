const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Do_noi_that = new Schema(
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
      //banghe, tuke, giuong, bep, dungcubep, quat, den
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
    // 0: chuathanhtoan, 1: dathanhtoan (daytin)
    trangthaithanhtoan: {
      type: Number,
      require: true,
      default: 0,
    },

    //chitiet
    loaichitiet: {
      // ghevanphong, tuquanao, guongdon, bep,.....
      type: String,
      require: false,
    },
    mota: {
      type: String,
      require: true,
    },
    img: [],

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
Do_noi_that.plugin(mongoose_delete);
Do_noi_that.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Do_noi_that", Do_noi_that, "Do_noi_that");
