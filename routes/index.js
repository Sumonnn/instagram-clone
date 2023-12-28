var express = require('express');
var router = express.Router();
const User = require("../Models/userModel.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));


router.get('/', function (req, res) {
  res.render('index', { footer: false });
});

router.get('/login', function (req, res) {
  res.render('login', { footer: false });
});

router.get('/feed', function (req, res) {
  res.render('feed', { footer: true });
});

router.get('/profile',isLoggedIn, function (req, res) {
  res.render('profile', { footer: true });
});

router.get('/search', function (req, res) {
  res.render('search', { footer: true });
});

router.get('/edit', function (req, res) {
  res.render('edit', { footer: true });
});

router.get('/upload', function (req, res) {
  res.render('upload', { footer: true });
});

// -------------------Authentication Code-----------------------------
router.post('/register', async (req, res) => {
  try {
    await User.register(
      {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
      },
      req.body.password
    );
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
})

// SIGNIN CODE
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) { }
);

// AUTHENTICATED ROUTE MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// SIGNOUT CODE
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/signin");
  });
});



module.exports = router;
