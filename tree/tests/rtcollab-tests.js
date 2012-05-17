/*
qunit tests for rt collab genealogy chart
*/
var data = {
focus:0,
people:[
        
     // new for 07/27/10, working on the bowtie chart.  these are descendants of Jared and Lydia.
    {id:2001, fn:'Rebecca', sn:'Carter', s:'F', f:0, m:1, sp:null},
    {id:2001, fn:'Abraham', sn:'Carter', s:'M', f:0, m:1, sp:null},
             
	{id:10020, fn:'Joseph', sn:'Carter', s:'M', f:2, m:3, sp:null},  // gideon and johanna are parents, no spouse.  Joseph is Jared's brother in this scenario.

	{id:0, fn:'Jared', sn:'Carter', s:'M', f:2, m:3, sp:1},
	{id:1, fn:'Lydia', sn:'Ames', s:'F', f:4, m:5, sp:0},
		
	{id:2, fn:'Gideon', sn:'Carter', s:'M', f:6, m:7, sp:3},
	{id:3, fn:'Johanna', sn:'Sims', s:'F', f:null, m:null, sp:2},	
		
	{id:6, fn:'John', sn:'Carter', s:'M', f:12, m:13, sp:7},
	{id:7, fn:'Sarah', sn:'Waterous', s:'F', f:14, m:15, sp:6},  
	
	{id:12, fn:'John', sn:'Carter', s:'M', f:16, m:17, sp:13},
	{id:13, fn:'Sarah', sn:'Nettleton', s:'F', f:18, m:19, sp:12},   
	
	{id:14, fn:'Gideon', sn:'Waterhouse', s:'M', f:20, m:21, sp:15},
	{id:15, fn:'Rebecca', sn:'Waterhouse', s:'F', f:null, m:null, sp:14},   
	
	{id:16, fn:'Robert', sn:'Carter', s:'M', f:null, m:null, sp:17},
	{id:17, fn:'Hannah', sn:'Lucas', s:'F', f:null, m:null, sp:16},
	
	{id:18, fn:'Joseph', sn:'Nettleton', s:'M', f:null, m:null, sp:19},
	{id:19, fn:'Sarah', sn:'Woodmansee', s:'F', f:null, m:null, sp:18},
	
	{id:20, fn:'Abraham II', sn:'Waterhouse', s:'M', f:null, m:null, sp:21},
	{id:21, fn:'Hannah', sn:'Stark', s:'F', f:null, m:null, sp:20},  
	
		
	
	{id:4, fn:'Ithamer', sn:'Ames', s:'M', f:8, m:9, sp:5},
	{id:5, fn:'Hannah', sn:'Clark', s:'F', f:10, m:11, sp:4},
	
	{id:8, fn:'Joseph', sn:'Ames', s:'M', f:22, m:23, sp:9},
	{id:9, fn:'Elizabeth', sn:'Parker', s:'F', f:24, m:25, sp:8},            
	
	{id:10, fn:'William', sn:'Clarke', s:'M', f:26, m:27, sp:11},
	{id:11, fn:'Betsy', sn:'Rogers', s:'F', f:28, m:29, sp:10},						
			
	{id:22, fn:'William IV', sn:'Ames', s:'M', f:30, m:31,sp:23},
	{id:23, fn:'Elizabeth', on:'D', sn:'Jennings', s:'F', f:32, m:33, sp:22},       
	
	{id:24, fn:'Jesse', on:'Thomas', sn:'Parker', s:'M', f:null, m:null, sp:25},
	{id:25, fn:'Bathsheba', sn:' ', s:'F', f:null, m:null, sp:24},
	
	{id:26, fn:'Samuel', sn:'Clarke', s:'M', f:34, m:35, sp:27},
	{id:27, fn:'Hannah', sn:'Wilcox', s:'F', f:36, m:37, sp:26},  
	
	{id:28, fn:'Joseph', sn:'Rogers', s:'M', f:38, m:39, sp:29},
	{id:29, fn:'Diadema', sn:'Beckwith', s:'F', f:null, m:null, sp:28},
	
	{id:30, fn:'Williams', sn:'Ames', s:'M', f:null, m:null, sp:31},
	{id:31, fn:'Mary', on:'D', sn:'Hayward', s:'F', f:null, m:null, sp:30},
	
	{id:32, fn:'Richard', sn:'Jennings', s:'M', f:null, m:null, sp:33},
	{id:33, fn:'Mary', sn:'Bassett', s:'F', f:null, m:null, sp:32},
	
	{id:34, fn:'Jeremiah', sn:'Clarke', s:'M', f:null, m:null, sp:35},
	{id:35, fn:'Ann', sn:'Audley', md:'Odlin', s:'F', f:null, m:null, sp:34},
	
	{id:36, fn:'Daniel Jr', sn:'Wilcox', s:'M', f:null, m:null, sp:37},
	{id:37, fn:'Hannah', sn:'Cooke', s:'F', f:null, m:null, sp:36},
	
	{id:38, fn:'Joseph', sn:'Rogers', s:'M', f:null, m:null, sp:39},
	{id:39, fn:'Diadema', sn:'Beckwith', s:'F', f:null, m:null, sp:38} 
]};

$(document).ready(function() {

	var _addDiv = function(id, parent) {
		var d1 = document.createElement("div");
		parent.appendChild(d1);
		$(d1).attr("id", id);
		return d1;
	};
	
	var familySearch = FamilySearch.getInstance(data);
	var focus = familySearch.getFocus();
	
	test('script loaded and data initialized', function() {
		ok(familySearch, 'script loaded');
		ok(focus, 'data initialized');
	});
	
	test('spouse', function() {
		var s = familySearch.findSpouse(focus.id);
		equals(s.id, 1, 'spouse id');
		equals(s.fn, 'Lydia', 'spouse firstname');
		
		var jared = familySearch.findPerson(0);
		equals(jared.fn, 'Jared', "Jared's name");
		equals(jared.spouse.fn, 'Lydia', "Jared's spouse's name");
		
		var lydia = familySearch.findPerson(1);
		equals(lydia.fn, 'Lydia', "lydia's name");
		equals(lydia.spouse.fn, 'Jared', "Lydia's spouse's name");
	});
	
	test('parents', function() {
		var p = familySearch.findParents(focus.id);
		ok(p.father, 'father exists');
		ok(p.mother, 'mother exists');
	});
	
	test('parents that do not exist', function() {
		var joseph = familySearch.findPerson(38);
		ok(joseph, 'target person exists');
		var p = familySearch.findParents(joseph.id);
		ok(p.father == null, 'father does not exist');
		ok(p.mother == null, 'mother does not exist');	
	});
	
	test('ancestors', function() {
		var john = familySearch.findPerson(6);   	// John Carter
		var sarah = familySearch.findPerson(7);		// Sarah waterous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		var ja = familySearch.findAncestors(john.id);
		equals(ja.length, 6, 'john has 6 people in his ancestor list');
		var sa = familySearch.findAncestors(sarah.id);
		equals(sa.length, 4, 'sarah has 4 people in her ancestor list');
	});
	
	test('descendants', function() {
		var john = familySearch.findPerson(6);   	// John Carter
		var sarah = familySearch.findPerson(7);		// Sarah waterous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		var ja = familySearch.findDescendants(john.id);
		equals(ja.length, 5, 'john has 5 people in his descendant list');
		equals(ja[0].fn, "Gideon", "Gideon is John's first descendant");
		var sa = familySearch.findDescendants(sarah.id);
		equals(sa.length, 5, 'sarah has 5 people in her descendant list');
	});
		
	test('lineage list', function() {
		var john = familySearch.findPerson(6);  //john carter
		var sarah = familySearch.findPerson(7);   // sarah waterhous
		ok(john, 'john exists'); ok(sarah, 'sarah exists');
		jl = familySearch.alternateFindLineageList(john);
		equals(jl.people.length, 11, 'john has 11 people in his lineage');
		sl = familySearch.alternateFindLineageList(sarah);
		equals(sl.people.length, 9, 'sarah has 9 people in her lineage');
		// relationships in the lineage
		equals(jl.relationships.length, 11, 'john has 11 relationships in his lineage');
		equals(sl.relationships.length, 9, 'sarah has 9 relationships in her lineage');
		
		// jared carter
		var jared = familySearch.findPerson(0);
		var jal = familySearch.alternateFindLineageList(jared);
		equals(jal.relationships.length, 16, 'jared has 16 relationships in his lineage');
		// lydia
		var lydia = familySearch.findPerson(1);
		var lal = familySearch.alternateFindLineageList(lydia);
		equals(lal.relationships.length, 26, 'lydia has 26 relationships in her lineage');
	});
		
	test('children', function() {
		var gideon = familySearch.findPerson(2);
		equals(gideon.children.length, 2, "Gideon Carter has two children");
		var johanna = familySearch.findPerson(3);
		equals(johanna.children.length, 2, "Johanna Sims has two children");
	});
	
	// ************** UI tests ****************************************************
	
	var cc = _addDiv("chartContainer", document.body);
	var c = _addDiv("chart", cc);
	var w = _addDiv("wait", cc);
	
	jsPlumb.Defaults.Anchors = [jsPlumb.Anchors.RightMiddle, jsPlumb.Anchors.LeftMiddle ];
	jsPlumb.Defaults.Connector = new jsPlumb.Connectors.Bezier(50);
	jsPlumb.Defaults.PaintStyle = { lineWidth:2, strokeStyle:'gray'};
	var highlightPaintStyle = { lineWidth:2, strokeStyle:'#fff9b5' };
	jsPlumb.Defaults.Endpoint = new jsPlumb.Endpoints.Dot({radius:3});
	jsPlumb.Defaults.Container = 'chart';
	jsPlumb.setDraggableByDefault(false);
	
	var ui = new FamilySearchUI();
	ui.initialize(familySearch, {
		chartDiv : "chart",
		chartContainer : "chartContainer",					
		chartType:'ancestor',
		orientation:'horizontal',
		defaults:{						
			highlightPaintStyle:{ lineWidth:4, strokeStyle:'#fff9b5' } // this is for highlighting connectors
		}
	});
	
	test('ui setup', function() {
		ok(ui != null, "ui exists");
	});
	
	test("document elements", function() {
		var w = $("#chart").children();
		equals(w.length, 161, "161 doc elements");
	
	});
	
	test('blank couples were created', function() {
		var b = $(".blank-couple");
		equals(b.length, 21, "21 blank couples");
	});
});