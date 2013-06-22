var _ = require('underscore'),
    https = require('https'),
    qs = require('querystring');

var Shakes = module.exports = function(opts) {
  if(!opts) throw new Error('missing options hash');
  if(!opts.hasOwnProperty('client_id')) throw new Error('you must pass in a valid client_id generated from dev.moves-app.com');
  if(!opts.hasOwnProperty('client_secret')) throw new Error('you must pass in a valid client_id generated from dev.moves-app.com');

  var movesConfig = {
    "apiUrl":"api.moves-app.com",
    "apiAuthPath": "/oauth/v1/authorize",
    "apiPath": "/api/v1"
  };

  this.client_id = opts.client_id;
  this.client_secret = opts.client_secret;

  _.extend(this, movesConfig);

  return this;
};

// authorize - create the correct authorize url and redirect the user to it.
Shakes.prototype.authorize = function(opts) {
  if(!opts) throw new Error('missing options hash');
  if(!opts.hasOwnProperty('scope')) throw new Error('you must pass in valid scope options');

  var queryParams = {
    'response_type':'code',
    'client_id': this.client_id,
    'scope': opts.scope
  };

  if(opts.redirect_uri)
    queryParams.redirect_url = opts.redirect_uri;

  var auth_url = "https://" + this.apiUrl + this.apiAuthPath + '?' + qs.stringify(queryParams);

  return auth_url;
};

Shakes.prototype.token = function(opts, cb) {
  if(!opts) throw new Error('missing options hash');
  if(!opts.hasOwnProperty('code')) throw new Error('you must pass in the code that was returned');

  var postData = qs.stringify({
    'grant_type':'authorization_code',
    'code': opts.code,
    'client_id': 'Zq7V9Au1lCPlJy0isXpOVy1Si5EM9U3G',
    'client_secret': '4D05oDq4qLmd45UZ536TIvSHh7X9PX6C13Whm11_0uD147N8aRN24FizU5fC2NiR'
  });

  var options = {
    host: "api.moves-app.com",
    port: 443,
    path: "/oauth/v1/access_token",
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  // do the request!
  var data = "";
  var apiReq = https.request(options, function(apiRes) {
    apiRes.setEncoding('utf8');
    apiRes.on('data', function(chunk) {
      data += chunk;
    });
    apiRes.on('end', function() {
      console.log(data);
      cb && cb(data);
    });
    apiRes.on('error', function(err) {
      console.log('WTF ERR ', err);
    });
  });

  apiReq.write(postData);
  apiReq.end();
};
