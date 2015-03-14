var request   = require('request'),
    url       = require('url');

// Constants
var BOT_REGEX = /bot|crawler|baiduspider|80legs|mediapartners-google|adsbot-google/i,
    CDN_API = 'https://prerender-cdn.localizejs.com/api/prerender/get/';


////
//  CREATE MIDDLEWARE
////

exports.middleware = function(options) {
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

  // Allow shouldPrerender function to be overwritten by passing 'shouldPrerenderFn' into library
  var shouldPrerenderCheck = options.shouldPrerenderOverride ? options.shouldPrerenderOverride : shouldPrerender;

  // Return middleware
  return function(req, res, next) {
    // Only prerender GET requests
    if (req.method !== 'GET') return next();

    // Set the "prerenderAllRequests" to true to prerender all GET requests
    if (!options.prerenderAllRequests) {
      // Check if URL should be prerendered
      if (!shouldPrerenderCheck(req)) return next();
    }

    // Get prerendered HTML
    getPrerenderedHTML(rootDomain + req.url, options.version, function(err, html) {
      // Pass request to server if error getting the prerendered HTML
      if (err || !html || !html.length) return next();

      res.status(200).send(html);
    });

  };
};


////
//  GET PRERENDERED HTML
////

var getPrerenderedHTML = exports.getPrerenderedHTML = function(url, version, done) {
  request({
    method: 'GET',
    url: CDN_API,
    qs: {
      url: url,
      version: version
    },
    json: true
  }, function(err, response, body) {
    if (err || !body.html) return done(err);
    done(null, body.html);
  });
};


////
//   SHOULD PRERENDER
////

var shouldPrerender = function(req) {
  return BOT_REGEX.test(req.headers['user-agent'] || '');
};
