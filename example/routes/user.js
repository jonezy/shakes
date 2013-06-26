

var https = require('https');
var qs = require('querystring');
var Shakes = require('../../lib/shakes');

var shakesOpts = {
  'client_id': 'Zq7V9Au1lCPlJy0isXpOVy1Si5EM9U3G',
  'client_secret': '4D05oDq4qLmd45UZ536TIvSHh7X9PX6C13Whm11_0uD147N8aRN24FizU5fC2NiR'
};

var moves = new Shakes(shakesOpts);
var expires = 14 * 24 * 3600000; // 2 weeks

exports.profile = function(req, res) {
  moves.get('userProfile', null, req.cookies.m_token, function(data) {
    console.log(data);
    res.render('profile', {'title': 'Your Profile','profile':data});
  });
};

