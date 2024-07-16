const exphbs = require("express-handlebars");
const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const helpers = require('./utils/helpers.js');
const app = express();
const hbs = exphbs.create({helpers});
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
  req.session.loggedIn = req.session.loggedIn ?? false;
  req.session.isRecruiter = req.session.isRecruiter ?? false;
  req.session.isUser = req.session.isUser ?? false;

  next();
});

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