
var https = require('https');
var qs = require('querystring');
var Shakes = require('../../lib/shakes');

var shakesOpts = {
  'client_id': 'Zq7V9Au1lCPlJy0isXpOVy1Si5EM9U3G',
  'client_secret': '4D05oDq4qLmd45UZ536TIvSHh7X9PX6C13Whm11_0uD147N8aRN24FizU5fC2NiR'
};

var moves = new Shakes(shakesOpts);

exports.token = function(req, res) {
  if(req.query.code) {
    moves.token({'code':req.query.code}, function(t) {
      res.clearCookie('m_token');
      res.clearCookie('m_rtoken');
      res.clearCookie('m_uid');

      var expires = 14 * 24 * 3600000; // 2 weeks
      res.cookie('m_token', t.access_token, {maxAge: expires});
      res.cookie('m_rtoken', t.refresh_token, {maxAge: expires});

      res.render('token', {'title': 'Token info','token':JSON.stringify(t)});
    });
  }
};

exports.token_info = function(req, res) {
  moves.token_info( req.cookies.m_token, function(t) {
    res.render('token', {'title': 'Token info','token':JSON.stringify(t)});
  });
};