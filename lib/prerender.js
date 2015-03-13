var request   = require('request'),
    url       = require('url');

// Constants
var BOT_REGEX = /bot|crawler|baiduspider|80legs|mediapartners-google|adsbot-google/i,
    CDN_API = 'https://prerender-cdn.localizejs.com/api/prerender/get/';


////
//  CREATE MIDDLEWARE
////

module.exports = function(options) {
  // Make sure a rootDomain is available
  if (!options.rootDomain || options.rootDomain.indexOf('http')) {
    throw 'Localize.js prerender error: please pass in a `rootDomain`, such as \'http://example.com\'';
  }

  // Format rootDomain
  var rootDomain = url.parse(options.rootDomain);
  if (!rootDomain.protocol || !rootDomain.host) {
    throw 'Localize.js prerender error: your `rootDomain` is malformed. Please enter a value such as \'http://example.com\'';
  }
  rootDomain = rootDomain.protocol + '//' + rootDomain.host;

  // Return middleware
  return function(req, res, next) {
    // Only prerender GET requests
    if (req.method !== 'GET') return next();

    // Check if the requester is a bot
    if (!options.prerenderAllRequests && !isBot(req)) return next();

    request({
      method: 'GET',
      url: CDN_API,
      qs: {
        url: rootDomain + req.url,
        version: options.version || ''
      },
      json: true
    }, function(err, response, body) {
      // Pass request to server if error getting the prerendered HTML
      if (err || !body.html) return next();

      res.status(200).send(body.html);
    });
  };
};

var isBot = function(req) {
  return BOT_REGEX.test(req.headers['user-agent'] || '');
};
