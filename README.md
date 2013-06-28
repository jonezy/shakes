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

# Installation

### Clone the repo

    git clone git@github.com:jonezy/shakes.git
    
### Install dependencies

    cd shakes && npm install
    
### Setup settings.json

Go to dev.moves-app.com and setup and application, grab the client_id, client_secret and redirect_uri (this is important,
mobile authentication won't work without it) and setup settings.json

    mv example/settings.local example/settings.json
    
    {
        'client_id': 'your client id',
        'client_secret': 'your client secret',
        'redirect_uri': 'your redirect_uri'
    }
    
### Run the example site

    cd example
    node app.js

### Run tests

    mocha -R nyan (the best way to run tests)
