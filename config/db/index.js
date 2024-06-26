const mongoose = require("mongoose");

// async function connect() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/2hand_market", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });
//     console.log("Thành công!!!");
//   } catch (error) {
//     console.log("Thử lại!!!");
//     console.log(error);
//   }
// }
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Thành công!!!");
  } catch (error) {
    console.log("Thử lại!!!");
    console.log(error);
  }
}

module.exports = {
  connect,
};
