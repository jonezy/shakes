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
  if(!opts.hasOwnProperty('redirect_uri')) throw new Error('you must pass in the redirect_uri registered at dev.moves-app.com');
  if(!opts.hasOwnProperty('scope')) throw new Error('you must pass in valid scope options');

  var queryParams = {
    'response_type':'code',
    'client_id': this.client_id,
    'redirect_uri': opts.redirect_uri,
    'scope': opts.scope
  };

  var auth_url = "https://" + this.apiUrl + this.apiAuthPath + '?' + qs.stringify(queryParams);

  return auth_url;
};
