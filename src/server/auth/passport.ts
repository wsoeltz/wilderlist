/* tslint:disable:await-promise */
require('dotenv').config();
import passport from 'passport';
import { Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { PermissionTypes, User as IUser } from '../graphql/graphQLTypes';
import { User } from '../graphql/schema/queryTypes/userType';

// Setup Google OAuth
if (process.env.GOOGLE_CLIENT_ID === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}
if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET');
}

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      done(undefined, existingUser);
    } else {
      const user = await new User({ googleId: profile.id, permissions: PermissionTypes.standard }).save();
      done(undefined, user);
    }
  }),
);
