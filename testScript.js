/*
 * Test page to see it's working
 */
(function(){
	var testDiv = document.getElementById("testDiv"),
		testMenu = O.forElement(testDiv);
	testMenu.action("pen").does(function() {
	});
	testMenu.action("pen").does(function() {
	});
	testMenu.action("pen").does(function() {
	});
 	testMenu.action("pen").does(function() {
	});
	testMenu.show();
	testMenu.getItemsCoords();
	
	document.getElementById("controlDiv").addEventListener("click", function(){
		testDiv.setAttribute("style", "position: absolute; top:200px; left:700px; width:200px; height: 200px; background: blue;");
	});
}());
