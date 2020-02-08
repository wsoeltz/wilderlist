import { Express } from 'express';
import passport from 'passport';

const facebookAuth = (app: Express) => {
  app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: 'email',
      state: 'code',
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook'), (req, res) => {
      res.redirect('/');
    },
  );
};

export default facebookAuth;
