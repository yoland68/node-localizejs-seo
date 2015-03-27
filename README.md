Localize.js SEO for Node.js
===============

Node.js middleware that provides full SEO support for Node.js apps using [Localize.js](https://localizejs.com). This middleware detects requests from search engine bots and crawlers, and replies with prerendered HTML via our hosted prerendering API.

Questions? We're happy to help. [Email us](https://localizejs.com/?modal=misc/support)!.

Installation
----------

Install via [npm](https://www.npmjs.org/package/localizejs-seo)

    npm install localizejs-seo --save
    

Add the Localize.js SEO middleware to your server:

    var localizejsSEO = require('localizejs-seo');
    
    app.use(localizejsSEO.middleware({
      rootDomain: 'http://yourwebsite.com'
    }));

Include this middleware early in your application - before your application routes are created.

### API
    var localizejsSEO = require('localizejs-seo');
##### localizejsSEO.middleware(options)

Creates the Localize.js SEO middleware. Accepted options:
 
* `rootDomain` ***Required***. The root domain of your website. For example, `http://yourwebsite.com`
* `version` *Optional*. Cache version. Localize.js caches prerendered HTML for a number of hours. You can clear this cache immediately by changing the version when you deploy and update to your application. `version` can be a number or string like an application ID or git commit ID.  
* `prerenderAllRequests` *Optional*. When true, *all* requests are prerendered, not just requests from robots. Only useful for testing and debugging - do not activate in production.
* `shouldPrerenderOverride` *Optional*. A function that overrides our internal `shouldPrerender` function. When this function returns true, the middleware will activate and prerender the route.


### How it works

When a request is made to your server using this middleware, here's what happens:

1. Middleware checks if request is a GET request. If not, `next()` is called and the middleware is bypassed.
2. Middleware checks if request is made from a search engine bot or crawler (like Googlebot). If not, `next()` is called and the middleware is bypassed.
3. When a GET request is made to your website by a search engine bot or crawler, the middleware makes a request to our prerendering API for the prerendered HTML of the page that was requested. 
4. The prerendered HTML is received from the localizejs.com API and delivered to the search engine crawler for indexing.

This is a hosted prerendering service, meaning that the prerendering of your page and caching is offloaded to our servers.

**Performance**:

There are two built in layers of caching. We use Redis on our server to cache your HTML, and the reply is sent through the Amazon Cloudfront CDN to ensure extremely low latency response no matter where your server is (typically less than 20-50ms for a cached request).


# Contribute

Forks and pull requests welcome!

# TODO
* Add request timeout
* Add tests

# Author

[Localize.js](https://localizejs.com). For support, email [support@localizejs.com](mailto:support@localizejs.com).
