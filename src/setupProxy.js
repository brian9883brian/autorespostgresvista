const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.autoreslibroautores.somee.com',
      changeOrigin: true
    })
  );
};
