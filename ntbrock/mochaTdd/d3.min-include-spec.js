//2016Jun15

'use strict';
var expect= require('chai').expect;

describe('RequireD3MinLibrary', function () {
	
	it('should exist', function () {
		var RequireD3MinLibrary = require('../../js/d3.min.js');
		expect(RequireD3MinLibrary).to.not.be.undefined;
	    });
    });