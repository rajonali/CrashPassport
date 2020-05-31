const mongoose = require("mongoose");

const express = require("express");

const expressLayouts = require("express-ejs-layouts");

const flash = require("connect-flash");
const session = require("express-session");

const app = express();

const passport = require("passport");

require("./config/passport")(passport);

//DB CONFIG

const db = require("./config/keys").MongoURI;

//Connect to mongo

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongo db connected"))
  .catch((err) => console.log(err));

//EJS

app.use(expressLayouts);
app.set("view engine", "ejs");

//Body parser

app.use(express.urlencoded({ extended: false }));

//Express session

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global vars

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//ROUTES
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
