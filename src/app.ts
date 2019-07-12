import express from 'express';

const app = express();
const port = 5000;
app.get('/', (req, res) => {
  res.send('Notches');
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  // tslint:disable-next-line
  return console.log(`server is listening on ${port}`);
});
