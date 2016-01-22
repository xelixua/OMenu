describe("OMeny", function () {
	beforeEach(function () {
		setFixtures('<html>' +
	'<head>' +
		'<title>OMenu test page</title>' +
		'<meta charset="utf-8">' +
		'<link rel="stylesheet" href="omenu.css"/>' +
		'<script src="omenu.js"></script>' +
	'</head>' +
	'<body>' +
		'<div id="testDiv" style="position: absolute; top:200px; left:400px; width:200px; height: 200px; background: blue;">Target</div>' +
		'<div id="controlDiv" style="position: absolute; width:50px; height: 50px; background: red;">Move target</div>' +
		'<script src="testScript.js"></script>' +
	'</body>' +
'</html>');
		});
	
	it("calculates correct items coordinates", function () {
		var testDiv = document.getElementById("testDiv"),
		testMenu = O.forElement(testDiv);
		testMenu.action("pen").does(function() {});
		testMenu.action("pen").does(function() {});
		testMenu.action("pen").does(function() {});
 		testMenu.action("pen").does(function() {});
		testMenu.show();
		testMenu.hide();
		var itemsCoordinates = testMenu.getItemsCoords();
		expect(itemsCoordinates).toEqual([
			{pLeft:277,
			 pTop:282},
			 {pLeft:482,
			 pTop:77},
			 {pLeft:687,
			 pTop:282},
			 {pLeft:483,
			 pTop:487}]);
	});

});