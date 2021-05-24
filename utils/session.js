const session = require("express-session");
const MongoStore = require('connect-mongo');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: "destroy",
  // cookie: { maxAge: 86400000 },
  store: MongoStore.create({mongoUrl: process.env.MONGOOSE_URI})
});