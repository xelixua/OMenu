/**
 *OMenu - mini-framework for creating menu around element
 * with arbitrary elements 
 * @author Sergey Maksimenko
 */

var O = (function () {
	"use strict";
	
	var O = {}, // main object for creating and managing menus
		OMenus = {},
		ICON_DIAMETER = 36,
		RADIUS_INCR = 5, //value to add to radius if icons intersect
		MAX_MENU_DISTANCE_FROM_BORDER = 200,
		SUBINCON_OFFSET = ICON_DIAMETER + 10;
		
		//inner classes
		function Item(iconName) { //one item object
			var icon = iconName,
				top,
				left,
				index,
				action, //callback to perform when clicking the item
				url; //url to open when clicking the item
				
			//public interface
			this.does = function (callback) {
				if(typeof callback !== "function") {
					throw new Error("does() needs to be provided with function argument"); 
				}
				//TODO handle callback invocation in icon click
			};
			
			this.goesTo = function (url) {
				this.url = url;
				//TODO handle url parsing and following at icon click
			};
			
			this.top = top;
			this.left = left;
			this.icon = icon;
			this.index = index;
		}
		function OMenu (targetElement) { //one menu object
			var target = targetElement,
				lastKnownTargetTop,
				lastKnownTargetLeft,
				items = [],
				itemsCoords = [],
				bR,
				center,
				biggestDim,
				circleParams = {},
				calculateBasicParams = function () {
					lastKnownTargetTop = target.offsetTop,
					lastKnownTargetLeft = target.offsetLeft,
					bR = target.getBoundingClientRect();
					center = {
						top: Math.ceil(bR.top + bR.height/2),
						left:Math.ceil(bR.left +  bR.width/2)
					};
					biggestDim = bR.height > bR.wight? bR.height : bR.width;
					circleParams = {
						biggestDim: biggestDim,
						radius: biggestDim + RADIUS_INCR
					};
				},
				recalculateCircle = function () {
					circleParams.radDist = items.length < 2 ? 1.57 : 2*Math.PI/items.length;
					circleParams.radDistSin = Math.abs(Math.sin(circleParams.radDist/2));
					circleParams.biggestDim = bR.height > bR.wight? bR.height : bR.width;
					circleParams.radius = circleParams.biggestDim + RADIUS_INCR;
					circleParams.twoPointsDist = 2*circleParams.radius*circleParams.radDistSin;
					
					//correcting radius to prevent items intersection
					while((circleParams.radius < circleParams.biggestDim + MAX_MENU_DISTANCE_FROM_BORDER) && circleParams.twoPointsDist <= ICON_DIAMETER + SUBINCON_OFFSET * 2 ) {
						circleParams.radius += RADIUS_INCR;
						circleParams.twoPointsDist = 2*circleParams.radius*circleParams.radDistSin;
					}
					
					if(circleParams.twoPointsDist < ICON_DIAMETER){
						throw Error("Impossible to draw menu with so many items. Please, reduce actions");
					}
										
					var canvDim = circleParams.radius*2.2,
						canvL = center.left - canvDim/2,
						canvT = center.top - canvDim/2;
						
					canvas.setAttribute("style", "position: absolute; top: " +  canvT + "px; left: " +  canvL + "px;");
					canvas.setAttribute("height", canvDim);
					canvas.setAttribute("width", canvDim);
				},
				canvas = document.createElement("canvas");
				document.body.appendChild(canvas);
		
			calculateBasicParams();
			recalculateCircle();	
					
			/*
			 * "throws" icons from center of element to the circle around element
			 */
			function showMenu () {
				if(items.length === 0) {
					throw new Error("No actions in menu. Create actions first");
				}								
				function drawLine(index) {
					var canvas = document.getElementsByTagName("canvas")[0],
						canvasTop = canvas.offsetTop,
						canvasLeft = canvas.offsetLeft,
						toTop = itemsCoords[index].pTop - canvasTop + ICON_DIAMETER/2,
						toLeft = itemsCoords[index].pLeft - canvasLeft + ICON_DIAMETER/2,
						controlTop,
						controlLeft,
						context = canvas.getContext("2d");    
						 
					if(index < items.length - 1){
						controlTop = itemsCoords[index+1].pTop - canvasTop;
						controlLeft = itemsCoords[index+1].pLeft;
					} else {
						controlTop = itemsCoords[0].pTop - canvasTop;
						controlLeft = itemsCoords[0].pLeft - canvasLeft;
					}    
					  
					context.beginPath();     
					context.moveTo(canvas.width/2, canvas.height/2);    //canvas center                   
					context.quadraticCurveTo(controlLeft/2, controlTop/2, toLeft, toTop);
					context.lineTo(toLeft, toTop);
					context.lineWidth = 2;                                                 
					context.strokeStyle = "green";                 
					context.stroke();
				}
				
				//calculating item coordinates
				if(itemsCoords.length === 0){
					items.forEach(function(item, index){
						var left = Math.ceil(center.left - (Math.cos(index*circleParams.radDist)*circleParams.radius)) - ICON_DIAMETER/2,
							top = Math.ceil(center.top - (Math.sin(index*circleParams.radDist)*circleParams.radius)) - ICON_DIAMETER/2;
						itemsCoords.push({
							pLeft: left,
							pTop: top
						});
					});
				}
				
				//drawing items
				items.forEach(function (item, index) {
					var actionIcon = document.createElement("div"),
						subIcon1 = document.createElement("div"),
						subIcon2 = document.createElement("div"),
						left = itemsCoords[index].pLeft,
						top = itemsCoords[index].pTop;
						
						actionIcon.setAttribute("class", "OMenuItem icon " + item.icon);
						actionIcon.setAttribute("style", "top: " + top + "px; left: " + left + "px;");
						document.body.appendChild(actionIcon);
						drawLine(index);
						
						subIcon1.setAttribute("class", "OMenuItem icon camera");
						subIcon1.setAttribute("style", "top: " + top + "px; left: " + left + "px;");
						document.body.appendChild(subIcon1);
						
						subIcon2.setAttribute("class", "OMenuItem icon trash");
						subIcon2.setAttribute("style", "top: " + top + "px; left: " + left + "px;");
						document.body.appendChild(subIcon2);
						
						actionIcon.addEventListener("mouseover", function (event) {
							var animationPlayState = subIcon1.style.MozAnimationPlayState || subIcon1.style.webkitAnimationPlayState;
							if(animationPlayState === "running") return; 
							if(typeof this.hideSubsTimer !== "undefined") clearTimeout(this.hideSubsTimer);
							subIcon1.setAttribute("style", "top: " + top + "px; left: " + (left - SUBINCON_OFFSET) + "px;");
							subIcon2.setAttribute("style", "top: " + top + "px; left: " + (left + SUBINCON_OFFSET) + "px;");
						});
						
						actionIcon.addEventListener("mouseout", function (event) {
							actionIcon.hideSubsTimer = setTimeout(function () {
								subIcon1.setAttribute("style", "top: " + top + "px; left: " + left + "px;");
								subIcon2.setAttribute("style", "top: " + top + "px; left: " + left + "px;");	
							}, 500);
						});
				});
			}
						
			function hideMenu () {
				var items = document.getElementsByClassName("OMenuItem"),
					limit = items.length,
					context = canvas.getContext("2d");
				while(items.length > 0){
					var item = items[items.length-1];
					item.parentElement.removeChild(item);
				}
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
			
			canvas.addEventListener("mouseover", showMenu);
			canvas.addEventListener("mouseout", function (event) {
					//check if we're on action icon
					if(event.relatedTarget === null || event.relatedTarget.getAttribute("class") === null || event.relatedTarget.getAttribute("class").indexOf("OMenuItem") === -1 ) hideMenu();
				});
			
			//public interface		
			this.show = showMenu;
			this.hide = hideMenu;
			this.getItemsCoords = function () {
				return itemsCoords;
			};
			this.action = function (iconName) {
				var item = new Item(iconName);
				items.push(item);
				recalculateCircle();
				
				return item;
			};
			
			//redraws menu if target changed it's position
			setInterval(function(){
				if(target.offsetLeft !== lastKnownTargetLeft || target.offsetTop !== lastKnownTargetTop){
					console.log("element changed position!");
					hideMenu();
					itemsCoords.length = 0;
					calculateBasicParams();
					recalculateCircle();
				}
			}, 2000);
			return this;
		} 
		
		O.forElement = function (targetElement) { //creating new menu for target element
			var menu;
			if(typeof OMenus[targetElement] === 'undefined'){
				menu = new OMenu(targetElement);
				OMenus[targetElement] = menu;
			} else {
				menu = OMenus[targetElement];
			}
			
			return menu;
		};
	return O;
}());
