import app from './server/server';

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line
  return console.log(`listening on port ${process.env.PORT}`);
});
