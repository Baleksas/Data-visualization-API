const session = require("express-session");

export default function setupAuth(app: any) {
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.CLIENT_SECRET,
    })
  );
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.CLIENT_SECRET,
    })
  );

  const passport = require("passport");
  var userProfile: any;

  app.use(passport.initialize());
  app.use(passport.session());

  app.set("view engine", "ejs");

  app.get("/success", (req: any, res: any) => {
    res.render("pages/success", { user: userProfile });
  });
  app.get("/error", (req: any, res: any) => res.send("error logging in"));

  passport.serializeUser(function (user: any, cb: any) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj: any, cb: any) {
    cb(null, obj);
  });

  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      function (accessToken: any, refreshToken: any, profile: any, done: any) {
        userProfile = profile;
        return done(null, userProfile);
      }
    )
  );
  //end of auth
  // endpoints
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/error" }),
    function (req: any, res: any) {
      res.redirect("/success");
    }
  );
}
