var express = require('express');
var router = express.Router();

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
      clientID: "1165115853505832",
      clientSecret: "8095d8bb0bad2996b6510d799dfb0e85",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      db.user.find({where : {
        email: profile.email
      }}).then(function (result) {
        if(result) {
          return done(null,result)
        }
        var newUser = {
          username: profile.id,
          name: profile.displayName,
          email: "trquoccuong@gmail.com",
          profileImage: 'noimage.png'
        }
        db.user.create(newUser).then(function (user) {
          done(null,user);
        })
      }).catch(function (err) {
          done(err);
      })
    }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
      failureRedirect: 'users/login' }));
/* GET home page. */
router.get('/', checkAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Member' });
});


function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/login');
  }
}

module.exports = router;
