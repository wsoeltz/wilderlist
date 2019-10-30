import { Express } from 'express';
import { formatStringDate } from '../graphql/Utils';
import { sendAscentInviteEmailNotification } from './email';

const notificationRoutes = (app: Express) => {
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
};

export default notificationRoutes;
