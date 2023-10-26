const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Phuong_tien = new Schema(
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
      //oto, xemay, xetai, xedien, xedap, phutung
      type: String,
      require: true,
    },
    new_pur_price: {
      type: Number,
      require: false,
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

    // oto, xemay, xetai
    hang: {
      // toyota, honda, fold,...
      type: String,
      require: false,
    },
    tinhtrang: {
      type: Number,
      require: false,
    },
    // dongxe oto, xemay
    dongxe: {
      type: String,
      require: false,
    },
    sokm: {
      type: Number,
      require: false,
    },
    loaixemay: {
      //xeso, xetayga, xetaycon
      type: String,
      require: false,
    },
    loaixedien: {
      //xemaydien, xedapdien
      type: String,
      require: false,
    },
    dongcoxedien: {
      type: String,
      require: false,
    },
    loaixedap: {
      //["xedapphothong","xedapthethao","xedaptreem"]
      type: String,
      require: false,
    },
    dungtich: {
      type: String,
      require: false,
    },
    hopso: {
      type: Number,
      require: false,
    },
    nhienlieu: {
      type: Number,
      require: false,
    },
    namsanxuat: {
      type: Number,
      require: false,
    },
    sochongoi: {
      type: Number,
      require: false,
    },
    mausac: {
      type: String,
      require: false,
    },
    bienso: {
      type: String,
      require: false,
    },

    //xetai
    taitrong: {
      type: String,
      require: false,
    },

    //phutung (phutungxemay, phutungoto)
    loaiphutung: {
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
Phuong_tien.plugin(mongoose_delete);
Phuong_tien.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Phuong_tien", Phuong_tien, "Phuong_tien");
