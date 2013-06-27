# Shakes

Shakes is a wrapper for the [moves api](http://dev.moves-app.com). It
provides a simple way of accessing your moves data!

    // instantiate shakes like so
    var moves = new Shakes({client_id:'your clientid',client_secret:'your client secret');
    
    // moves.authorize will give you a url to send users to so they can authorize your app
    var auth_url = moves.authorize() 
    
    // with the ?code=xxxx that is returned from above this will give you a valid access token
    moves.auth('xxxx', function(token) {
      // store the token in a cookie or something
      req.cookies.token = token.access_token
    });
    
    // call the api using the named endpoint and parameters + token!
    moves.get("dailyActivity", {day:'20130626'}, req.cookies.token, function(data){
      res.render('activity', {'activities':data});
    });
