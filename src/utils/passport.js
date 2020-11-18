import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
// import { Strategy as YoutubeStrategy } from 'passport-youtube-v3';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { TelegramStrategy } from 'passport-telegram-official';

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
  profileFields: ['id', 'displayName', 'email', 'link'],
}, (req, accessToken, refreshToken, profile, done) => done(null, profile)));

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
} = CONFIG;
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = CONFIG;
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  scope: ['https://www.googleapis.com/auth/userinfo.email', 'profile'],
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

const { TELEGRAM_BOT_TOKEN } = CONFIG;
passport.use(new TelegramStrategy({
  botToken: TELEGRAM_BOT_TOKEN,
}, (profile, done) => done(null, profile)));
