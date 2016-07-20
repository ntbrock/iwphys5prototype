var originalY = 700;
var originalX = 0;
var originalV = 80;
var originalAy = 10;
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

	var y = 0.5*ay*Math.pow(t, 2) - v*t*Math.sin(theta) + yi;
	return y;

};

//Euler's method to refresh position over time.

function move() {

	d3.selectAll("circle")
		.attr("cx", function(d) { return x(t); } )	  				
		.attr("cy", function(d) { return y(t); } ); 
	
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
		.attr("cx", function(d) { return xi; })	  				
		.attr("cy", function(d) { return yi; }); 
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
function applyTrail() {
	
	//Sample set of coordinates to create line.
	var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
	                 { "x": 40,  "y": 10}, { "x": 60,  "y": 25},
	                 { "x": 80,  "y": 15},  { "x": 100, "y": 30}];

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

	function resetValues() {
		yi = originalY;
		v = originalV;
		ay = originalAy;
		text1.value = originalY;
		text2.value = originalV;
		text3.value = originalAy;
		reset();
	}

	applyTrail();
};




