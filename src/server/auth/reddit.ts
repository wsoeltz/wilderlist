import { Express } from 'express';
import passport from 'passport';

const redditAuth = (app: Express) => {
  app.get('/auth/reddit', passport.authenticate('reddit', {
      scope: 'identity',
  }));

  app.get('/auth/reddit/callback',
    passport.authenticate('reddit'), (req, res) => {
      res.redirect('/');
    },
  );
};

export default redditAuth;
