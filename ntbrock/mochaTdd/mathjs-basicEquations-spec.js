//2016Jun15

'use strict';
var expect=require('chai').expect;

var math = require('mathjs');

describe('mathjs-basicEquations-require', function() {
	it('should add 1+2', function() {

		var eqn = math.compile("1+2");
		expect(eqn.eval()).to.equal(3);
	    });
    });