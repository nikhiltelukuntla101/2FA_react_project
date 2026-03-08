import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "user not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return done(null, user);
      else done(null, { message: "Incorrect password" });
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  console.log("We are inside serializeUser");
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("We are inside derializeUser");
    const user = await User.findOne({ _id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
