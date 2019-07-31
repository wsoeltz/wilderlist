const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy(['/api', '/auth/google', '/graphql'], { target: 'http://localhost:5050' }));
}