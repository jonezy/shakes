var https = require('https');
var qs = require('querystring');
var Shakes = require('../../lib/shakes');
var nconf = require('nconf');

nconf.argv().env().file({ file: 'settings.json'});
var shakesOpts = {
  'client_id': nconf.get('client_id'),
  'client_secret': nconf.get('client_secret')
};

var moves = new Shakes(shakesOpts);
var expires = 14 * 24 * 3600000; // 2 weeks

exports.token = function(req, res) {
  if(req.query.code) {
    moves.token({'code':req.query.code}, function(t) {
      res.clearCookie('m_token');
      res.clearCookie('m_rtoken');

      res.cookie('m_token', t.access_token, {maxAge: expires});
      res.cookie('m_rtoken', t.refresh_token, {maxAge: expires});

      res.render('token', {'title': 'Token info','token':JSON.stringify(t)});
    });
  }
};

exports.token_info = function(req, res) {
  if(!req.cookies.m_token)
    res.render('token', {'title': 'Token info'});

  moves.token_info( req.cookies.m_token, function(t) {
    res.render('token', {'title': 'Token info','token':JSON.stringify(t)});
  });
};

exports.refresh_token = function(req, res) {
  if(!req.cookies.m_rtoken)
    res.render('token', {'title': 'Token info'});

  moves.refresh_token( req.cookies.m_rtoken, function(t) {
    res.clearCookie('m_token');
    res.clearCookie('m_rtoken');

    res.cookie('m_token', t.access_token, {maxAge: expires});
    res.cookie('m_rtoken', t.refresh_token, {maxAge: expires});

    res.render('token', {'title': 'Token info','token':JSON.stringify(t)});
  });
};
