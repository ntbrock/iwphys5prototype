// 2016-Jun-15

// Built using Mocha + Chai
'use strict';
var expect = require('chai').expect;

var fs = require('fs');


/**
 * Parse out all required elements from teh iwpJson cloned off server.
 */
describe('ParseSingle-iwpJson', function() {
    it('should parse', function() {

	// Read file from disk!
	var iwpFile = "./iwpJson/mirror-plane-ray-tracing.iwp.json"
	var iwpJson = JSON.parse( fs.readFileSync(iwpFile, 'utf8'));

	// Basic sanity checking of JSON structure.
	expect(iwpJson.author).to.not.be.an('undefined')
        expect(iwpJson.author).to.have.all.keys('username', 'name', 'organization', 'email');

    })

    it('shouldnt parse', function() {

	// Read file from disk!
	var iwpFile = "./iwpJson/intentionally-broken-missingAuthor.iwp.json"
	var iwpJson = JSON.parse( fs.readFileSync(iwpFile, 'utf8'));

	// Basic sanity checking of JSON structure.
	expect(iwpJson.author).to.be.an('undefined')

    })

});
