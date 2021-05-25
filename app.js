const express = require("express");
// const dotEnv = require("dotenv");
const flash = require("connect-flash");
const passport = require("passport");

const path = require("path");

// env config
// dotEnv.config({ path: "./config/config.env" });

const { connectDB } = require("./config/dbConnection");
const session = require("./utils/session");
const { getRedirect } = require("./controller/cutUrlController");

const app = express();

//database connection
connectDB();

// passport config
require('./config/passport');

// set engine
app.set("view engine", "ejs");
app.set("views", "views")

// set statics
app.use(express.static(path.join(__dirname, "public")));

// bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// session
app.use(session);

// passport init
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash()); //in req.flash | key-value pair

// routes
app.use("/", require("./routes/index"));
app.use("/cut-url", require("./routes/cutUrl"));
app.use("/profile", require('./routes/profile'));

// redirect
app.use("/", getRedirect);

const port = process.env.PORT || 7039;
app.listen(port, () => console.log(`server running on port ${port}...`));
