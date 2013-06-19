# Shakes

Shakes is a wrapper for the [moves api](http://dev.moves-app.com). It
provides a simple way of accessing your moves data!

    var moves = new Shakes(client_secret);
    moves.auth(you handle getting this);
    moves.get({"activity"}, function(data){
      console.log(data);
    });
