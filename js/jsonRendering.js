var time = {};
var description = "";
var iwindow = {};
var graphWindow = {};
var inputs = [];
var outputs = [];
var solids = [];
console.log("hello");

// "time": { "start": "0.0", "stop": "5.0", "change": "0.02",  "fps": "25.0" },
function setTime(inTime) { 
   console.log("time :", inTime);
   time = inTime;
}

// "description": { "text": "A ball is attached to a horizontal spring (not shown) which causes the ball to oscillate about the origin. Run the animation until it stops. Click on Show graph. \n\nWhich graph represents position vs. time?  How do you know?\nWhich graph represents velocity vs. time?  How do you know?\nWhich graph represents acceleration vs. time?  How do you know?\n\nWhat would a graph of net force on the ball vs. time look like?  Why?" 
function setDescription(inDescription) { 
   console.log("description :", inDescription);
   description = inDescription;
}

// "window": { "xmin": "-10.0", "xmax": "10.0", "ymin": "-10.0", "ymax": "10.0", "xgrid": "2.0", "ygrid": "1.0", "xunit": "meters", "yunit": "meters"
function setWindow(inWindow) { 
  console.log("window :", inWindow);
  iwindow = inWindow;
}


// "GraphWindow": { "xmin": "0.0", "xmax": "5.0", "ymin": "-50.0", "ymax": "50.0", "xgrid": "0.5", "ygrid": "10.0"
function setGraphWindow(inGraphWindow) {
  console.log("graphWindow :", inGraphWindow);
  graphWindow = inGraphWindow;
}


function addInput(input) { 
  console.log("input: ", input );
  // {name: "ar", text: "Amplitude", initialValue: "9.0", units: "m"}
  inputs.push( "<tr id='input_" + input.name + "' class='bottomBorder'><td><label for='"+ input.name +"'>"+ input.text +"</label></td><td><input id='" + input.name + "' type='text' value='" + input.initialValue + "'> " + input.units + "</td></tr>");
}

function addOutput(output) { 
  console.log("output ", output );

  // { "name": "axr", "text": "Acceleration", "units": "m/ss", "calculator": { "@attributes": { "type": "parametric" }, "value": "Red.xaccel" } }
  outputs.push( "<tr id='output_" + output.name + "' class='bottomBorder'><td><label for='"+ output.name +"'>"+ output.text +"</label></td><td><input id='" + output.name + "' type='text' value='-999'> " + output.units + "</td></tr>");
}

function addSolid(solid) { 
  //console.log("solid: ", solid );
  console.log("width: ", solid.shape.width.calculator.value);
  if (solid.shape["@attributes"].type == "circle") {
    console.log("it's a circle");
    solids.push( "<circle cx='500' cy='500' r=" +proportion(solid.shape.width.calculator.value)+ " style='fill:rgb(" +solid.color.red+ "," +solid.color.green+ "," +solid.color.blue+ ")'> " );
  }
  else if (solid.shape["@attributes"].type == "rectangle") {
    console.log("it's a rectangle");
    //solids.push( "<rect...
  }
  else if (solid.shape["@attributes"].type == "line") {
    console.log("it's a line")
    //solids.push( "<path d='M ...
  }
  else {
    return;
  };
}

function parseProblemToMemory( problem ) { 

  $("#authorUsername").html( problem.author.username );

  // Time
  setTime(problem.objects.time);

  // Description
  setDescription(problem.objects.description);

  // Window
  setWindow(problem.objects.window);

  // GraphWindow
  setGraphWindow(problem.objects.graphWindow);


  // Inputs - These could be an array OR a single item.
  if ( $.type ( problem.objects.input ) == 'array' ) { 
    $.each( problem.objects.input, function( index, input ) {
      addInput(input);
    });
  } else { 
    addInput(problem.objects.input);
  }

  // Output - These could be an array OR a single item.
  if ( $.type ( problem.objects.output ) == 'array' ) { 
    $.each( problem.objects.output, function( index, output ) {
      addOutput(output);
    });
  } else { 
    addOutput(problem.objects.output);
  }

  // Solids - These could be an array OR a single item.
  if ( $.type ( problem.objects.solid ) == 'array' ) { 
    $.each( problem.objects.solid, function( index, solid ) {
    addSolid(solid);
    });
  } else { 
    addSolid(problem.objects.solid);
  }
}

function renderProblemFromMemory() { 
  // Render from memory into page

  $("#digClock").html( time.start );
  $("#description").html( description.text );

//Debugging 29 Jul 2016
//console.log("setting xmin val: ", iwindow.xmin );
  $("#iwindow_xmin").val( iwindow.xmin );
  $("#iwindow_xmax").val( iwindow.xmax );
  $("#iwindow_xgrid").val( iwindow.xgrid );
  $("#iwindow_xunit").val( iwindow.xunit );
  $("#iwindow_ymax").val( iwindow.ymax );
  $("#iwindow_ymin").val( iwindow.ymin );
  $("#iwindow_ygrid").val( iwindow.ygrid );
  $("#iwindow_yunit").val( iwindow.yunit );

// GraphWindow is a TODO feature for now.
// $("#graphWindow").html( graphWindow );

  $("#variableTable").append("<tr><th colspan='2'>Inputs</th></tr>"+inputs+"<tr><th colspan='2'>Outputs</th></tr>"+outputs);
  //Moved to addSolidsToCanvas, 8 Aug 2016
  //$("#solids").html( solids.join(" ") );

  renderCanvasFromMemory();
  addSolidsToCanvas(solids);
};

var canvasBox = { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
function yCanvas(y) {
  var yDomain = iwindow.ymax - iwindow.ymin;
  yProportion = y / yDomain;
  yCorrected = yProportion + 0.5;
  cDomain = canvasBox.maxY - canvasBox.minY;
  cProportion = yCorrected * cDomain;
  return cProportion;
};

function xCanvas(x) {
// the proportional entry point in from window.xmin -> window.xmax needs to be interpolated into the 
// propotional exit point between viewbox.minX -> viewbox.maxX 
  var xDomain = iwindow.xmax - iwindow.xmin;
  xProportion = x / xDomain;

  // xProprotion is a value between -1 -> 1
  // xproprtion + 1 is a value between 0 -> 2

  xCorrected = xProportion + 0.5;

  //Debugging 29 Jul 2016
  //console.log("json:205: x:  ", x, "  xDomain: ", xDomain,  "  xProportion: ", xProportion, "  xCorrected: ", xCorrected );

  cDomain = canvasBox.maxX - canvasBox.minX;
  cProportion = xCorrected * cDomain;

  return cProportion;
};
function proportion(size) {
  var xDomain = iwindow.xmax - iwindow.xmin;
  var cDomain = canvasBox.maxX - canvasBox.minX;
  var proportion = cDomain/xDomain; 
  return size*proportion;
}

function addSolidsToCanvas(solids) {
  //console.log("solids: ", solids);
  console.log("solids: ", solids);
  //console.log("solids: ", )
  $("#canvas").append(solids);
  $("#canvasDiv").html($("#canvasDiv").html());
}
function renderCanvasFromMemory() { 
  var c = $("#canvas");
  // Parse viewbox attributes from canvas to override defaults.
  var canvasBoxAttrs = c[0].getAttribute("viewBox").split(" ");
  canvasBox= { minX: parseFloat(canvasBoxAttrs[0]), minY: parseFloat(canvasBoxAttrs[1]), maxX: parseFloat(canvasBoxAttrs[2]), maxY: parseFloat(canvasBoxAttrs[3]) };
  // To Render the window is that we start at the Xmin, and draw full vertial lines, 
  // increment by xgrid,
  // stopping at xmax
  // Add X gridlines -- TODO CONVERT TO A FOR LOOP
  /*Shifted to for loop, 7 Aug 2016:c.append( "<path d='M " + xCanvas(-8) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(-6) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(-4) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(-2) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(0) + " 0 V 1000' stroke='black' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(2) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(4) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(6) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  c.append( "<path d='M " + xCanvas(8) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
  */
  
  var xGridlines = (iwindow.xmax - iwindow.xmin)/iwindow.xgrid;
  for ( var interval = 1; interval <= xGridlines-1; interval ++ ) {
    var xGridPosition = (interval - xGridlines/2)*iwindow.xgrid;
    var coordinates = xCanvas(xGridPosition*iwindow.xgrid);;
    //console.log("whatItShouldBe: "+xCanvas(xGridPosition*iwindow.xgrid)+", coordinates: "+coordinates);
    if (xGridPosition == 0) {
      c.append( "<path d='M " + xCanvas(xGridPosition) + " 0 V 1000' stroke='black' fill='transparent'/>" );
    }
    else {
      c.append( "<path d='M " + xCanvas(xGridPosition) + " 0 V 1000' stroke='lightgray' fill='transparent'/>" );
    };
  };
  // Add Y gridlines
  var yGridlines = (iwindow.ymax - iwindow.ymin)/iwindow.ygrid;
  //Debugging 7 Aug 2016
  //console.log("yGridlines: "+yGridlines);
  for ( var interval = 1; interval <= yGridlines-1; interval ++ ) {
    var yGridPosition = (interval - yGridlines/2)*iwindow.ygrid;
    if (yGridPosition == 0) {
      c.append( "<path d='M 0 " + yCanvas(yGridPosition) + " H 1000' stroke='black' fill='transparent'/>" );
      //console.log("it's the origin");
    }
    else {
      c.append( "<path d='M 0 " + yCanvas(yGridPosition) + " H 1000' stroke='lightgray' fill='transparent'/>" );
      //console.log("it's not");
    };
  };

  // Blitting / Double buffering approach
  // redraw a single time!
  // http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
  $("#canvasDiv").html($("#canvasDiv").html());
};

//Hide and reveal windowSettings table.
function windowSettingsOn() {
	$("#iwindow").attr("style", "visibility:visible");
	$("#windowSettings").attr("onclick", "windowSettingsOff()");
};
function windowSettingsOff() {
	$("#iwindow").attr("style", "visibility:hidden");
	$("#windowSettings").attr("onclick", "windowSettingsOn()");
}
