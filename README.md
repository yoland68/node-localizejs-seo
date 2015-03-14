Localize.js SEO for Node.js
===============

Node.js middleware that provides full SEO support for Node.js apps using [Localize.js](https://localizejs.com).

**How it works**: 

When a request is made to your server using this middleware, here's what happens:

1. Middleware checks if request is a GET request. If not, `next()` is called and the middleware is bypassed.
2. Middleware checks if request is made from a search engine bot or crawler (like Googlebot). If not, `next()` is called and the middleware is bypassed.
3. When a GET request is made to your website by a search engine bot or crawler, the middleware makes a request to our prerendering API for the prerendered HTML of the page that was requested. 
4. The prerendered HTML is received from the localizejs.com API and delivered to the search engine crawler for indexing.

This is a hosted prerendering service, meaning that the prerendering of your page and caching is offloaded to our servers.

**Performance**:

There are two built in lawyers of caching. We use Redis on our server to cache your HTML, and serve the reply through Amazon Cloudfront to ensure extremely low latency response no matter where your server is (typically less than 20-50ms for a cached request).

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

# Contribute

Forks and pull requests welcome!

# TODO
* Add request timeout
* Add tests

# Author

[Localize.js](https://localizejs.com). For support, email [support@localizejs.com](mailto:support@localizejs.com).
