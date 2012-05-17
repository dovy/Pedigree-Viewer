(function() {

var EventGenerator = function(eventMethod) {
	var _listeners = [];
	this.addListener = function(l) { _listeners.push(l); };
	// really we should fire a custom event, and let jquery deal with registering
	// event handlers for us.
	this.fireUpdate = function(value) {
		for (var i in _listeners) {
			try {
				_listeners[i][eventMethod](value);
			}
			catch (e) { }
		}
	};
};
	
var ProxyDragger = window.ProxyDragger = function(container, element, options) {
	EventGenerator.call(this, "proxyDragEvent");
	var self = this;
	options = options || { };
	var padding = options.padding || 50;  // how close the internal container can be dragged to the edge of the external before we force a stop.
	var filterClasses = null;
	if (options.filterClasses) {
		filterClasses = options.filterClasses.split(" ");
	}
	// returns true if the element has any of the specified filter classes.
	var _filterByClass = function(el) {
		for(var c in filterClasses) 
			if (el.hasClass(filterClasses[c])) return true;
		return false;
	};
	container = typeof container == "string" ? $("#" + container) : $(container);
	element = typeof element == "string" ? $("#" + element) : $(element); 
	// get size and position of container. we dont get size of element; it may change.
//	var co = container.offset(), cw = container.outerWidth(), ch = container.outerHeight();
	var down = false, downPosition = {};
	var listenerSelector = options.listenerSelector || $("body"); 
	listenerSelector.bind("mousedown", function(e) {
		if (e.which == 1) {
			if (!filterClasses || !_filterByClass($(e.target))) {
				down = true; 
				downPosition.x = e.pageX, downPosition.y = e.pageY;
				elementDownPosition = element.offset();
			}
		}
	});
	$(document).bind("mouseup", function(e) { down = false; });
	
	/**
	 * moves the drag element if it is determined it wont be outside the bounds of the container.
	 */
	var _move = function(newX, newY) {												
		var o = element.offset();
		var dx = newX - downPosition.x, dy = newY - downPosition.y;
		var proposedLeft = o.left + dx, proposedTop = o.top + dy;
		downPosition.x = newX, downPosition.y = newY;
		return _clamp(proposedLeft, proposedTop);
	};
	
	var _getRanges = function() {
		var co = container.offset(), cw = container.outerWidth(), ch = container.outerHeight();
		return { 
			MAX_LEFT : co.left + cw - padding, 
			MIN_LEFT : co.left + padding, 
			MAX_TOP : co.top + ch - padding, 
			MIN_TOP : co.top + padding
		};
	};

	var _clamp = function(proposedLeft, proposedTop) {
		var r = _getRanges();
		var dw = element.outerWidth(), dh = element.outerHeight();
		if (proposedLeft >= r.MAX_LEFT) proposedLeft = r.MAX_LEFT;
		if (proposedLeft + dw <= r.MIN_LEFT) proposedLeft = r.MIN_LEFT - dw;
		if (proposedTop >= r.MAX_TOP) proposedTop = r.MAX_TOP;
		if (proposedTop + dh <= r.MIN_TOP) proposedTop = r.MIN_TOP - dh; 						
		var newOffset = {left:proposedLeft, top:proposedTop};
		element.offset(newOffset);
		self.fireUpdate(newOffset);
		return newOffset;
	};
	
	$(document).bind("mousemove", function(e) { 
		if (down) {
			e.preventDefault();  // stops things being selected on the page. quite invasive.
			_move(e.pageX, e.pageY);			
		} 
	});
	
	var _panningNow = false;
	//todo refactor to use _clamp; we can pass in the function we want to execute post-clamp.
	var _pan = function(input){
		_panningNow = true;
		input = input || {};
		var values = {};
		var dw = element.outerWidth(), dh = element.outerHeight();
		var o = element.offset();
		
		// refactor to a helper method
		var r = _getRanges();
		if (input.left) {
			var proposedLeft = o.left + input.left;
			if (proposedLeft >= r.MAX_LEFT) input.left = input.left + (r.MAX_LEFT - proposedLeft)
			if (proposedLeft + dw <= r.MIN_LEFT) input.left = r.MIN_LEFT - o.left - dw;			
			var sl = input.left < 0 ? "-" : "+";
			values.left = sl + "=" + Math.abs(input.left) + "px";
		}
		
		if (input.top) {
			var proposedTop = o.top + input.top;
			if (proposedTop >= r.MAX_TOP) input.top = (r.MAX_TOP - o.top);
			if (proposedTop + dh <= r.MIN_TOP) input.top = r.MIN_TOP - o.top - dh;
			var sl = input.top < 0 ? "-" : "+";
			values.top = sl + "=" + Math.abs(input.top) + "px";
		}
		
		element.animate(values, {duration:'medium', step:self.fireUpdate, complete:function() { _panningNow = false; } });		
	};
			
	this.pan = function(input) {		
		if (!_panningNow) {			
			_pan(input);
		}
	};

	this.moveTo = function(pos) {
		_clamp(co.left + pos.left, co.top + pos.top);
	};
	
	this.moveToPosition = function(pos) {
		_clamp(pos.left, pos.top);
	};
};

var PreviewPane = window.PreviewPane = function(params) {
	EventGenerator.call(this, "previewDragEvent");
	var self = this;
	var zoom = params.zoom || 0.25;
	var container = $("#" + params.container);
	var containerWidth = container.outerWidth(), containerHeight = container.outerHeight();
	
	var chart = $("#" + params.chart);
	var previewChart = $("#" + params.preview);
		
	var _reposition = function() {
		var dw = previewChart.outerWidth() / chart.outerWidth();
		var dh = previewChart.outerHeight() / chart.outerHeight();
		preview.width(containerWidth * dw);
		preview.height(containerHeight * dh);		
		
		var offset = chart.offset();
		var co = container.offset();
		var dl = offset.left - co.left, dt = offset.top - co.top;
		var pco = previewChart.offset();
		preview.offset({left:pco.left - (dl * dw),top:pco.top - (dt * dh)});
	};
	
	var previewContainer = $("#" + params.previewContainer);
	var previewChartOffset = previewChart.offset();
	var previewContainerOffset = previewContainer.offset();
	
	var preview = document.createElement("div");	
	preview = $(preview);
	previewContainer.append(preview);	
	preview.addClass("preview");
	
	_reposition();
	
	var _weFiredTheEvent = false;
	var previewProxyDragger = new ProxyDragger(previewChart, preview, {padding:0.25*50, listenerSelector:$(preview)});
	previewProxyDragger.addListener({
		proxyDragEvent : function(offset) {
			var previewOffset = preview.offset();
			var previewChartOffset = previewChart.offset();
			var dw = previewChart.outerWidth() / chart.outerWidth();
			var dh = previewChart.outerHeight() / chart.outerHeight();
			var co = container.offset();
			
			var chartLeft = ((previewChartOffset.left - previewOffset.left) / dw) + co.left;
			var chartTop = ((previewChartOffset.top- previewOffset.top) / dh) + co.top;
			_weFiredTheEvent = true;
			self.fireUpdate({left:chartLeft, top:chartTop});
			_weFiredTheEvent = false;
		}
	});	

	this.proxyDragEvent = function(offset) { if (!_weFiredTheEvent) _reposition(); };	
	this.zoomEvent = function(zoom) { _reposition(); };
	this.uiEvent = function() { if (!_weFiredTheEvent) _reposition(); };
	this.repaint = _reposition;
};

var ZoomHandler = window.ZoomHandler = function(params) {
	EventGenerator.call(this, "zoomEvent");
	var self = this;
	params = params || {};
	var minZoom = params.minZoom || 0.2;
	var maxZoom = params.maxZoom || 2.5;
	var zoomStep = params.zoomStep || 0.05;
	var currentZoom = params.currentZoom || 1;
	var onZoom = params.onZoom || function() { };	
	var slider = null;
	
	var _zoom = function(val) {
		currentZoom = val;
		onZoom(currentZoom);
		self.fireUpdate(currentZoom);
	};
	
	if (params.slider) {
		$(params.slider).slider({
			min:minZoom * 100, max:maxZoom * 100, value:currentZoom * 100,
			slide: function(event, slider) {
				currentZoom = slider.value / 100;
				_zoom(currentZoom); 
			}
		});
	}
	if (params.wheel) {				
		$(params.wheel).bind('mousewheel', function(event, delta) {
			var newVal = null;
			var proposedZoom = currentZoom + (delta * zoomStep);
			if (minZoom <= proposedZoom && maxZoom >= proposedZoom) {
				event.preventDefault();
				_zoom(proposedZoom);
				if (params.slider) $(params.slider).slider("value", proposedZoom * 100);				
			}
		});
	}		
};

var FULLNAME = 'fullname', WITHSPOUSE = 'withspouse', MARRIEDTO = 'married to',
FATHER='father', MOTHER='mother', CHILDREN='children', ALL='all', MALE = 'M',
FEMALE = 'F', HORIZONTAL='horizontal', VERTICAL='vertical', REL='rel';

/**
 * "abstract superclass" for renderers.
 */
var AbstractRenderer = function(options) {
	this.chart = options.chart, this.container = options.container, 
	this.wait = options.wait, this.idGenerator = options.idGenerator, 
	this.classGenerator = options.classGenerator, this.personIdGenerator = options.personIdGenerator,
	this.defaults = options.defaults;	
};

/**
 * this is the standard chart renderer, used to render the main chart, with symbols etc.
 * there is another renderer - OutlineChartRenderer - which is used for the preview pane and which
 * does not paint symbols or people's names or anything, just simple boxes.
 * @return
 */
var StandardChartRenderer = function(options) {
	AbstractRenderer.call(this, options);	
	var self = this;
	var _personStyles = { 
		'fullname': function(p) { return "<div id='" + self.personIdGenerator(p) + "' class='" + self.defaults.classes.individual + " " + (MALE == p.s ? self.defaults.classes.male : FEMALE == p.s ? self.defaults.classes.female : "") + "' rel='" + p.id + "'><span>&nbsp;</span>" + _renderName(p) + "</div>" },
		'withspouse' : function(p) {
			var s = p.spouse ? p.spouse : p.sp ? sharingTime.findPerson(p.sp) : null;
			var r = _personStyles[FULLNAME](p);
			var sp = s ? _formatPerson(s, FULLNAME) : null;
			// always draws the male on top.
			if (s) {
				if (p.s == 'M') r += sp;
				else
					r = sp + r;
			}
			return r;
		},
		'married to' : function(p) {
			var s = p.sp ? sharingTime.findPerson(p.sp) : null;
			if (s) return 'Spouse: ' + _formatPerson(s, FULLNAME);
			return '';
		},
		'father' : function(p) {
			if (p.f != null) {
				return 'Father: ' + _formatPerson(sharingTime.findPerson(p.f), FULLNAME);
			}
			return '';
		},
		'mother' : function(p) {
			if (p.m != null) {
				return 'Mother: ' + _formatPerson(sharingTime.findPerson(p.m), FULLNAME);
			}
			return '';
		},
		'children' : function(p) {
			var o = sharingTime.findOffspring(p.id);
			if (o && o.length > 0) {
				var t = 'Children :<br/>';
				for (var i = 0; i < o.length; i++)
					t = t + '  ' + _formatPerson(o[i], FULLNAME) + "<br/>";
				return t;
			}
			return ' - no children - ';
		},
		'all' : function(p) {				
			var r = 'Name :' + _formatPerson(p, FULLNAME) + "<br/>";
			r = r + _formatPerson(p, MARRIEDTO) + "<br/>";
			r = r + _formatPerson(p, FATHER) + "<br/>";
			r = r + _formatPerson(p, MOTHER) + "<br/>";
			r = r + _formatPerson(p, CHILDREN) + "<br/>";
			return r;
		}
	};
	var _renderName = function(p) {
		var n = p.fn && p.fn.length > 0 ? p.fn :  "&nbsp;";
		n = n + ' ' + (p.sn ? p.sn.toUpperCase() : "&nbsp;")
		return n;
	};
	/**
	 * formats the given person with the given style.
	 */
	var _formatPerson = function(person, style) {		
		return _personStyles[style](person);
	};
	this.addPerson = function(person) {
		var id = self.idGenerator(person);
		if (!document.getElementById(id)) {
			var d = document.createElement("div");		
			self.chart[0].appendChild(d);
			d.id = id;		
			d.className = self.classGenerator(person);		
			$(d).attr("rel", person.id);
			$(d).html(_formatPerson(person, WITHSPOUSE));
		}
		else $("#" + id).offset({left:0, top:0});
	};	
};

/**
 * renders people in a blank box.
 */
var OutlineChartRenderer = function(params) {
	AbstractRenderer.call(this, params);
	var self = this;
	this.addPerson = function(person) {
		var id = self.idGenerator(person);
		if (!document.getElementById(id)) {
			var d = document.createElement("div");		
			self.chart[0].appendChild(d);
			d.id = id;		
			d.className = self.classGenerator(person);		
			$(d).attr("rel", person.id);
		}
		else $("#" + id).offset({left:0, top:0});
	};
};

/**
 * map of available renderers.
 */
var _rendererMap = { "standard":StandardChartRenderer, "outline":OutlineChartRenderer };
	
var SharingTimeUI = window.SharingTimeUI = function(){
		
	EventGenerator.call(this, "uiEvent");

	var self = this;
	var _params = {
		chart : 'chart',
		classes : {
			couple:'couple',
			individual:'individual',
			hover:'hover',
			selected:'selected',
			male:'male',
			female:'female',
			blank:'blank-couple'
		},		
		// defaults for the spacing of elements in the chart.  these are probably not named
		// the best.  the 'slot step' values are the spacings between different levels in the
		// hierarchy; the 'locator step' values are spacings between people of the same level
		// in the hierarchy.  i'd like to rename these. 
		dimensions : {
			horizontalSlotStep : 90,
			verticalSlotStep : 60, 
			horizontalLocatorStep : 10,
			verticalLocatorStep: 10
		},
		ids : {
			person : 'person_',
			couple : 'couple_'
		},
		maxZoom : 2.5,
		messages : {
			drawing:"please wait...drawing",
			loading:"please wait...loading"
		},		
		minZoom : 0.2,
		renderer:"standard",
		wait:'wait',
		zIndices: {
			connector:0,
			connectorHighlight:1,
			couple:2,
			individual:3
		}
	};
	
	var sharingTime = null, focus = null;
	var chartDiv = null, chartContainer = null, waitDiv = null;
	// UI functions. replace with micro templates.	
	
	/**
	 * cache of people, by id.
	 */
	var _personMap = {};				
	
	var _getPersonDivId = function(person) {
		return idPrefix + _params.ids.person + person.id;
	};
	
	/**
	 * creates and returns an appropriate id for the div containing the person and their spouse.
	 */
	var _getDivId = function(person) {
		var id = null; 
		if (MALE == person.s) {
			id = _params.ids.couple + person.id;
		}
		else if (FEMALE == person.s && person.spouse != null) {
			id = _params.ids.couple + person.spouse.id;
		}
		else 
			id = _params.ids.couple + "_blank_" + person.id;
		return idPrefix + id;
	};
	
	/**
	 * gets an appropriate CSS class for the div containing the given person. if the person
	 * is not blank we return 'suppliedClass' if it is not null, or '_params.classes.couple', if it
	 * is.  if the person is blank we append '_params.classes.blank'.  
	 */
	var _getDivClass = function(person, suppliedClass) {
		var clazz = suppliedClass || _params.classes.couple;
		if (person.isBlank) clazz = clazz + " " + (_params.classes.blank || "");
		return clazz;
	};
	
	/**
	 * adds a person to the UI, if there is not an element with the computed id already, otherwise
	 * resets the offset of that element to 0,0.
	 */	
	var _addPerson = function(person) {
		_renderer.addPerson(person);		
	};
	
	/**
	 * finds the array that contains the people at the given level in the hierarchy, creating it
	 * if necessary.
	 */
	var _getSlot = function(_slots, idx) {		
		var cl = (_slots.length || 0) - 1;
		if (cl <= idx) {
			for(var i = 0; i < idx-cl; i++) {
				_slots.push([]);
			}
		}
		return _slots[idx];
	};
	
	var inited = false;
	var _renderer = null;
	var _connectionMap = {};
	var _slots = [];
	var currentParams = null;
	var idPrefix = "";
	var isStatic = false;
	var drawConnections = true;
	/**
	 * creates a connection between the elements representing two people, and adds it to the
	 * map of connections.
	 */
	var _makeConnection = function(chartType, p1, p2, horizontal) {
		var id1 = _getDivId(p1);
		var id2 = _getDivId(p2);
		var anchors = horizontal ? anchorTypes[chartType]["horizontal"] : anchorTypes[chartType]["vertical"];		
		var newConnection = jsPlumb.connect({ source:id1, target:id2, anchors:anchors });
		_connectionMap[id1 + "_" + id2] = newConnection;
	};
	/**
	 * finds the connection that connects the elements representing the two people.
	 */
	var _findConnection = function(p1, p2) {
		var id1 = _getDivId(p1);
		var id2 = _getDivId(p2);
		var c = _connectionMap[id1 + "_" + id2];
		if (!c) c = _connectionMap[id2 + "_" + id1];
		return c;
	};
	
/* chart types */
	
	var anchorTypes = {
		"ancestor": {
			"horizontal" : [ jsPlumb.Anchors.RightMiddle, jsPlumb.Anchors.LeftMiddle ],
			"vertical" : [ jsPlumb.Anchors.TopCenter, jsPlumb.Anchors.BottomCenter ]		
		},
		"descendant": {
			"horizontal" : [ jsPlumb.Anchors.LeftMiddle, jsPlumb.Anchors.RightMiddle ],
			"vertical" : [ jsPlumb.Anchors.BottomCenter, jsPlumb.Anchors.TopCenter ]		
		}	
	};

	// todo all the code that works out horizontal, focus person etc, should be moved into the 
	// main drawing function and just passed in here. this method should take
	// (person, idx, horizontal, slots)
	
	var chartTypes = {

		"ancestor": function(person, _idx, drawFunction, slots) {			
			var horizontal = _params.orientation != null ? _params.orientation == HORIZONTAL : true;
			var _oneLevel = function(person, idx) {				
				var c = _getSlot(slots, idx);
				var p  = person || focus;					
				if (!inited) _addPerson(p);
				c.push(p);
				var _drawOne = function(person) {				
					if (person) {
						if(!person.father && !person.isBlank) {
							sharingTime.addBlankFather(person);
						}
						if(!person.mother && !person.isBlank) {
							sharingTime.addBlankMother(person);
						}
						if (person.father) {
							_oneLevel(person.father, idx + 1);
							if (drawConnections) _makeConnection("ancestor", person, person.father, horizontal);
						}
					}				
				};
				_drawOne(p);
				_drawOne(p.spouse);
			};
			
			_oneLevel(person, _idx);					
			if (!horizontal) slots.reverse();
		},
		
		"descendant": function(person, _idx, drawFunction, slots) {
			var horizontal = _params.orientation != null ? _params.orientation == HORIZONTAL : true;
			var _oneLevel = function(person, idx) {
				var c = _getSlot(slots, idx);
				var p  = person || focus;
				if (!inited) _addPerson(p);
				c.push(p);
				for (var i in p.children) {
					_oneLevel(p.children[i], idx + 1);
					if (drawConnections) _makeConnection("descendant", p, p.children[i], horizontal);
				}
			};
			
			_oneLevel(person, _idx);
			if (horizontal) slots.reverse();
		},
		
		"bowtie" : function(person, _idx, drawFunction, slots) {
			var aSlots = [], dSlots = [];
			chartTypes["ancestor"](person, _idx, chartTypes["ancestor"], aSlots);						
			chartTypes["descendant"](person, _idx, chartTypes["descendant"], dSlots);			
			slots.push(dSlots);
			slots.push(aSlots);
		}
	};

	/**
	 * returns a summary of the given list of arrays, telling you which array was the longest, and
	 * how many elements were in it.
	 */
	var _getSlotInfo = function(slots) {
		var idx = -1, size = 0;
		for (var i = 0; i < slots.length; i++) {				
			if (slots[i].length > size) {
				idx = i + 0;
				size = slots[i].length + 0; 
			}
		}
		return { index:idx , size:size };
	};
	
	/**
	 * positions all the elements in a chart.  this code is shared by all the different chart types;
	 * we just need some params and an array of 'slots' (lists of the people in each level of the
	 * hierarchy). 
	 */
	var _positionChart = function(slots) {
		var co = chartDiv.offset();
		var zoom = _params.zoom || 1;
		chartDiv.css("font-size", zoom * 100 + "%");
		chartDiv.css("line-height", zoom * 100 + "%");
		co = chartDiv.offset();
		var horizontal = _params.orientation != null ? _params.orientation == HORIZONTAL : true;
		var slot = 0, slotLengths = [];
		var slotStep = horizontal ? _params.dimensions.horizontalSlotStep : _params.dimensions.verticalSlotStep;
		var slotInfo = _getSlotInfo(slots);
		
		// adjust position, 1st pass
		for (var i = 0; i < slots.length; i++) {
			var locator = 0;
			var largestStepIndex = -1, largestStepSize = 0;
			var locatorStep = horizontal ? _params.dimensions.horizontalLocatorStep : _params.dimensions.verticalLocatorStep;				
			for (var j = 0; j < slots[i].length; j++) {
				var offsets = horizontal ? {left:slot,top:locator} : {left:locator,top:slot};
				var div = $("#" + _getDivId(slots[i][j]));
				div.offset(offsets);
				var stepSize = (horizontal ? div.outerWidth() : div.outerHeight());
				if (stepSize > largestStepSize) {
					largestStepIndex = j; largestStepSize = stepSize;
				}
				locator = locator + (horizontal ? div.outerHeight() / zoom : div.outerWidth() / zoom) + locatorStep;
			}
			slotLengths.push(locator);
			slot = slot + (largestStepSize/zoom) + Math.min(slotStep, (slotStep * zoom));  // shoulnd't this take element dimensions into account?
		}
		// adjust position, 2nd pass.  this centers everything with respect to the level
		// in the hierarchy that has the most people.
		for (var i = 0; i < slots.length; i++) {
			var d = slotLengths[slotInfo.index] - slotLengths[i];
			d = d / 2;
			for (var j = 0; j < slots[i].length; j++) {
				var p = $("#" + _getDivId(slots[i][j]));
				var o = p.offset();
				var offsets = horizontal ? {left:o.left,top:o.top + d} : {left:o.left + d,top:o.top};
				offsets.left = (offsets.left * zoom + co.left) ;
				offsets.top = (offsets.top * zoom + co.top);
				p.offset(offsets);
			}
		}
		
		// adjust container size to fit snugly around the chart.		
		if (horizontal) {
			chartDiv.width(slot * zoom);
			chartDiv.height(slotLengths[slotInfo.index] * zoom);
		}
		else { 
			chartDiv.height(slot * zoom);
			chartDiv.width(slotLengths[slotInfo.index] * zoom);
		}
	};
	/**
	 * wrappers for positioning functions.  for horizontal, ancestor chart passes straight through and for
	 * vertical it flips the order of the hierarchy first; descendants does the opposite; bowtie chart concats the slots from
	 * descendant and ancestor (removing the duplicated focus element), and then behaves like
	 * the ancestor chart.
	 */
	var chartPositioningTypes = {
		"ancestor" : function(slots) {
			_positionChart(slots);		
		},
		"descendant" : function(slots) {
			_positionChart(slots);			
		},
		"bowtie" : function(slots) {			
			var dSlots = slots[0].slice(0);
			var aSlots = slots[1].slice(0);
			var horizontal = _params.orientation != null ? _params.orientation == HORIZONTAL : true;
			if (horizontal) {
				dSlots.splice(dSlots.length - 1, 1);			
				var bSlots = dSlots.concat(aSlots);
				_positionChart(bSlots);
			}
			else {
				aSlots.splice(aSlots.length - 1, 1);			
				var bSlots = aSlots.concat(dSlots);
				_positionChart(bSlots);
			}
		}
	};		
	
	var _moveChartTo = function(left, top) {
		// implement and use instead of animating in the centering/positioning functions.
		// take into account 'isStatic' to decide whether or not to animate.
		/*var adjustLeft = containerOffset.left - left;
		var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (chartOffset.top/2) + (personHeight / 2));
		chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"});*/
	};
	
	var _chartCenteringPadding = 20;
	var chartCenteringTypes = {
		"ancestor":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
			if (_params.orientation == "horizontal") {
				var adjustLeft = containerOffset.left - (chartOffset.left) + 20;				
				var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
				chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
			}
			else {
				var adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
				//var adjustTop = containerOffset.top + containerHeight - (chartOffset.top + chartHeight) + 20;
				//var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
				var adjustTop = containerOffset.top + containerHeight - (chartOffset.top + chartHeight + 20);
				//var adjustLeft = containerOffset.top+ (containerHeight) - (chartOffset.top+ (chartHeight) - 10);
				chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
			}
		},
		"descendant":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
			if (_params.orientation == "horizontal") {
				var adjustLeft = containerOffset.left + (containerWidth) - (chartOffset.left + (chartWidth) - 10);
				var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
				chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
			}
			else {
				var adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
				var adjustTop = containerOffset.top - (chartOffset.top) + 20;
				chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
			}
		},
		"bowtie":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
			var adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
			var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
			chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});			
		}		
	};
	
	/**
	 * animates the chart div so that it is centered on the given person. 
	 */
	var _centerOn = function(person, options) {
		var ccw = chartContainer.outerWidth(), cch = chartContainer.outerHeight();
		var cco = chartContainer.offset();
		var cw = chartDiv.outerWidth(), ch = chartDiv.outerHeight();
		// if chart smaller than container, center the whole chart:
		if (cw < ccw && ch < cch) {
			
			//chartDiv.offset({left:cco.left + ((ccw-cw)/2), top:cco.top+((cch-ch)/2)});
			chartDiv.animate({left:((ccw-cw)/2), top:((cch-ch)/2)}, {step:self.fireUpdate});
			
		}
		else {				
			var id = _getDivId(person);
			var o = $("#" + id).offset();
			var fw = $("#" + id).outerWidth(), fh = $("#" + id).outerHeight();
			var co = chartDiv.offset();
			chartCenteringTypes[_params.chartType](person, id, o, fw, fh, ccw, cch, cco, cw, ch, co);
		}
	};
	
	/**
	 * re-centers the chart on the focus person.
	 */
	var _recenter = function() { _centerOn(focus); };
	
	/**
	 * redraws the chart - hides chart, resets plumbing, shows wait dialog, draws, positions, shows charts. 
	 */
	var _redraw = function(params) {		
		_params = $.extend(_params, params);
		if (waitDiv) waitDiv.html(_params.messages.drawing);
		chartDiv.css('visibility', 'hidden');
		if (drawConnections) $("._jsPlumb_connector, ._jsPlumb_endpoint").css('visibility', 'hidden');
		if (drawConnections) jsPlumb.reset();
		var focus = sharingTime.getFocus();
		var _actuallyRedraw = function() {
			_connectionMap = {};
			var drawFunction = chartTypes[_params.chartType];
			_slots = [];
			drawFunction(focus, 0, drawFunction, _slots);
			var positioningFunction = chartPositioningTypes[_params.chartType];
			positioningFunction(_slots);									
			if (drawConnections) jsPlumb.repaintEverything();
			if (waitDiv) waitDiv.fadeOut();
			chartDiv.css('visibility', 'visible');			
			if (drawConnections) $("._jsPlumb_connector, ._jsPlumb_endpoint").css('visibility', 'visible');
			// center on the focused person
			_centerOn(focus, {duration:1000});
		};
		if (waitDiv) {
			waitDiv.fadeIn(200,function() {
				_actuallyRedraw();
				inited = true;
			});
		}
		else {
			_actuallyRedraw();
			inited = true;
		}		
		
	};			
	
	var _reposition = function(options) {
		if (_slots) {
			_params = $.extend(_params, options);
			var positioningFunction = chartPositioningTypes[_params.chartType];
			positioningFunction(_slots);
			if (drawConnections) jsPlumb.repaintEverything();
		}				
	};
	
	var _zoom = function(percent) {		
		var chartW = chartDiv.outerWidth(), chartH = chartDiv.outerHeight(); 
		_reposition({zoom:percent});
		var chartLoc = chartDiv.offset();
		var chartWNew = chartDiv.outerWidth(), chartHNew = chartDiv.outerHeight();
		//must call proxy dragger here, to clamp the chart movement. 
		proxyDragger.moveToPosition({left:chartLoc.left -  ((chartWNew - chartW) / 2), top:chartLoc.top  - ((chartHNew - chartH) / 2)});
	};		
	
	var proxyDragger = null;
	
	var _pan = function(input) {
		if (proxyDragger) proxyDragger.pan(input);
	};
	
	var _panLeft = function() { _pan({left:-150}); };
	var _panUp = function() { _pan({top:-150}); };
	var _panRight = function() { _pan({left:150}); };
	var _panDown = function() { _pan({top:150}); };
	
	/**
	 * SharingTimeUI public API and UI functionality.
	 */
	
		this.initialize = function(_sharingTime, params) { 
			sharingTime = _sharingTime;
			isStatic = params.static != null ? params.static : false;
			if (!isStatic)
				proxyDragger = new ProxyDragger(params.chartContainer, params.chartDiv, {filterClasses:"preview individual ui-slider-handle ui-slider"});
			focus = sharingTime.getFocus();
			drawConnections = params.drawConnections != null ? params.drawConnections : true;
			idPrefix = params.idPrefix || "";
			chartDiv = $("#" + params.chartDiv);
			waitDiv = params.waitDiv ? $("#" + params.waitDiv) : null; 
			chartContainer = $("#" + params.chartContainer);			
			// prepare the ids, classes, etc.
			var defaults = $.extend({}, _params);
			_params = $.extend(defaults, params.defaults);
			var rendererClass = params.renderer || _params.renderer;
	
			// make the renderer.
			_renderer = new _rendererMap[rendererClass]({
					chart:chartDiv, 
					container:chartContainer, 
					wait:waitDiv,
					idGenerator : _getDivId,
					personIdGenerator : _getPersonDivId,
					classGenerator : _getDivClass,
					defaults : _params
			});			
			
			_redraw(params);			
						
			// setup the ancestor/descendant hover functionality.
			$("." + defaults.classes.individual).hover(function() {
				$(this).parent().addClass(defaults.classes.hover);
				var a = sharingTime.alternateFindLineageList($(this).attr(REL));				
				for (var i = 0; i < a.people.length; i++) {
					// we used to highlight the couple containing an individual; now we just 
					// highlight the individual.  but we might want to give the couple some
					// kind of treatment too, to make it stand out.
					//$("#" + defaults.ids.person + a.people[i].id).parent().addClass(defaults.classes.selected);					
					$("#" + idPrefix + defaults.ids.person + a.people[i].id).addClass(defaults.classes.selected);
				}
				$(this).parent().addClass(defaults.classes.hover);
				if (drawConnections) {
					for (var i = 0; i < a.relationships.length; i++) {
						var r = a.relationships[i];	
						var c = _findConnection(r[0], r[1]);
						if (c) {
							c.paintStyle = _params.highlightPaintStyle;
							// bump the z-index so it appears on top of any others;
							// a TODO might be to allow this z-index to be set. 
							$(c.canvas).css("z-index", _params.zIndices.connectorHighlight);
							jsPlumb.repaint(_getDivId(r[0]));
						}
					}
				}
			},
			function() {
				$(this).parent().removeClass(defaults.classes.hover);
				// we used to highlight the couple containing an individual; now we just 
				// highlight the individual.  but we might want to give the couple some
				// kind of treatment too, to make it stand out.
				//$("." + defaults.classes.couple).removeClass(defaults.classes.selected);
				$("." + defaults.classes.individual).removeClass(defaults.classes.selected);
				// this could be cached.  or even done at startup for everyone.
				if (drawConnections) {
					var a = sharingTime.alternateFindLineageList($(this).attr(REL));
					for (var i = 0; i < a.relationships.length; i++) {
						var r = a.relationships[i];
						var c = _findConnection(r[0], r[1]);
						if (c) {
							c.paintStyle = jsPlumb.Defaults.PaintStyle;
							// reset the z-index to normal;
							// a TODO might be to allow this z-index to be set.
							$(c.canvas).css("z-index", _params.zIndices.connector);
							jsPlumb.repaint(_getDivId(r[0]));
						}
					}
				}
			});
			
			// this should not be in here. it should be in the demo pages.
			$(".chkOrientation").click(function() {
				_redraw({ orientation:$(this).attr(REL) });
			});			
			
			$("#" + defaults.wait).fadeOut();
			$("#" + defaults.chart).css('visibility', 'visible');	
			if (drawConnections) jsPlumb.repaintEverything();

		};
		this.redraw = _redraw;
		this.centerOn = _centerOn;
		this.recenter = _recenter;
		this.zoom = _zoom;
		this.zoomIn = function() { return _changeZoom(1); };
		this.zoomOut = function() { return _changeZoom(-1); };
		this.panLeft = _panLeft;
		this.panUp = _panUp;
		this.panRight = _panRight;
		this.panDown = _panDown;
		this.getProxyDragger = function() { return proxyDragger; };
	};
})();
