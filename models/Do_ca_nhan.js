const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Do_ca_nhan = new Schema(
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
      // quanao, dongho, giaydep, nuochoa, balo, other
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
    chogioitinh: {
      // 0:nu, 1:nam, 2:cahai
      type: Number,
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

    // expireAt: { type: Date, default: Date.now, index: { expires: "60s" } },
  },
  {
    timestamps: true,
  }
);

var mongoose_delete = require("mongoose-delete");
Do_ca_nhan.plugin(mongoose_delete);
Do_ca_nhan.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Do_ca_nhan", Do_ca_nhan, "Do_ca_nhan");
