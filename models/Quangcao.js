const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Quang_cao = new Schema(
  {
    id_tindang: {
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
    id_user: {
      type: String,
      require: true,
    },
    name_user: {
      type: String,
      require: true,
    },
    thoigian: [
      {
        ngaybatdau: String,
        ngayketthuc: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

var mongoose_delete = require("mongoose-delete");
Quang_cao.plugin(mongoose_delete);
Quang_cao.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Quang_cao", Quang_cao, "Quang_cao");
