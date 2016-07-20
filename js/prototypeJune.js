
/**
 * 2016-Jul-20 Graphic Layer Initailization to do our own reflection to turn svg cooridnate system into cartesian coordinates.
 */

var viewBox = { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
$(function(){ 

	var viewBoxAttrs = $("#move")[0].getAttribute("viewBox").split(" ");
	viewBox= { minX: parseFloat(viewBoxAttrs[0]), minY: parseFloat(viewBoxAttrs[1]), maxX: parseFloat(viewBoxAttrs[2]), maxY: parseFloat(viewBoxAttrs[3]) };
	console.log("Initialized Viewbox: ", viewBox );
});

	

/**
 * 2016-Jul-20 Concept for creating a assoicate hash of varitable -> value
 */

var varsOriginal = { 
y: 700,
x: 25,
v: 80,
Ay: -10,
Ax: 0
}

// Initialize the memory space for the large array that holds all histroical values
var varsAtStep = [];

// Initialize time - the big bang!
var stepNow = 0;
// T will always exist in every problem at every step, but must be set based on problem.
var t = 0;
// Tdelta is how much time changes with each anitmation step.
var tDelta = 0.05; 

//Step 0 really is the original!
varsOriginal.t = t;
varsAtStep[0] = varsOriginal;


// Run the simulation forward in time, step by step.
for ( var step = 1; step <= 5; step++ ) { 

var varsPrevious = varsAtStep[step-1];
var varsNow = {};
$.extend(varsNow, varsPrevious);

//console.log("step: ", step, " varsPrevious: ", varsPrevious);
// Do the calcs here
// 1. Advance time
varsNow.t = varsPrevious.t + tDelta;

varsNow.x = varsPrevious.x + 100;
varsNow.y = varsPrevious.y - 100;


varsAtStep[step] = varsNow;
}

//console.log("varsOriginal: ", varsOriginal);
//console.log("varsNow: " , varsNow);
//console.log("varsAtStep: " , varsAtStep);
//- END 2016-Jul-20 Brockman -----------------------------------------------------------


var originalY = 700;
var originalX = 0;
var originalV = 80;
var originalAy = -10;
var originalAx = 0;

var t = 0;
//Cannon angle.
var theta = Math.PI/4;
//Initial position.
var xi = originalX;
var yi = originalY;
//Initial velocity.
var v = originalV;
//Initial acceleration components.
var ax = originalAx;
var ay = originalAy;

// A clock.
function time() {
	t += .01; 
};


//These are parametric functions governing motion. This would come from the IWP XML file, user defined. 
function x(t) {

	var x = v*t*Math.cos(theta);
	return x;

};

function y(t) { 

	var y = 0.5*ay*Math.pow(t, 2) + v*t*Math.sin(theta) + yi;
	return y;

};

//Euler's method to refresh position over time.
function yView(y) {
	return viewBox.maxY -1*y;
};
function xView(x) {
	return x;
};
function move() {

	d3.selectAll("circle")
		.attr("cx", function(d) { return xView(x(t)); } )	  				
		.attr("cy", function(d) { return yView(y(t)); } ); 
	
	//Debugging Code
	/*(function () {
		console.log ("y position = " + d3.selectAll("circle").attr("cy"));
		console.log ("x position = " + d3.selectAll("circle").attr("cx"));
		console.log ("time = " + t)
	}) () ;*/

};	

//Set interval to renew position.
var trigger = null;			
var clock = null;
//Begins motion.
function start() {
	showReset();
	go();

}
//Restarts motion.
function go() {
	trigger = setInterval("move()", 1);
	clock = setInterval("time()", 10);
	digClock = setInterval("clockDisplay()", 100);
	document.getElementById("startStop").setAttribute("onclick", "stop()");
	document.getElementById("startStop").setAttribute("value", "Stop");
}

//Stops motion.					
function stop() {
//Stop move and time functions.
	clearInterval(trigger);
	clearInterval(clock);
	clearInterval(digClock);
	document.getElementById("startStop").setAttribute("onclick", "go()");
	document.getElementById("startStop").setAttribute("value", "Resume");
};

//Resets simulation.
function reset() {
	stop();
	d3.selectAll("circle")
		.attr("cx", function(d) { return xView(xi); })	  				
		.attr("cy", function(d) { return yView(yi); }); 
	t = 0;
	document.getElementById("startStop").setAttribute("value", "Start");
	document.getElementById("startStop").setAttribute("onclick", "start()");
	hideReset();
}
function showReset() {
	document.getElementById("reset").style.visibility = "visible";
	document.getElementById("startStop").setAttribute("colspan", "1");
	document.getElementById("addMe").style.visibility = "visible";
}
function hideReset() {
	document.getElementById("reset").style.visibility = "collapse";
	document.getElementById("startStop").setAttribute("colspan","2");
	document.getElementById("addMe").style.visibility = "collapse";
}
//Debugging Code
/*function check() {
	//console.log ("time = " + t);
	console.log ("x position = " + d3.selectAll("circle").attr("cx"));
	console.log ("y position = " + d3.selectAll("circle").attr("cy"));
}
setInterval(function () { check(); }, 1000);*/

//Where will the projectile land?
/*function impact() {

	var impactPosition = (v*Math.cos(theta)/ay)*(v*Math.sin(theta)+Math.sqrt(Math.pow(v,2)*Math.pow(Math.sin(theta),2)+2*ay*(yi-700)))-10;
	return impactPosition;

};*/

//Update display.
function clockDisplay () {
	
	var rounded = t.toFixed(2);	
	document.getElementById("digClock").innerHTML = rounded;

};

//Incremental playbar.
var playBarIncrement = .05;

function backTick() {
	stop();
	trigger = setInterval("move()", 1);
	digClock = setInterval("clockDisplay()", 100);
	document.getElementById("startStop").setAttribute("onclick", "go()");
	document.getElementById("startStop").setAttribute("value", "Resume");
	t -= playBarIncrement;
	//console.log("worked");
};
function forwardTick() {
	stop();
	trigger = setInterval("move()", 1);
	digClock = setInterval("clockDisplay()", 100);
	document.getElementById("startStop").setAttribute("onclick", "go()");
	document.getElementById("startStop").setAttribute("value", "Resume");
	t += playBarIncrement;
	//console.log("worked");
};
forwardTickButton = document.getElementById("forwardTick");
backTickButton = document.getElementById("backTick");

function arrowTick() {
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if (keyName === 'ArrowRight') {
		    // not alert when only Control key is pressed.
		    forwardTick();
		}
		else if (keyName === 'ArrowLeft') {
			backTick();
		}
		else {
			return;
		}
	}, false);
	window.addEventListener("keydown", function(e) {
	// space and arrow keys
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	  		e.preventDefault();
		}
	}, false);
}
arrowTick();

 
//Ugh... we need to make an object trail. Plan: create a data set with points and previous points, and apply it as the points atttribute for a polyline.
//https://www.dashingd3js.com/svg-paths-and-d3js2		
function applyTrail() {
	
	//Sample set of coordinates to create line.
	var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
	                 { "x": 40,  "y": 10}, { "x": 60,  "y": 25},
	                 { "x": 80,  "y": 15},  { "x": 100, "y": 30}];

	                 


	// THIS wil totally break
	// 2016-Jul-20
	lineData = varsAtStep;
console.log("linedata:241> ", lineData);

	//INSERT ITERATIVE FUNCTION OR EULER'S METHOD HERE
	for (i=0; i<6; i++) {
		var someX = x(i);
		console.log(someX);
	}
	//ALSO NEED FUNCTION TO INSERT DATA INTO DATA SET

	//Acesses data in array and extracts coordinates.
	var lineFunction = d3.svg.line()
								.x(function(d) { return d.x; })
								.y(function(d) { return d.y; })
								.interpolate("linear");
	var svgContainer = d3.select("svg")
	//Line path.
	var lineGraph = svgContainer.append("path")
								.attr("d", lineFunction(lineData))
								.attr("stroke", "blue")
								.attr("stroke-width", 2)
								.attr("fill", "none");

};
function resetValues() {
	yi = originalY;
	v = originalV;
	ay = originalAy;


	console.log("setting #input to: ", originalY );

	$("#input").val(originalY);
	$("#input2").val(originalV);
	$("#input3").val(originalAy);
	
	/*
	text1.value = originalY;
	text2.value = originalV;
	text3.value = originalAy;
	*/
	reset();
}
// Some elements of code must wait for HTML load to call elements - included below, and tied to html onload event.
function onloadFunction() {

	var text1 = document.getElementById("input");
	text1.addEventListener("input", function() {yi = +text1.value;});

	var text2 = document.getElementById("input2");
	text2.addEventListener("input", function() {v = +text2.value;});

	var text3 = document.getElementById("input3");
	text3.addEventListener("input", function() {ay = +text3.value;});

	var text4 = document.getElementById("input4");
	text4.addEventListener("input", function() {playBarIncrement = +text4.value;});

	addEventListener("input", function() {reset();});

	applyTrail();
};




