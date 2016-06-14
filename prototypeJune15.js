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
	document.getElementById("bottomRow").setAttribute("colspan", "1");
	document.getElementById("addMe").style.visibility = "visible";
}
function hideReset() {
	document.getElementById("reset").style.visibility = "collapse";
	document.getElementById("bottomRow").setAttribute("colspan","2");
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
function impact() {

	var impactPosition = (v*Math.cos(theta)/ay)*(v*Math.sin(theta)+Math.sqrt(Math.pow(v,2)*Math.pow(Math.sin(theta),2)+2*ay*(yi-700)))-10;
	return impactPosition;

};

//Update display.
function clockDisplay () {
	
	var rounded = t.toFixed(2);	
	document.getElementById("digClock").innerHTML = rounded;

};

function resetValues() {
	text1.value = originalY
	text2.value = originalV
	text3.value = originalAy
}




