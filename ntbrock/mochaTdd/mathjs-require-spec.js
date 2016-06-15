// 2016-Jun-15

// Built using Mocha + Chai
'use strict';
var expect = require('chai').expect;



describe('MathjsRequire', function() {
    it('should exist', function() {
        var MathjsRequire = require('mathjs');
        expect(MathjsRequire).to.not.be.undefined;
    });
});
