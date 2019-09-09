/* tslint:disable:await-promise */
require('dotenv').config();
import passport, { Profile } from 'passport';
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
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    throw new Error('Unable to desarialize user');
  }
});

const updateUser = async (profile: Profile) => {
  const { id, displayName, emails, photos } = profile;
  const email = emails !== undefined ? emails[0].value : '';
  const profilePictureUrl = photos !== undefined ? photos[0].value : '';
  try {
    const updatedUser = await User.findOneAndUpdate({ googleId: id }, {
      name: displayName,
      email,
      profilePictureUrl,
    });
    return updatedUser;
  } catch (err) {
    throw new Error('Unable to update user');
  }
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        const updatedUser = await updateUser(profile);
        done(undefined, updatedUser);
      } else {
        const { id, displayName, emails, photos } = profile;
        const email = emails !== undefined ? emails[0].value : '';
        const profilePictureUrl = photos !== undefined ? photos[0].value : '';
        const user = await new User({
          googleId: id,
          name: displayName,
          email,
          profilePictureUrl,
          permissions: PermissionTypes.standard,
        }).save();
        done(undefined, user);
      }
    } catch (err) {
      throw new Error('Unable to use Google Strategy');
    }
  }),
);
