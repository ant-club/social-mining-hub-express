import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const CONFIG = JSON.parse(process.env.PASSPORT);

// facebook
const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
} = CONFIG;

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: FACEBOOK_CALLBACK_URL,
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => done(null, { req: req.query, profile })));
