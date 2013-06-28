var _ = require('underscore'),
    https = require('https'),
    qs = require('querystring');

var endPoints = {
  "userProfile": "/user/profile",

  "dailySummary": "/user/summary/daily/<date>",
  "weeklySummary": "/user/summary/daily/<week>",
  "monthlySummary": "/user/summary/daily/<month>",
  "rangeSummary": "/user/summary/daily?from=<from>&to=<to>",

  "dailyActivity": "/user/activities/daily/<date>",
  "weeklyActivity": "/user/activities/daily/<week>",
  "rangeActivity": "/user/activities/daily?from=<from>&to=<to>",

  "dailyPlaces": "/user/places/daily/<date>",
  "weeklyPlaces": "/user/places/daily/<week>",
  "rangePlaces": "/user/places/daily?from=<from>&to=<to>",

  "dailyStoryline": "/user/storyline/daily/<date>",
  "weeklyStoryline":  "/user/storyline/daily/<week>",
  "rangeStoryline": "/user/storyline/daily?from=<from>&to=<to>"
};

var Shakes = module.exports = function(opts) {
  if(!opts) throw new Error('missing options hash');
  if(!opts.hasOwnProperty('client_id')) throw new Error('you must pass in a valid client_id generated from dev.moves-app.com');
  if(!opts.hasOwnProperty('client_secret')) throw new Error('you must pass in a valid client_id generated from dev.moves-app.com');
  if(!opts.hasOwnProperty('redirect_uri')) throw new Error('you must pass in the redirect_uri for this app from dev.moves-app.com');

  var movesConfig = {
    "apiUrl":"api.moves-app.com",
    "apiAuthPath": "/oauth/v1/authorize",
    "apiTokenPath": "/oauth/v1/access_token",
    "apiTokenInfoPath": "/oauth/v1/tokeninfo",
    "apiPath": "/api/v1"
  };

  this.client_id = opts.client_id;
  this.client_secret = opts.client_secret;
  if(opts.redirect_uri) this.redirect_uri = opts.redirect_uri;
  this.endPoints = {};

  _.extend(this, movesConfig);
  _.extend(this.endPoints, endPoints);

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

  if(this.redirect_uri)
    queryParams.redirect_uri = this.redirect_uri;

  var auth_url = 'https://' + this.apiUrl + this.apiAuthPath + '?' + qs.stringify(queryParams);
  if(opts.urlScheme === 'mobile') {
    delete queryParams.response_type;

    auth_url = 'moves://app/authorize?' + qs.stringify(queryParams);
  }

  return auth_url;
};

Shakes.prototype.token = function(code, cb) {
  if(!code) throw new Error('missing required code from api.moves-dev.com');

  var postData = {
    'grant_type':'authorization_code',
    'code': code,
    'client_id': this.client_id,
    'client_secret': this.client_secret
  };

  if(this.redirect_uri)
    postData.redirect_uri = this.redirect_uri;

  postData = qs.stringify(postData);

  var options = {
    host: this.apiUrl,
    port: 443,
    path: this.apiTokenPath,
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  doRequest(options, postData, cb);
};

Shakes.prototype.token_info = function(token, cb) {
  if(!token) throw new Error('you must pass in a token');

  var postData = qs.stringify({ 'access_token': token  });

  var options = {
    host: this.apiUrl,
    port: 443,
    method: "GET",
    path: this.apiTokenInfoPath + '?' + postData
  };

  doRequest(options, null, cb);
};

Shakes.prototype.refresh_token = function(refresh_token, cb) {
  if(!refresh_token) throw new Error('you must pass in a token');

  var postData = qs.stringify({
    'grant_type':'refresh_token',
    'refresh_token': refresh_token,
    'client_id': this.client_id,
    'client_secret': this.client_secret
  });

  var options = {
    host: this.apiUrl,
    port: 443,
    path: this.apiTokenPath,
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  doRequest(options, postData, cb);
};

Shakes.prototype.get = function(endPoint, params, token, cb) {
  if(!endPoints.hasOwnProperty(endPoint)) throw new Error('the end point you requested is not supported');
  if(!token || token === '') throw new Error('you must pass in a valid moves token');

  var parsedEndPoint = endPoints[endPoint];
  if(params) {
    Object.keys(params).forEach(function(key) {
      parsedEndPoint = parsedEndPoint.replace('<'+key+'>', params[key]);
    });
  }

  var tokenData = qs.stringify({ 'access_token':token });

  var options = {
    host: this.apiUrl,
    port: 443,
    path: this.apiPath + parsedEndPoint + '?' + tokenData,
    method: "GET"
  };

  doRequest(options, null, cb);
};

var doRequest = function(options, postData, cb) {
  var data = "";
  var apiReq = https.request(options, function(apiRes) {
    apiRes.setEncoding('utf8');
    apiRes.on('data', function(chunk) {
      data += chunk;
    });
    apiRes.on('end', function() {
      cb && cb(JSON.parse(data));
    });
    apiRes.on('error', function(err) {
      console.log('WTF ERR ', err);
    });
  });

  if(postData && postData !== null) apiReq.write(postData);
  apiReq.end();
};
