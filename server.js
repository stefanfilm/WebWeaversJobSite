const exphbs = require("express-handlebars");
const express = require("express");
const path = require("path");
const SequelizeStore = require("connect-session-sequelize");
const session = require("express-session");

const app = express();
const hbs = exphbs.create({});
const routes = require("./routes");
const sequelize = require("./config/connection.js")

const sess = {
  secret: process.env.SECRET_KEY,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use((req, res, next) => {
  if (req.session.loggedIn === undefined)
    req.session.loggedIn = false;
  next();
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

const PORT = process.env.PORT || 3001;
sequelize.sync({
  force: false
}).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})