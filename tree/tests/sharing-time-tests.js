/*
qunit tests for rt collab genealogy chart
*/


$(document).ready(function() {

	TestSupport.call(this);
	var self = this;
	self.init(self.basicData);
		
	test('script loaded and data initialized', function() {
		ok(self.sharingTime, 'script loaded');
		ok(self.focus, 'data initialized');
	});
	
	test('spouse', function() {
		var s = self.sharingTime.findSpouse(self.focus.id);
		equals(s.id, 1, 'spouse id');
		equals(s.fn, 'Lydia', 'spouse firstname');
		
		var jared = self.sharingTime.findPerson(0);
		equals(jared.fn, 'Jared', "Jared's name");
		equals(jared.spouse.fn, 'Lydia', "Jared's spouse's name");
		
		var lydia = self.sharingTime.findPerson(1);
		equals(lydia.fn, 'Lydia', "lydia's name");
		equals(lydia.spouse.fn, 'Jared', "Lydia's spouse's name");
	});
	
	test('parents', function() {
		var p = self.sharingTime.findParents(self.focus.id);
		ok(p.father, 'father exists');
		ok(p.mother, 'mother exists');
	});
	
	test('parents that do not exist', function() {
		var joseph = self.sharingTime.findPerson(38);
		ok(joseph, 'target person exists');
		var p = self.sharingTime.findParents(joseph.id);
		ok(p.father == null, 'father does not exist');
		ok(p.mother == null, 'mother does not exist');	
	});
	
	test('ancestors', function() {
		var john = self.sharingTime.findPerson(6);   	// John Carter
		var sarah = self.sharingTime.findPerson(7);		// Sarah waterous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		var ja = self.sharingTime.findAncestors(john.id);
		equals(ja.length, 6, 'john has 6 people in his ancestor list');
		var sa = self.sharingTime.findAncestors(sarah.id);
		equals(sa.length, 4, 'sarah has 4 people in her ancestor list');
	});
	
	test('descendants', function() {
		var john = self.sharingTime.findPerson(6);   	// John Carter
		var sarah = self.sharingTime.findPerson(7);		// Sarah waterous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		var ja = self.sharingTime.findDescendants(john.id);
		equals(ja.length, 5, 'john has 5 people in his descendant list');
		equals(ja[0].fn, "Gideon", "Gideon is John's first descendant");
		var sa = self.sharingTime.findDescendants(sarah.id);
		equals(sa.length, 5, 'sarah has 5 people in her descendant list');
	});
		
	test('lineage list', function() {
		var john = self.sharingTime.findPerson(6);  //john carter
		var sarah = self.sharingTime.findPerson(7);   // sarah waterhous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		jl = self.sharingTime.findLineageList(john);
		equals(jl.people.length, 11, 'john has 11 people in his lineage');
		sl = self.sharingTime.findLineageList(sarah);
		equals(sl.people.length, 9, 'sarah has 9 people in her lineage');
		// relationships in the lineage
		equals(jl.relationships.length, 11, 'john has 11 relationships in his lineage');
		equals(sl.relationships.length, 9, 'sarah has 9 relationships in her lineage');
		
		// jared carter
		var jared = self.sharingTime.findPerson(0);
		var jal = self.sharingTime.findLineageList(jared);
		equals(jal.relationships.length, 16, 'jared has 16 relationships in his lineage');
		// lydia
		var lydia = self.sharingTime.findPerson(1);
		var lal = self.sharingTime.findLineageList(lydia);
		equals(lal.relationships.length, 26, 'lydia has 26 relationships in her lineage');
	});
		
	test('children', function() {
		var gideon = self.sharingTime.findPerson(2);
		equals(gideon.children.length, 2, "Gideon Carter has two children");
		var johanna = self.sharingTime.findPerson(3);
		equals(johanna.children.length, 2, "Johanna Sims has two children");
	});
	
	test('script loaded and data initialized', function() {
		equals(self.sharingTime.getPeopleCount(), 43, "43 people in the tree");
	});
		
	test('basic appending data', function() {
		var updated = false;
		self.sharingTime.addListener({
			chartUpdated : function(data) {
				updated = true;
			}
		});
		self.sharingTime.append(self.extensionData);
		equals(self.sharingTime.getPeopleCount(), 49, "49 people in the tree after appending");
		equals(updated, true, "update event was fired");
		equals(self.sharingTime.getFocus().id, 30, "focus person was updated");
	});			
});