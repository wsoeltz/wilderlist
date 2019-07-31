require('dotenv').config();

import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import expressGraphQL from 'express-graphql';
import mongoose from 'mongoose';
import passport from 'passport';
import googleAuth from './auth/google';
import schema from './graphql/schema';

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

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  authSource: 'admin',
  dbName: 'database-0',
  useCreateIndex: true,
  useNewUrlParser: true,
});

mongoose.connection
  // tslint:disable-next-line
    .once('open', () => console.log('Connected to MongoLab instance.'))
  // tslint:disable-next-line
    .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}));
///// End MongoDb Connection Setup

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
