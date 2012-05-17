$(document).ready(function() {
		
	module("sharing-time-ui");
	
	TestSupport.call(this);
	var self = this;
	self.init(self.basicData);
	self.initUI();
	
	/*test("document elements", function() {
		var w = $("#chart").children();
		equals(w.length, 161, "161 doc elements");
	
	});*/
	
	test('blank couples were created', function() {
		var b = $(".blank-couple");
		equals(b.length, 21, "21 blank couples");
	});
		
	test('basic appending data', function() {
		var updated = false;
		self.sharingTime.addListener({
			chartUpdated : function(data) {
				updated = true;
			}
		});
		self.sharingTime.update(self.extensionData);
	//	equals(self.sharingTime.getPeopleCount(), 49, "49 people in the tree after appending");
		equals(updated, true, "update event was fired");
		equals(self.sharingTime.getFocus().id, 30, "focus person was updated");
	});
	

});