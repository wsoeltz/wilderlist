import * as Sentry from '@sentry/node';
import app from './server/server';

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({ dsn: 'https://0feed25ffbf943c5992db57411874a75@o425164.ingest.sentry.io/5357959' });
}

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line
  return console.log(`listening on port ${process.env.PORT}`);
});
