const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy([
      '/api',
      '/auth/google',
      '/auth/facebook',
      '/auth/reddit',
      '/graphql',
      '/api/ascent-invite',
      '/api/send-email',
      '/download/grid-application.xlsx',
      '/download/grid-application.xls',
    ], { target: 'http://localhost:5050' }));
}