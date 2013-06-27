# Shakes

Shakes is a wrapper for the [moves api](http://dev.moves-app.com). It
provides a simple way of accessing your moves data!

    var moves = new Shakes({client_id:'your client
id',client_secret:'your client secret');
    moves.authorize() // this will give you the correct url to send your
users too
    moves.auth('code returned from above', function(token) {
      // store the token in a cookie or something
    });
    moves.get("dailyActivity", {day:'20130626'}, 'your token from
cookie', function(data){
      console.log(data);
    });
