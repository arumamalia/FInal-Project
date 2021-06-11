const passport = require("passport"); // Import passport
const localStrategy = require("passport-local").Strategy; // Import Strategy
const { user } = require("../../models");

const bcrypt = require("bcrypt"); // Import bcrypt
const JWTstrategy = require("passport-jwt").Strategy; // Import JWT Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt; // Import ExtractJWT
const validator = require("validator");

exports.signup = (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }
    req.user = user;

    // Next to authController.getToken
    next();
  })(req, res, next);
};

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email", // field for username from req.body.email
      passwordField: "password", // field for password from req.body.password
      passReqToCallback: true, // read other requests
    },
    async (req, email, password, done) => {
      try {
        //set default role to userreq.body.role = "photographer";
        req.body.role = "photographer";
        let userSignUp = await user.create(req.body);
        // If success
        return done(null, userSignUp, {
          message: "User can be created",
        });
      } catch (e) {
        console.log(e);
        // If error, it will return not authorization
        // if (e.code == 11000 && e.keyPattern.email == 1) {
        //   return done(null, false, {
        //     message: "Please use another email",
        //   });
        return done(null, false, {
          message: "User can't be created",
        });
      }
    }
  )
);

exports.signin = (req, res, next) => {
  passport.authenticate("signin", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }

    // If user is false
    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

passport.use(
  "signin",
  new localStrategy(
    {
      usernameField: "email", // field for username from req.body.email
      passwordField: "password", // field for password from req.body.password
      passReqToCallback: true, // read other requests
    },
    async (req, email, password, done) => {
      try {
        const userSignin = await user.findOne({
          where: {
            email,
          },
        });

        if (!userSignin) {
          return done(null, false, {
            message: "User is not found!",
          });
        }

        const validate = await bcrypt.compare(password, userSignin.password);
        console.log(userSignin.password);
        console.log(password);
        // console.log(validate);
        if (!validate) {
          return done(null, false, {
            message: "Wrong password!",
          });
        }
        return done(null, userSignin, {
          message: "User can sign in",
        });
      } catch (e) {
        console.log(e);
        // If error, it will return not authorization
        return done(null, false, {
          message: "User can't sign in",
        });
      }
    }
  )
);

exports.photographer = (req, res, next) => {
  passport.authorize("photographer", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(403).json({
        message: info.message,
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

passport.use(
  "photographer",
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const userSignin = await user.findOne({
          where: {
            id: token.user.id,
          },
        });

        if (userSignin.role.includes("photographer")) {
          return done(null, token.user);
        }

        return done(null, false, { message: "you are not Authorized" });
      } catch (e) {
        return done(null, false, {
          message: "You're not authorized",
        });
      }
    }
  )
);
