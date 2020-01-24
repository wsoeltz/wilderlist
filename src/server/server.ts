require('dotenv').config();

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import expressGraphQL from 'express-graphql';
import { redirectToHTTPS } from 'express-http-to-https';
import mongoose from 'mongoose';
import passport from 'passport';
import googleAuth from './auth/google';
import redditAuth from './auth/reddit';
import buildDataloaders from './dataloaders';
import schema from './graphql/schema';
import requireLogin from './middleware/requireLogin';
import notificationRoutes from './notifications';

require('./auth/passport');

const app = express();

app.use(redirectToHTTPS([/localhost:(\d{4})/], undefined, 301));

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
// Setup OAuth with Reddit
redditAuth(app);

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
  useUnifiedTopology: true,
});

mongoose.connection
  // tslint:disable-next-line
    .once('open', () => console.log('Connected to MongoLab instance.'))
  // tslint:disable-next-line
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const graphiql = process.env.NODE_ENV === 'development' ? true : false;
app.use(bodyParser.json());
app.use('/graphql', requireLogin, expressGraphQL((req: any) => ({
  schema,
  graphiql,
  context: {
    dataloaders: buildDataloaders(),
    user: req.user,
  },
})));
///// End MongoDb Connection Setup

// Send invites to ascent added emails
notificationRoutes(app);

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
