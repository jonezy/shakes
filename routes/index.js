
/*
 * GET home page.
 */

//var OAuth = require('OAuth');

var https = require('https');
var qs = require('querystring');

exports.index = function(req, res){

  if(req.query.code) {
    var postData = qs.stringify({
      'grant_type':'authorization_code',
      'code': req.query.code,
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
      });
      apiRes.on('error', function(err) {
        console.log('WTF ERR ', err);
      });
    });

    apiReq.write(postData);
    apiReq.end();
  }

  //var OAuth2 = OAuth.OAuth2;
  //var key = "Zq7V9Au1lCPlJy0isXpOVy1Si5EM9U3G";
  //var secrect = "4D05oDq4qLmd45UZ536TIvSHh7X9PX6C13Whm11_0uD147N8aRN24FizU5fC2NiR";
  //var oauth = new OAuth2(key,
                //secret,
                //"https://api.moves-app.com/oauth/v1/",
                //null,
                //"access_token",
                //null);

                //oauth.getOAuthAccessToken(
                  //'',
                  //{'grant_type':'client_credentials'},
                  //function(e, access_token, refresh_token, results) {
                    //console.log('bearer ', access_token);

                  //});
  res.render('index', { title: 'Express' });
};
