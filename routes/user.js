const express = require("express");
const userRouter = express.Router();
const auth = require('./middlewares/auth');
const userController = require("./controllers/user");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/user/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
        cb(null, profile);
    }
));

userRouter.post("/", auth, userController.addUser);
userRouter.put("/:id", auth, userController.updateUser);
userRouter.put("/donotdisturb/:id", auth, userController.doNotDisturb);
userRouter.delete("/:id", auth, userController.deleteUser);
userRouter.get("/", auth, userController.getUsers);
userRouter.get("/:id", auth, userController.getUserById);
userRouter.get("/search/:q", auth, userController.searchUser);
userRouter.post("/login", userController.userLogin);
userRouter.post("/password/set", userController.setPassword);
userRouter.post("/password/forget", userController.forgetPassword);
userRouter.get("/list/all", auth, userController.list);

//userRouter.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    res.send({ data: 'Google OAuth API response' });
  });

  userRouter.get('/auth/google/callback', passport.authenticate('google', { session: false,failureRedirect: '/login' }), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    res.redirect('/');
  });

// userRouter.get("/auth/google/callback", passport.authenticate('google', { session: false }),
//     function (req, res) {
//         sendResponse(res, "Sign in using google successfully.", 200);
//     });

module.exports = userRouter;