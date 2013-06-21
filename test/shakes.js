var assert = require('assert');
var Shakes = require('../lib/shakes');


describe("shakes with empty constructor", function() {
  it("should throw an error", function() {
    assert.throws(function() { var moves = new Shakes(); }, Error);
  });
});

describe("shakes with non-empty constructor", function() {
  describe("with valid options", function() {

  });

  describe("with in-valid options", function() {

  });

});
