require('dotenv').config();

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import passport from 'passport';
import googleAuth from './auth/google';
import buildDataloaders from './dataloaders';
import schema from './graphql/schema';
import { formatStringDate } from './graphql/Utils';
import requireLogin from './middleware/requireLogin';
import { sendAscentInviteEmailNotification } from './notifications/email';

require('./auth/passport');

const app = express();

if (!process.env.COOKIE_KEY) {
  throw new Error('You must provide a COOKIE_KEY');
}

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Setup OAuth with Google
googleAuth(app);

if (process.env.NODE_ENV === 'development') {
  // Allow all cors requests on development
  app.use(cors());
}

///// Setup MongoDb connection
if (process.env.MONGO_URI === undefined) {
  throw new Error('You must provide a MongoAtlas URI');
}
if (process.env.MONGO_AUTH_SOURCE === undefined) {
  throw new Error('You must provide a MongoDB authSource');
}
if (process.env.MONGO_DATABASE_NAME === undefined) {
  throw new Error('You must provide a dbName');
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  authSource: process.env.MONGO_AUTH_SOURCE,
  dbName: process.env.MONGO_DATABASE_NAME,
  useCreateIndex: true,
  useNewUrlParser: true,
});

mongoose.connection
  // tslint:disable-next-line
    .once('open', () => console.log('Connected to MongoLab instance.'))
  // tslint:disable-next-line
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const graphiql = process.env.NODE_ENV === 'development' ? true : false;
app.use(bodyParser.json());
app.use('/graphql', requireLogin, expressGraphQL({
  schema,
  graphiql,
  context: {
    dataloaders: buildDataloaders(),
  },
}));
///// End MongoDb Connection Setup

// Send invites to ascent added emails
app.get('/api/ascent-invite', (req, res) => {
  if (req && req.query && req.user) {
    const {
      email, mountainName, date,
    } = req.query;
    if (email && mountainName && date) {
      sendAscentInviteEmailNotification({
        mountainName,
        user: req.user.name,
        userEmail: email,
        date: formatStringDate(date),
      });
    }
  }
  res.send();
});

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js or main.css file
  app.use(express.static('client/build'));

  // Express will serve up index.html if it
  // does not recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
  });
}

export default app;
