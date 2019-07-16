"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var app = express_1.default();
// Set this to allow cross origin access
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.get('/', function (req, res, next) {
    res.send('Welcome to Notches');
});
// app.get('/api/test', (req, res, next) => {
//   res.send({message: 'Notches'});
// });
// if (process.env.NODE_ENV == 'production') {
//   // Express will serve up production assets
//   // like our main.js or main.css file
//   app.use(express.static('client/build'))
//   // Express will serve up index.html if it
//   // does not recognize the route
//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   })
// }
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    // tslint:disable-next-line
    return console.log("server is listening on " + PORT);
});
//# sourceMappingURL=index.js.map