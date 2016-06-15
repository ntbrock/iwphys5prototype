// 2016-Jun-15

'use strict';
var expect = require('mathjs').expect;

describe('MathjsRequire', function() {
    it('should exist', function() {
        var MathjsRequire = require('./math.js');
        expect(MathjsRequire).to.not.be.undefined;
    });
});
