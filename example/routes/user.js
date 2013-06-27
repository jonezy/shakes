var https = require('https');
var qs = require('querystring');
var Shakes = require('../../lib/shakes');
var moment = require('moment');

var shakesOpts = {
  'client_id': 'Zq7V9Au1lCPlJy0isXpOVy1Si5EM9U3G',
  'client_secret': '4D05oDq4qLmd45UZ536TIvSHh7X9PX6C13Whm11_0uD147N8aRN24FizU5fC2NiR'
};

var moves = new Shakes(shakesOpts);
var expires = 14 * 24 * 3600000; // 2 weeks

exports.profile = function(req, res) {
  moves.get('userProfile', null, req.cookies.m_token, function(data) {
    var firstDate = data.profile.firstDate.toString();
    var year = firstDate.substring(0,4);
    var month = firstDate.substring(4,6);
    var day = firstDate.substring(6,8);

    res.render('profile', {'title': 'Your Profile','profile':data, 'firstDate':new Date(year, month, day).toLocaleDateString() });
  });
};

exports.dailySummary = function(req, res) {
  var day = req.params.date ? req.params.date : moment().format('YYYYMMDD');
  moves.get('dailySummary', {date:day}, req.cookies.m_token, function(data) {
    res.render('summary', {'title': 'Daily Summary','summary':data});
  });
};

exports.weeklySummary = function(req, res) {
  var week = req.params.date ? req.params.date : moment().format('YYYY-[W]ww');
  moves.get('weeklySummary', {week:week}, req.cookies.m_token, function(data) {
    res.render('summary', {'title': 'Weekly Summary','summary':data});
  });
};

exports.monthlySummary = function(req, res) {
  var month = req.params.date ? req.params.date : moment().format('YYYYMM');
  moves.get('monthlySummary', {month:month}, req.cookies.m_token, function(data) {
    res.render('summary', {'title': 'Monthly Summary','summary':data});
  });
};
