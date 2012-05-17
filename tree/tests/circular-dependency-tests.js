/*
qunit tests for rt collab genealogy chart
*/

$(document).ready(function() {
	
	var d = {
		"focus":0,
		"people" : [
		    {"id":0, "fn":"Anthony", "sp":1, "s":"M", "f":2 },
		    {"id":1, "fn":"Mary", "sp":0, "s":"F" },
		    {"id":2, "fn":"David", "sp":4, "s":"M", "f":0 },		    		          
		    {"id":4, "fn":"Andrea", "sp":2, "s":"F" }		         
		]		          
	};

	TestSupport.call(this);
	var self = this;
	
	self.init(d);
	self.initUI();
	
	test("correct number of people loaded", function() {
		equals(self.sharingTime.getPeopleCount(), 8, "8 people loaded");
	});
	
	test("chart loading, ancestor chart", function() {
		var anthony = self.sharingTime.findPerson(0);
		var mary = self.sharingTime.findPerson(1);
		equals(mary.id, 1, "mary's id is 1");
		ok(anthony != null, "anthony exists");		
		ok(mary != null, "mary exists");
		equals(mary.spouse.id, anthony.id, "mary's spouse is anthony");
		equals(anthony.spouse.id, mary.id, "anthony's spouse is mary");
		
		var david = self.sharingTime.findPerson(2);
		var lucy = self.sharingTime.findPerson(3);
		var andrea = self.sharingTime.findPerson(4);
		
		equals(andrea.spouse.id, david.id, "andrea's spouse is david");
		equals(andrea.spouse.id, david.id, "david's spouse is andrea");
	});	
});