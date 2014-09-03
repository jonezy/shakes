
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    auth = require('./routes/auth'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.cookieParser('omgwtf123409876'));
app.use(express.cookieSession({secret:'omgwtf123409876', cookie: {  path: '/', httpOnly: true, maxAge: 14 * 24 * 3600000 }}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/auth/token', auth.token);
app.get('/auth/token_info', auth.token_info);
app.get('/auth/refresh_token', auth.refresh_token);
app.get('/profile', user.profile);

app.get('/summary/daily/:date?', user.dailySummary);
app.get('/summary/weekly/:date?', user.weeklySummary);
app.get('/summary/monthly/:date?', user.monthlySummary);

app.get('/activity/daily/:date?', user.dailyActivity);
app.get('/activity/weekly/:date?', user.weeklyActivity);

app.get('/places/daily/:date?', user.dailyPlaces);
app.get('/places/weekly/:date?', user.weeklyPlaces);

app.get('/storyline/daily/:date?', user.dailyStoryline);
app.get('/storyline/weekly/:date?', user.weeklyStoryline);
app.get('/storyline/:from/:to?', user.rangeStoryline);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
