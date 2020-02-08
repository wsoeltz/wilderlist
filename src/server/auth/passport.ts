/* tslint:disable:await-promise */
require('dotenv').config();
import passport, { Profile } from 'passport';
import { Strategy as FacebookStrategy} from 'passport-facebook';
import { Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { Strategy as RedditStrategy} from 'passport-reddit';
import { PermissionTypes, User as IUser } from '../graphql/graphQLTypes';
import { User } from '../graphql/schema/queryTypes/userType';
import { sendWelcomeEmail } from '../notifications/email';

// Setup OAuth
if (process.env.GOOGLE_CLIENT_ID === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}
if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET');
}
if (process.env.REDDIT_CLIENT_ID === undefined) {
  throw new Error('Missing REDDIT_CLIENT_ID');
}
if (process.env.REDDIT_CLIENT_SECRET === undefined) {
  throw new Error('Missing REDDIT_CLIENT_SECRET');
}
if (process.env.REDDIT_STATE === undefined) {
  throw new Error('Missing REDDIT_STATE');
}
if (process.env.FACEBOOK_APP_ID === undefined) {
  throw new Error('Missing FACEBOOK_APP_ID');
}
if (process.env.FACEBOOK_APP_SECRET === undefined) {
  throw new Error('Missing FACEBOOK_APP_SECRET');
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

const updateUserGoogle = async (profile: Profile) => {
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
        const updatedUser = await updateUserGoogle(profile);
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
        sendWelcomeEmail(email);
      }
    } catch (err) {
      throw new Error('Unable to use Google Strategy');
    }
  }),
);

const updateUserReddit = async (profile: any) => {
  const { id, name, _json: {icon_img} } = profile;
  const baseProfileImg = icon_img ? icon_img : '';
  const profilePictureUrl = baseProfileImg.split('?').shift();
  try {
    const updatedUser = await User.findOneAndUpdate({ redditId: id }, {
      name,
      profilePictureUrl,
    });
    return updatedUser;
  } catch (err) {
    throw new Error('Unable to update user');
  }
};

passport.use(new RedditStrategy({
  clientID: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  callbackURL: '/auth/reddit/callback',
  state: process.env.REDDIT_STATE,
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const existingUser = await User.findOne({ redditId: profile.id });
      if (existingUser) {
        const updatedUser = await updateUserReddit(profile);
        done(undefined, updatedUser);
      } else {
        const { id, name, _json: {icon_img} } = profile;
        const baseProfileImg = icon_img ? icon_img : '';
        const profilePictureUrl = baseProfileImg.split('?').shift();
        const user = await new User({
          redditId: id,
          name,
          email: null,
          profilePictureUrl,
          permissions: PermissionTypes.standard,
        }).save();
        done(undefined, user);
      }
    } catch (err) {
      throw new Error('Unable to use Reddit Strategy');
    }
  }),
);

const updateUserFacebook = async (profile: any) => {
  const {
    id, emails, photos,
    name, _json,
  } = profile;
  let username: string;
  if (name !== undefined && name.familyName && name.givenName) {
    const { familyName, givenName } = name;
    username = givenName + ' ' + familyName;
  } else if (_json && _json.last_name && _json.first_name) {
    const { first_name, last_name } = _json;
    username = first_name + ' ' + last_name;
  } else {
    throw new Error('Unable to get the user\'s name _json:' + _json + '\nname: ' + name);
  }
  const email = emails !== undefined ? emails[0].value : '';
  const profilePictureUrl = photos !== undefined ? photos[0].value : '';
  try {
    const updatedUser = await User.findOneAndUpdate({ facebookId: id }, {
      name: username,
      email,
      profilePictureUrl,
    });
    return updatedUser;
  } catch (err) {
    throw new Error('Unable to update user');
  }
};

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['email', 'name', 'picture.type(large)'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ facebookId: profile.id });
      if (existingUser) {
        const updatedUser = await updateUserFacebook(profile);
        done(undefined, updatedUser);
      } else {
        const {
          id, emails, photos,
          name, _json,
        } = profile;
        let username: string;
        if (name !== undefined && name.familyName && name.givenName) {
          const { familyName, givenName } = name;
          username = givenName + ' ' + familyName;
        } else if (_json && _json.last_name && _json.first_name) {
          const { first_name, last_name } = _json;
          username = first_name + ' ' + last_name;
        } else {
          throw new Error('Unable to get the user\'s name _json:' + _json + '\nname: ' + name);
        }
        const email = emails !== undefined ? emails[0].value : '';
        const profilePictureUrl = photos !== undefined ? photos[0].value : '';
        const user = await new User({
          facebookId: id,
          name: username,
          email,
          profilePictureUrl,
          permissions: PermissionTypes.standard,
        }).save();
        done(undefined, user);
        sendWelcomeEmail(email);
      }
    } catch (err) {
      throw new Error('Unable to use Facebook Strategy');
    }
  }),
);
