const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy(['/api', '/auth/google', '/auth/reddit', '/graphql', 'ascent-invite'], { target: 'http://localhost:5050' }));
}