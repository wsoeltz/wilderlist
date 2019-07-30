require('dotenv').config();
import passport from 'passport';
import { Strategy as GoogleStrategy} from 'passport-google-oauth20';

// Setup Google OAuth
if (process.env.GOOGLE_CLIENT_ID === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}
if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET');
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  }, (accessToken, refreshToken, profile, done) => {
    console.log({accessToken, refreshToken, profile, done});
  })
);