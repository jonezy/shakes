var assert = require('assert');
var mocha = require('mocha');
var Shakes = require('../lib/shakes');

var validOpts = {
  'client_id': 'xxxxxxxxxx',
  'client_secret': 'xxxxxxxxxxxxxx'
};

var invalidOptions = {
  'test':'1234'
};

describe("shakes with empty constructor", function() {
  it("should throw an error", function() {
    assert.throws(function() { var moves = new Shakes(); }, Error);
  });
});

describe("shakes with non-empty constructor", function() {
  describe("with in-valid options", function() {
    it('should throw an error', function() {
      assert.throws(function() { var moves = new Shakes(invalidOptions);}, Error);
    });
  });
  describe('with missing option', function() {
    describe('client_id', function() {
      it('should throw an error', function() {
        assert.throws(function() {
          var moves = new Shakes({'client_secret':'1234','redirect_uri':'/'});
        }, Error);
      });
    });
    describe('client_secret', function() {
      it('should throw an error', function() {
        assert.throws(function() {
          var moves = new Shakes({'client_id':'1234','redirect_uri':'/'});
        }, Error);
      });
    });
  });

  describe("with valid options", function() {
    var moves;
    beforeEach(function() {
      moves = new Shakes(validOpts);
    });

    it('should return an object', function() {
      assert(moves, typeof(object), 'expected an object');
    });

    it('should have a client_id property', function() {
      assert(moves.client_id, validOpts.client_id, 'client_id did not match');
    });

    it('should have a client_secret property', function() {
      assert(moves.client_secret, validOpts.client_secret, 'client_secret did not match');
    });
  });
});

describe("shakes.authorize()", function() {

  describe("with valid options", function() {
    var moves;
    beforeEach(function() {
      moves = new Shakes(validOpts);
    });

    it('should return a string', function() {
      assert(moves.authorize({'redirect_uri':'test', 'scope':'locations'}), typeof(string), 'expected an object');
    });
  });

  describe('with missing option', function() {
    describe('redirect_uri', function() {
      it('should throw an error', function() {
        assert.throws(function() {
          moves.authorize();
        }, Error);
      });
    });
    describe('scope', function() {
      it('should throw an error', function() {
        assert.throws(function() {
          moves.authorize({'redirect_uri':'test'});
        }, Error);
      });
    });
  });
});
