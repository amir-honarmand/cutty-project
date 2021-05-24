const mongoose = require("mongoose");

const { get500 } = require("../controller/errorController");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });

    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    get500(req, res);
    process.exit(1);
  }
};
