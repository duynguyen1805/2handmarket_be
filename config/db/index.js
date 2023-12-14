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
    await mongoose.connect(
      `mongodb+srv://duynguyenqwert:${process.env.PASSWORD_MONGODB}@2handmarket.7kquoar.mongodb.net/2hand_market`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("Thành công!!!");
  } catch (error) {
    console.log("Thử lại!!!");
    console.log(error);
  }
}

module.exports = {
  connect,
};
