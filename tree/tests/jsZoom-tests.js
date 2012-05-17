$(document).ready(function() {

	module("jsZoom", {
		setup : function() {
			var div = document.createElement("div");
			div.id = "aDiv";	
			document.body.appendChild(div);
		},
		teardown:function() { $("#aDiv").remove(); } 
	});
			
	test("zoom is 1 on uninitialised element", function() {
		var z = jsZoom.get($("#aDiv"));	
		equals(z, 1, "zoom was retrieved correctly");
	});
	
	test("setting and getting a zoom", function() {	
		jsZoom.set($("#aDiv"), 0.5);
		var z = jsZoom.get($("#aDiv"));	
		equals(z, 0.5, "zoom was retrieved correctly");
	});
	
	test("getting div dimensions", function() {
		$("#aDiv").width(500);
		$("#aDiv").height(500);
		jsZoom.set($("#aDiv"), 0.5);
		var w = $("#aDiv").outerWidth(), h = $("#aDiv").outerHeight();
		equals(w, 500, "reported width is 500");
		equals(h, 500, "reported height is 500");
		var zw = jsZoom.outerWidth($("#aDiv"));
		equals(zw, 250, "jsZoom reported width is 250");
		var zh = jsZoom.outerHeight($("#aDiv"));
		equals(zh, 250, "jsZoom reported height is 250");
	});
	
	test("getting div offset", function() {
		jsZoom.set($("#aDiv"), 1);
		var o = $("#aDiv").offset();
		var zo = jsZoom.offset($("#aDiv"));
		equals(zo.left, o.left, "at zoom 1 offset left ok");
		equals(zo.top, o.top, "at zoom 1 offset top ok");
		jsZoom.set($("#aDiv"), 0.7);
		zo = jsZoom.offset($("#aDiv"));
		
		// what should the offset be? zooms on centerpoint, so let's get that
		//var l = o.left + ($("#aDiv").outerWidth() * 0.7) - (jsZoom.outerWidth($("#aDiv")) *0.7 / 2), t = o.top + ($("#aDiv").outerHeight() * 0.7 - (jsZoom.outerHeight($("#aDiv")) / 2));
		var l = o.left + ($("#aDiv").outerWidth() * (1 - 0.7) / 2), t = o.top + ($("#aDiv").outerHeight() * (1 - 0.7) / 2);
		equals(parseInt(zo.left), parseInt(l), "at zoom 0.5 offset left ok");
		equals(parseInt(zo.top), parseInt(t), "at zoom 0.5 offset top ok");
		
		jsZoom.set($("#aDiv"), 1.5);
		zo = jsZoom.offset($("#aDiv"));
		
		var l = o.left - ($("#aDiv").outerWidth() * (1.5 - 1) / 2) /*+ (jsZoom.outerWidth($("#aDiv")) / 2)*/, t = o.top - ($("#aDiv").outerHeight() * (1.5 - 1) / 2) /*+ (jsZoom.outerHeight($("#aDiv")) / 2)*/;
		equals(parseInt(zo.left), parseInt(l), "at zoom 1.5 offset left ok");
		equals(parseInt(zo.top), parseInt(t), "at zoom 1.5 offset top ok");
	});
	
	test("setting div offset", function() {
		//jsZoom.set($("#aDiv"), 0.7);
		var o = $("#aDiv").offset(); 
		var zo = jsZoom.offset($("#aDiv"));
		// we now have the two offsets, one that is the browser's view, and the other is the correct view.
		// if we set the browser's view back as the offset and then run those two again, the results should be equal.
		jsZoom.offset($("#aDiv"), zo);
		var o2 = $("#aDiv").offset();
		equals(o2.left, o.left, "left is the same");
		equals(o2.top, o.top, "top is the same");
		
		jsZoom.offset($("#aDiv"), {left:zo.left / 2, top:zo.top/2});
		var o3 = $("#aDiv").offset();
		equals(o3.left, o.left/2, "left is the same");
		equals(o3.top, o.top/2, "top is the same");
	});
	
	/*$("#aDiv").css("background-color","red");
	$("#aDiv").css("opacity","0.5");*/
});