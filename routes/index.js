var express = require('express');
var router = express.Router();
const User = require("../Models/userModel.js");
const Post = require('../Models/postModel.js');
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));

const upload = require('./multer.js');


router.get('/', function (req, res) {
  res.render('index', { footer: false });
});

router.get('/login', function (req, res) {
  res.render('login', { footer: false });
});

router.get('/feed', isLoggedIn, async function (req, res) {
  try {
    const user = await User.findOne({ username: req.session.passport.user });
    const posts = await Post.find().populate('user');
    // console.log(posts);
    res.render('feed', { posts: posts, footer: true, user: user });
  } catch (error) {
    res.send(error);
  }
});

router.get('/profile', isLoggedIn, async function (req, res) {
  try {
    const user = await User.findOne({ username: req.session.passport.user }).populate("posts");
    res.render('profile', { footer: true, user: user });
  } catch (error) {
    res.send(error);
  }
});

router.get('/search', function (req, res) {
  res.render('search', { footer: true });
});

router.get('/edit', isLoggedIn, async function (req, res) {
  try {
    const user = await User.findOne({ username: req.session.passport.user });
    res.render('edit', { footer: true, user: user });
  } catch (error) {
    res.send(error);
  }
});

router.get('/upload', function (req, res) {
  res.render('upload', { footer: true });
});

// ----------------Axios Username sreach route------------------------------
router.get('/username/:username', isLoggedIn, async (req, res) => {
  try {
    const regex = new RegExp(`^${req.params.username}`, 'i');
    const users = await User.find({ username: regex })
    res.json(users);
  } catch (error) {
    res.send(error);
  }
})
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
    res.redirect("/login  ");
  });
});

// --------------------Multer------------------------------
router.post("/update", isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.session.passport.user },
      { username: req.body.username, name: req.body.name, bio: req.body.bio },
      { new: true }
    );
    if (req.file) {
      user.profileImage = req.file.filename;
    }
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    res.send(error);
  }
})

router.post('/upload', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.passport.user });
    const post = await Post.create({
      picture: req.file.filename,
      user: user._id,
      caption: req.body.caption,
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect('/feed');
  } catch (error) {
    res.send(error);
  }
})

// ----------------------Like and Unlike section------------------------
router.get('/post/like/:id', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.passport.user });
    const post = await Post.findOne({ _id: req.params.id });
    if (post.likes.indexOf(user._id) === -1) {
      post.likes.push(user._id);
    }
    else {
      post.likes.splice(post.likes.indexOf(user._id), 1);
    }
    await post.save();
    res.redirect('/feed');
  } catch (error) {
    res.send(error);
  }
})

module.exports = router;
