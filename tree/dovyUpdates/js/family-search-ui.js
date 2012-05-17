(function() {
	
	var familySearch = null, focus = null; 
	// UI functions. replace with micro templates.
	var _personStyles = { 
			'fullname' : function(p) { 
				return "<div id='person_" + p.id + "' class='" + ('M' == p.s ? "male" : 'female') + " individual' rel='"+p.id+"'><span>&nbsp;</span>" + p.fn + ' ' + p.sn.toUpperCase() +'<div id="options_'+p.id+'" style="display: none;">This is a tip</div></div>'; 	
			},
			'withspouse' : function(p) {
				var s = p.sp ? familySearch.findPerson(p.sp) : null;
				var r = _personStyles['fullname'](p);
				if (s) r += _formatPerson(s, 'fullname');
				return r;
			},
			'married to' : function(p) {
				var s = p.sp ? familySearch.findPerson(p.sp) : null;
				if (s) return 'Spouse: ' + _formatPerson(s, 'fullname');
				return '';
			},
			'father' : function(p) {
				if (p.f != null) {
					return 'Father: ' + _formatPerson(familySearch.findPerson(p.f), 'fullname');
				}
				return '';
			},
			'mother' : function(p) {
				if (p.m != null) {
					return 'Mother: ' + _formatPerson(familySearch.findPerson(p.m), 'fullname');
				}
				return '';
			},
			'children' : function(p) {
				var o = familySearch.findOffspring(p.id);
				if (o && o.length > 0) {
					var t = 'Children :<br/>';
					for (var i = 0; i < o.length; i++)
						t = t + '  ' + _formatPerson(o[i], 'fullname') + "<br/>";
					return t;
				}
				return ' - no children - ';
			},
			'all' : function(p) {				
				var r = 'Name :' + _formatPerson(p, 'fullname') + "<br/>";
				r = r + _formatPerson(p, 'married to') + "<br/>";
				r = r + _formatPerson(p, 'father') + "<br/>";
				r = r + _formatPerson(p, 'mother') + "<br/>";
				r = r + _formatPerson(p, 'children') + "<br/>";
				return r;
			}
	};
	var _formatPerson = function(person, style) {		
		return _personStyles[style](person);
	};
	
	var _addPerson = function(person, params) {
	
		var d = document.createElement("div");
		params = params || {};
		document.getElementById("tree_view").appendChild(d);
		d.id = "couple_" + person.id;		
		d.className = params.coupleClass || "couple";		
		// jquery specific
		$(d).html(_formatPerson(person, 'withspouse'));
		if(params.loc) {
			$(d).offset(params.loc);
		}
	};
	
	var _slots = [];
	var _getSlot = function(idx) {
		
		var cl = (_slots.length || 0) - 1;
		if (cl <= idx) {
			for(var i = 0; i < idx-cl; i++) {
				_slots.push([]);
			}
		}
		return _slots[idx];
	};
	
	var horizontalAnchors = [ jsPlumb.Anchors.RightMiddle, jsPlumb.Anchors.LeftMiddle ];
	var verticalAnchors = [ jsPlumb.Anchors.BottomCenter, jsPlumb.Anchors.TopCenter ];
	var inited = false;	
	var _draw = function(params, _idx) {
		var focusPerson = familySearch.getFocus();
		var horizontal = params.orientation != null ? params.orientation == 'horizontal' : true;
		var idx = _idx || 0;
		var c = _getSlot(idx);
		var p  = params.p || focusPerson;
		var pc = params.coupleClass;
		if (!inited) _addPerson(p, {personClass:pc});
		// test for male...should be parameterised
		if (!inited && (p.id == focusPerson.id || p.f != null)) c.push(p);
		var o = familySearch.findOffspring(p.id);					
		if (o && o.length > 0) {
			for (var i = 0; i < o.length; i++) {
				_draw({p:o[i],orientation:params.orientation, personClass:pc}, idx + 1);
				jsPlumb.connect({
					source:'couple_' + p.id, 
					target:'couple_' + o[i].id, 
					anchors:horizontal ? horizontalAnchors : verticalAnchors
				});
			}
		}		
		var slot = horizontal ? 250 : 170;
		var slotStep = horizontal ? 190 : 70;
		var _slotSizes = [];
		var longestSlot = null;
		var longestSlotSize = -1;
		
		// adjust everyone's position, first pass.  todo: probably extract to a method.
		// doesnt need to be done until the tree_view is full.
		for (var i = 0; i < _slots.length; i++) {
			var locator = horizontal ? 180 : 250;
			var locatorStep = horizontal ? 80 : 180;
			for (var j = 0; j < _slots[i].length; j++) {
				var offsets = horizontal ? {left:slot,top:locator} : {left:locator,top:slot};
				$("#couple_" + _slots[i][j].id).offset(offsets);
				locator = locator + locatorStep;
			}
			_slotSizes.push(locator);
			if (locator > longestSlotSize) {
				longestSlot = i + 0;
				longestSlotSize = locator + 0;
			}
			slot = slot + slotStep;
		}
		
		// adjustments, second pass: should make columns with fewer elements  	 
		// those elements to be central vertically with the longest columns
		for (var i = 0; i < _slots.length; i++) {
			if (i != longestSlot) {
				var d = longestSlotSize - _slotSizes[i];
				d = d / 2;
				for (var j = 0; j < _slots[i].length; j++) {
					var p = $("#couple_" + _slots[i][j].id);
					var o = p.offset();
					var offsets = horizontal ? {left:o.left,top:o.top + d} : {left:o.left + d,top:o.top}; 
					p.offset(offsets);
				}
			}
		}
		
		// went from 3.954 secs to 1.26 doing this once at the end.  still could cleanup the methods
		// though...redraw and initialize do some of the same stuff.
		//jsPlumb.repaintEverything();				
	};
	
	var _redraw = function(params) {
		
		jsPlumb.detachEverything();
		jsPlumb.removeEveryEndpoint();
		$("#wait").html("please wait...drawing");
		$("#tree_view").css('visibility', 'hidden');
		$("._jsPlumb_connector, ._jsPlumb_endpoint").css('visibility', 'hidden');
		$("#wait").fadeIn(200,function() {
			//var s = (new Date()).getTime();
			_draw(params);
			jsPlumb.repaintEverything();
			//var e = (new Date()).getTime();
			$("#wait").fadeOut();
			$("#tree_view").css('visibility', 'visible');

			$("._jsPlumb_connector, ._jsPlumb_endpoint").css('visibility', 'visible');
		});

		inited = true;
	};
	
	var _showPersonInfo = function(p) {
		// need a microtemplater here
		var t = _formatPerson(p, 'all');
		$("#info").html(t);
	};
	
	var _hover = function(id) {
		var a = familySearch.findAncestors($(this).attr("rel"));
		for (var i = 0; i < a.length; i++)
			$("#couple_" + a[i].id).addClass("selected");
	}
		
	
	var FamilySearchUI = window.FamilySearchUI = function(){
		this.initialize = function(_familySearch, params) { 
			familySearch = _familySearch;
			
			_redraw(params);						
			
			$(".individual").hover(function() {
				$(this).parent().addClass("hover");
				var a = familySearch.findLineageList($(this).attr("rel"));
				for (var i = 0; i < a.length; i++)
					$("#couple_" + a[i].id).addClass("selected");
			},
			function() {
				$(this).parent().removeClass("hover");
				$(".couple").removeClass("selected");
			});	
			
			$(".couple").click(function() {
				var person = familySearch.findPerson($(this).attr("rel"));
				_showPersonInfo(person);
			});
			
			$(".chkOrientation").click(function() {
				_redraw({orientation:$(this).attr('rel')});
			});			
			
			$("#wait").fadeOut();
			$("#tree_view").css('visibility', 'visible');					   

		};
		this.draw = _draw;
		this.redraw = _redraw;
		this.showPersonInfo = _showPersonInfo;
	};
})();
