(function() {

    var SimpleCache = function(idGenerator, valueGenerator) {
        var c = {};
        this.clear = function() { c = {}; };
        this.get = function(item) {
            var id = idGenerator(item);
            var o = c[id];
            if (!o) {
                o = valueGenerator(item);
                c[id] = o;
            }
            return o;
        };	
    };

    var EventGenerator = function(eventMethod) {
        var _listeners = [];
        this.addListener = function(l) { _listeners.push(l); };
        // really we should fire a custom event, and let jquery deal with registering
        // event handlers for us.
        this.fireUpdate = function(value) {
            for (var i=0; i < _listeners.length; i++) {
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
            //for(var c in filterClasses) 
                for(var c = 0; c < filterClasses.length; c++) 
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
                    var reportedOffset = element.offset();
                    elementDownPosition = jsZoom.offset(element); 
                    downPosition.x = e.pageX, downPosition.y = e.pageY;
                }
            }
        });
        $(document).bind("mouseup", function(e) { down = false; });

        /**
        * moves the drag element if it is determined it wont be outside the bounds of the container.
        */
        var _move = function(newX, newY) {												
            var o = jsZoom.offset(element);
            var dx = newX - downPosition.x, dy = newY - downPosition.y;
            var proposedLeft = o.left + dx, proposedTop = o.top + dy;
            downPosition.x = newX, downPosition.y = newY;
            return _clamp(proposedLeft, proposedTop);
        };

        var _getRanges = function() {
            var co = jsZoom.offset(container), cw = jsZoom.outerWidth(container), ch = jsZoom.outerHeight(container);
            return { 
                MAX_LEFT : co.left + cw - padding, 
                MIN_LEFT : co.left + padding, 
                MAX_TOP : co.top + ch - padding, 
                MIN_TOP : co.top + padding
            };
        };

        var _clamp = function(proposedLeft, proposedTop) {
            var r = _getRanges();
            var dw = jsZoom.outerWidth(element), dh = jsZoom.outerHeight(element);
            if (proposedLeft >= r.MAX_LEFT) proposedLeft = r.MAX_LEFT; 
            if (proposedLeft + dw <= r.MIN_LEFT) proposedLeft = r.MIN_LEFT - dw; 
            if (proposedTop >= r.MAX_TOP) proposedTop = r.MAX_TOP;
            if (proposedTop + dh <= r.MIN_TOP) proposedTop = r.MIN_TOP - dh; 						
            var newOffset = {left:proposedLeft, top:proposedTop};
            jsZoom.offset(element, newOffset);
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
            var sl;
            _panningNow = true;
            input = input || {};
            var values = {};
            var dw = jsZoom.outerWidth(element), dh = jsZoom.outerHeight(element);
            var o = jsZoom.offset(element);

            // refactor to a helper method
            var r = _getRanges();
            if (input.left) {
                var proposedLeft = o.left + input.left;
                if (proposedLeft >= r.MAX_LEFT) input.left = input.left + (r.MAX_LEFT - proposedLeft);
                if (proposedLeft + dw <= r.MIN_LEFT) input.left = r.MIN_LEFT - o.left - dw;			
                sl = input.left < 0 ? "-" : "+";
                values.left = sl + "=" + Math.abs(input.left) + "px";
            }

            if (input.top) {
                var proposedTop = o.top + input.top;
                if (proposedTop >= r.MAX_TOP) input.top = (r.MAX_TOP - o.top);
                if (proposedTop + dh <= r.MIN_TOP) input.top = r.MIN_TOP - o.top - dh;
                sl = input.top < 0 ? "-" : "+";
                values.top = sl + "=" + Math.abs(input.top) + "px";
            }

            element.animate(values, {duration:'medium', step:self.fireUpdate, complete:function() { _panningNow = false; } });		
        };

        this.review = function() {
            var pos = jsZoom.offset(element);
            _clamp(pos.left, pos.top);
        };

        this.pan = function(input) { if (!_panningNow) { _pan(input); } };

        this.moveTo = function(pos) { _clamp(co.left + pos.left, co.top + pos.top); };

        this.moveToPosition = function(pos) { _clamp(pos.left, pos.top); };
    };

    var PreviewPane = window.PreviewPane = function(params) {
        EventGenerator.call(this, "previewDragEvent");
        var self = this;
        var getEl = function(el) { return typeof el == 'object' ? el : $("#" + el); };
        var zoom = params.previewZoom || 0.25;
        var chartZoom = params.chartZoom;
        var container = getEl(params.container), previewContainer = getEl(params.previewContainer);
        var chart = getEl(params.chart), previewChart = getEl(params.preview);
        var containerWidth = container.outerWidth(), containerHeight = container.outerHeight();
        var previewChartOffset = previewChart.offset(), previewContainerOffset = previewContainer.offset();			
        var _reposition = function() {
            preview.width(containerWidth * zoom / chartZoom);
            preview.height(containerHeight  * zoom / chartZoom);
            var offset = jsZoom.offset(chart);
            var co = jsZoom.offset(container);
            var dl = offset.left - co.left, dt = offset.top - co.top;
            var pco = jsZoom.offset(previewChart);
            //console.log("chart offset", offset.left, offset.top, "preview offset", pco.left,pco.top, "dl",dl,"dt",dt);
            //jsZoom.offset(preview, {left:pco.left - (dl * zoom/chartZoom),top:pco.top - (dt * zoom/chartZoom)});
            jsZoom.offset(preview, {left:pco.left - (dl * zoom/chartZoom),top:pco.top - (dt * zoom/chartZoom)});
        };

        var preview = document.createElement("div");	
        preview = $(preview);
        previewContainer.append(preview);	
        preview.addClass("preview");

        _reposition();

        var _weFiredTheEvent = false;
        var previewProxyDragger = new ProxyDragger(previewChart, preview, {padding:0.25*50, listenerSelector:$(preview)});
        previewProxyDragger.addListener({
            proxyDragEvent : function(offset) {
                var previewOffset = jsZoom.offset(preview);
                var previewChartOffset = jsZoom.offset(previewChart);
                var co = container.offset();
                var dl = previewOffset.left - previewChartOffset.left, dt = previewOffset.top - previewChartOffset.top;			
                var chartLeft = ((previewChartOffset.left - previewOffset.left) / zoom * chartZoom) + co.left;
                var chartTop = ((previewChartOffset.top- previewOffset.top) / zoom * chartZoom) + co.top;
                _weFiredTheEvent = true;
                self.fireUpdate({left:chartLeft, top:chartTop});
                _weFiredTheEvent = false;
            }
        });	

        this.proxyDragEvent = function(offset) { if (!_weFiredTheEvent) _reposition(); };	
        this.zoomEvent = function(zoom) { chartZoom = zoom; _reposition(); };
        this.uiEvent = function() { if (!_weFiredTheEvent) _reposition(); };
        this.repaint = _reposition;
    };

    var ZoomHandler = window.ZoomHandler = function(params) {
        EventGenerator.call(this, "zoomEvent");
        var self = this;
        params = params || {};
        var minZoom = params.minZoom || 0.2, maxZoom = params.maxZoom || 2.5;
        var zoomStep = params.zoomStep || 0.05, currentZoom = params.currentZoom || 1, onZoom = params.onZoom || function() { };	
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
                    _zoom(slider.value / 100); 
                },
                orientation: 'vertical'
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

    var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);


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
            'fullname': function(p) { return "<div id='" + self.personIdGenerator(p) + "' class='" + self.defaults.classes.individual + " " + (MALE == p.s ? self.defaults.classes.male : FEMALE == p.s ? self.defaults.classes.female : "") + " chartperson' rel='" + p.id + "'><span>&nbsp;</span>" + _renderName(p) + "</div>";},
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
                if (p.f !== null) {
                    return 'Father: ' + _formatPerson(sharingTime.findPerson(p.f), FULLNAME);
                }
                return '';
            },
            'mother' : function(p) {
                if (p.m !== null) {
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
        n = n + ' ' + (p.sn ? p.sn.toUpperCase() : "&nbsp;");
            return n;
        };
        /**
        * formats the given person with the given style.
        */
        var _formatPerson = function(person, style) {		
            return _personStyles[style](person);
        };

        /**
        * Adds a person to the UI.  If the person exists it just relocates the person's
        * div; probably it should also update the details.
        * 
        * @return true if the person did not already exist in the UI, false if it did.
        */
        this.addPerson = function(person) {
            var id = self.idGenerator(person);
            if (!document.getElementById(id)) {
                var d = document.createElement("div");		
                self.chart[0].appendChild(d);
                d.id = id;		
                d.className = self.classGenerator(person);		
                $(d).attr("rel", person.id);
                $(d).html(_formatPerson(person, WITHSPOUSE));
                return true;
            }
            else {
                $("#" + id).offset({left:0, top:0});  //TODO possibly update the details
                return false;
            }
        };	
    };

    /**
    * renders people in a blank box.
    */
    var OutlineChartRenderer = function(params) {
        AbstractRenderer.call(this, params);
        var self = this;
        /**
        * @return true if the person did not already exist in the UI, false if it did.
        */
        this.addPerson = function(person) {
            var id = self.idGenerator(person);
            if (!document.getElementById(id)) {
                var d = document.createElement("div");		
                self.chart[0].appendChild(d);
                d.id = id;		
                d.className = self.classGenerator(person);		
                $(d).attr("rel", person.id);
                return true;
            }
            else {
                $("#" + id).offset({left:0, top:0});
                return false;
            }
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
            chartStyle : {
                lineWidth:2, 
                strokeStyle:'gray',
                fillStyle:'white'
            },
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
            highlightStyle : { 
                lineWidth:3, 
                strokeStyle:'#444'	
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
            var s = null;

            try { s = person["s"];		 	 }
            catch (e) { 
                var o = 3;
            } //this is an IE catching bug; it moans about person.s being undefined for some reason!

            try { id = person["id"];		 	 }
            catch (e) { } //this is an IE catching bug; it moans about person.s being undefined for some reason!

            if ( s !== null && s == MALE) {
                id = _params.ids.couple + id;
            } else if (FEMALE == s && typeof person.spouse == 'object') {
                id = _params.ids.couple + person.spouse.id;
            } else {
                id = _params.ids.couple + "_blank_" + id;
            }
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
            return _renderer.addPerson(person);		
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
        var _connections = [];
        var _canvas = null;
        var currentParams = null;
        var idPrefix = "";
        var isStatic = false;
        var drawConnections = true;
        var previewUI = null;
        var _previewParams = null;

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


        // todo all the code that works out horizontal, focus person etc, should be moved into the 
        // main drawing function and just passed in here. this method should take
        // (person, idx, horizontal, slots)

        var chartTypes = {

            "ancestor": function(person, _idx, drawFunction, slots, connections) {			
                var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
                var _oneLevel = function(person, idx, accumulator) {				
                    var c = _getSlot(slots, idx);
                    var p  = person || focus;					


                    // Now we're going to pull a little switch-a-roo if this is the focus and a female. 
                    // In order to get parents to display in the correct vertical order we need to render
                    // the husband first. Subsequent calls are OK already, but if the focus is a female, 
                    // that set of parents will be off
                    if(p == focus && p.s == 'F' && typeof p.spouse == 'object'){
                        p = p.spouse;
                    }

                    var wasNew = _addPerson(p);
                    c.push(p);
                    var _drawOne = function(person) {				
                        if (person) {
                            //if (accumulator.indexOf(person) == -1) {
                                //accumulator.push(person);

                                if(!person.father && !person.isBlank) {
                                    sharingTime.addBlankFather(person);
                                }
                                if(!person.mother && !person.isBlank) {
                                    sharingTime.addBlankMother(person);
                                }
                                // test for circular loop here.
                                if (person.father /*&& !person.father.id == person.id*/) {
                                    _oneLevel(person.father, idx + 1, accumulator);
                                    if (drawConnections) connections.push({p1:person, p2:person.father});
                                }
                                /*}
                                else {
                                //alert("we've aready seen person " + person.id);
                                // should we log a data error?
                                }*/
                        }				
                    };
                    _drawOne(p);
                    _drawOne(p.spouse);
                };

                _oneLevel(person, _idx, []);						
                if (!horizontal) slots.reverse();
            },

            "descendant": function(person, _idx, drawFunction, slots, connections) {
                var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
                var _oneLevel = function(person, idx) {
                    var c = _getSlot(slots, idx);
                    var p  = person || focus;
                    var wasNew = _addPerson(p);
                    c.push(p);
                    //for (var i in p.children) {
                        for (var i = 0; i < p.children.length; i++) {
                            _oneLevel(p.children[i], idx + 1);
                            if (drawConnections) connections.push({p1:person, p2:p.children[i]});
                        }
                };

                _oneLevel(person, _idx);
                if (horizontal) slots.reverse();
            },

            "bowtie" : function(person, _idx, drawFunction, slots, connections) {
                var aSlots = [], dSlots = [];
                chartTypes["ancestor"](person, _idx, chartTypes["ancestor"], aSlots, connections);						
                chartTypes["descendant"](person, _idx, chartTypes["descendant"], dSlots, connections);			
                slots.push(dSlots);
                slots.push(aSlots);
            }
        };

        /**
        * positions all the elements in a chart.  this code is shared by all the different chart types;
        * we just need some params and an array of 'slots' (lists of the people in each level of the
        * hierarchy). 
        */
        var _positionChart = function(slots) {
            var i,j,offsets;
            var co = chartDiv.offset();
            var zoom = _params.zoom || 1;

            var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
            var slot = 0, slotLengths = [];
            var slotStep = horizontal ? _params.dimensions.horizontalSlotStep : _params.dimensions.verticalSlotStep;

            // adjust position, 1st pass
            for (i = 0; i < slots.length; i++) {
                var locator = 0;
                var largestStepIndex = -1, largestStepSize = 0;
                var locatorStep = horizontal ? _params.dimensions.horizontalLocatorStep : _params.dimensions.verticalLocatorStep;				
                for (j = 0; j < slots[i].length; j++) {
                    offsets = horizontal ? {left:slot,top:locator} : {left:locator,top:slot};
                    var div = $("#" + _getDivId(slots[i][j]));

                    offsets.left = ((offsets.left /** zoom*/) + co.left) ;
                    offsets.top = ((offsets.top /** zoom*/) + co.top);

                    div.offset(offsets);
                    var stepSize = (horizontal ? div.outerWidth() : div.outerHeight());
                    if (stepSize > largestStepSize) {
                        largestStepIndex = j; largestStepSize = stepSize;
                    }
                    locator = locator + (horizontal ? div.outerHeight() /*/ zoom*/ : div.outerWidth() /*/ zoom*/) + locatorStep;
                }
                slotLengths.push(locator);
                slot = slot + (largestStepSize/*/zoom*/) + Math.min(slotStep, (slotStep /** zoom*/));  // shoulnd't this take element dimensions into account?
            }

            var maxSlotVal = Math.max.apply(Math,slotLengths);

            //single canvas		
            // adjust container size to fit snugly around the chart.		
            if (horizontal) {
                chartDiv.width(slot /** zoom*/);
                chartDiv.height(maxSlotVal);
            }
            else { 
                chartDiv.height(slot /** zoom*/);
                chartDiv.width(maxSlotVal);
            }				

            _canvas.width = chartDiv.width(); 
            _canvas.height = chartDiv.height();


            // adjust position, 2nd pass.  this centers everything with respect to the level
            // in the hierarchy that has the most people.
            for (i = 0; i < slots.length; i++) {
                var d = maxSlotVal - slotLengths[i];
                d = d / 2;
                for (j = 0; j < slots[i].length; j++) {
                    var p = $("#" + _getDivId(slots[i][j]));
                    var o = p.offset();
                    offsets = horizontal ? {left:o.left,top:o.top + (d /** zoom*/)} : {left:o.left + (d /** zoom*/),top:o.top};
                    p.offset(offsets);
                }
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
                var bSlots;
                var dSlots = slots[0].slice(0);
                var aSlots = slots[1].slice(0);
                var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
                if (horizontal) {
                    dSlots.splice(dSlots.length - 1, 1);			
                    bSlots = dSlots.concat(aSlots);
                    _positionChart(bSlots);
                }
                else {
                    aSlots.splice(aSlots.length - 1, 1);			
                    bSlots = aSlots.concat(dSlots);
                    _positionChart(bSlots);
                }
            }
        };			

        var _chartCenteringPadding = 20;
        var chartCenteringTypes = {
            "ancestor":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
                var adjustLeft,adjustTop;
                if (_params.orientation == "horizontal") {
                    adjustLeft = containerOffset.left - (chartOffset.left) + 20;				
                    adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
                    chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
                }
                else {
                    adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
                    adjustTop = containerOffset.top + containerHeight - (chartOffset.top + chartHeight + 20);
                    chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
                }
            },
            "descendant":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
                var adjustLeft,adjustTop;
                if (_params.orientation == "horizontal") {
                    adjustLeft = containerOffset.left + (containerWidth) - (chartOffset.left + (chartWidth) - 10);
                    adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
                    chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
                }
                else {
                    adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
                    adjustTop = containerOffset.top - (chartOffset.top) + 20;
                    chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});
                }
            },
            "bowtie":function(person, id, personOffset, personWidth, personHeight, containerWidth, containerHeight, containerOffset, chartWidth, chartHeight, chartOffset) {
                var adjustLeft = containerOffset.left + (containerWidth / 2) - (personOffset.left + (personWidth / 2));
                var adjustTop = containerOffset.top + (containerHeight / 2) - (personOffset.top + (personHeight / 2));
                chartDiv.animate({left:"+=" + adjustLeft + "px", top:"+=" + adjustTop + "px"}, {step:self.fireUpdate});			
            }		
        };


        var connectionPointCache = {};
        /**
        * draws a single connection.  we can use this to do the highlighting - but how will we
        * un-highlight?  dont really want to redraw the whole canvas, although perhaps it's not
        * a problem.  
        */
        var _drawAConnection = function(connection, drawFunc, ctx, containerOffset) {

            // don't draw connections if a person is blank.
            if (!connection.p1.isBlank && ! connection.p2.isBlank) {

                var id1 = _getDivId(connection.p1), id2 = _getDivId(connection.p2);
                var points;
                if (typeof connectionPointCache[id1 + "_" + id2] == 'undefined') {			
                    var d1 = $("#" + id1), d2 = $("#" + id2);
                    var o1 = d1.offset(), o2 = d2.offset(), w1 = d1.outerWidth(), w2 = d2.outerWidth(), h1 = d1.outerHeight(), h2 = d2.outerHeight();
                    points = drawFunc(connection, o1, o2, w1, w2, h1, h2);
                    for (var i = 0; i < 4; i++) {
                        points[i][0] = points[i][0]  - containerOffset.left;
                        points[i][1] = points[i][1]  - containerOffset.top;
                    }
                    connectionPointCache[id1 + "_" + id2] = points;
                }
                else
                    points = connectionPointCache[id1 + "_" + id2];

                ctx = ctx || _canvas.getContext("2d");
                var zoom = 1;
                containerOffset = containerOffset || chartDiv.offset();
                ctx.beginPath();				
                ctx.moveTo((points[0][0]) , (points[0][1]) );
                ctx.lineTo((points[1][0]) , (points[1][1]) ); 
                ctx.lineTo((points[2][0]) , (points[2][1]) ); 
                ctx.lineTo((points[3][0]) , (points[3][1]) );
                ctx.stroke();
            }
        };

        var _drawConnections = function(highlightList) {

            var ctx = _canvas.getContext("2d");
            var co = chartDiv.offset();			 

            var connectionFunction = chartConnectionTypes[_params.chartType](_connections);
            highlightList = highlightList || [];
            var highlightedConnections = highlightList.length === 0 ? [] : _connections.filter(function(conn) {
                var f = highlightList.filter(function(e) {
                    var m = (e.p1 == conn.p1 && e.p2 == conn.p2) || (e.p1 == conn.p2 && e.p2 == conn.p1);
                    if (!m) {  // if no match, if entries in highlightList are women, we may need
                        // to try matching against their spouses.  i think this is a weakness in the
                        // rendering and should be fixed.
                        if (e.p1.spouse !== null) {
                            m = (e.p1.spouse == conn.p1 && e.p2 == conn.p2) || (e.p1.spouse == conn.p2 && e.p2 == conn.p1);
                        }
                        if (!m) {
                            if (e.p2.spouse !== null) {
                                m = (e.p1 == conn.p1 && e.p2.spouse == conn.p2) || (e.p1 == conn.p2 && e.p2.spouse == conn.p1);
                            }
                        }				
                    }
                    return m;
                });
                return f.length > 0;
            });
            var i;
            if (highlightedConnections.length === 0) {
                $.extend(ctx, _params.chartStyle);
                ctx.beginPath();
                ctx.rect(0, 0, _canvas.width, _canvas.height);
                ctx.closePath();
                ctx.fill();
                for (i =0; i < _connections.length; i++) {							
                    _drawAConnection(_connections[i], connectionFunction, ctx, co);
                }
            }
            else {
                $.extend(ctx, _params.highlightStyle);
                for (i =0; i < highlightedConnections.length; i++) {
                    _drawAConnection(highlightedConnections[i], connectionFunction, ctx, co);			
                }
            }				
        };

        var chartConnectionTypes = {
            "ancestor": function(connections) {
                var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
                var drawFunc = horizontal ? function(connection, o1, o2, w1, w2, h1, h2) {
                    var p1 = [o1.left + w1, o1.top + (h1/2)];
                    var p2 = [o2.left, o2.top + (h2/2)];
                    var m1 = [p1[0] + ((p2[0] - p1[0]) / 2), p1[1]];
                    var m2 = [p1[0] + ((p2[0] - p1[0]) / 2), p2[1]];
                    return [ p1, m1, m2, p2 ];
                } : function(connection, o1, o2, w1, w2, h1, h2) {
                    var p1 = [o1.left + (w1 / 2), o1.top];
                    var p2 = [o2.left + (w2/2), o2.top + h2];
                    var m1 = [p1[0], p1[1] + ((p2[1] - p1[1]) / 2)];
                    var m2 = [p2[0], p2[1] - ((p2[1] - p1[1]) / 2)];
                    return [ p1, m1, m2, p2 ];
                };
                return drawFunc;
            },
            "descendant": function(connections) {
                var horizontal = _params.orientation !== null ? _params.orientation == HORIZONTAL : true;
                var drawFunc = horizontal ? function(connection, o1, o2, w1, w2, h1, h2) {
                    var p1 = [o1.left, o1.top + (h1/2)];
                    var p2 = [o2.left + w2, o2.top + (h2/2)];
                    var m1 = [p1[0] + ((p2[0] - p1[0]) / 2), p1[1]];
                    var m2 = [p1[0] + ((p2[0] - p1[0]) / 2), p2[1]];
                    return [ p1, m1, m2, p2 ];
                } : function(connection, o1, o2, w1, w2, h1, h2) {
                    var p1 = [o1.left + (w1 / 2), o1.top + h1];
                    var p2 = [o2.left + (w2/2), o2.top];
                    var m1 = [p1[0], p1[1] + ((p2[1] - p1[1]) / 2)];
                    var m2 = [p2[0], p2[1] - ((p2[1] - p1[1]) / 2)];
                    return [ p1, m1, m2, p2 ];
                };
                return drawFunc;
            },
            "bowtie" : function(connections) {
                // a little tricky, as the descendant anchors are on the opposite side to the ancestor anchors.  we kind of need to know the...oh
                // maybe if we passed in people ids we could match against focus and walla.
                return function(connection, o1, o2, w1, w2, h1, h2) {
                    // test the people in the connection. if p2 is the focus person, use descendant, otherwise use ancestor
                    if (connection.p2 == focus) 
                        return chartConnectionTypes["descendant"](connections)(connection, o1, o2, w1, w2, h1, h2);
                    else
                        return chartConnectionTypes["ancestor"](connections)(connection, o1, o2, w1, w2, h1, h2);
                };
            }
        };

        /**
        * animates the chart div so that it is centered on the given person. 
        */
        var _centerOn = function(person, options) {
            var ccw = chartContainer.outerWidth();

            var cch = chartContainer.outerHeight();
            var p = chartContainer.parent();
            var shrinkit = false;
            var p = chartContainer.parent();
            while(p.length > 0){
                if(p.outerHeight() < cch){
                    cch = p.outerHeight();
                    shrinkit = true;
                }
                p = p.parent();
            }
            if(shrinkit){
                chartContainer.height(cch - 50);
            }

            var cco = chartContainer.offset();
            var cw = jsZoom.outerWidth(chartDiv)
            var ch = jsZoom.outerHeight(chartDiv);
            // if chart smaller than container, center the whole chart:
            if (cw < ccw && ch < cch) {			
                //chartDiv.offset({left:cco.left + ((ccw-cw)/2), top:cco.top+((cch-ch)/2)});
                chartDiv.animate({left:((ccw-cw)/2), top:((cch-ch)/2)}, {step:self.fireUpdate});			
            }
            else {				
                var id = _getDivId(person);
                var o = $("#" + id).offset();
                var fw = $("#" + id).outerWidth();
                var fh = $("#" + id).outerHeight();
                var co = jsZoom.offset(chartDiv);//chartDiv.offset();
                //console.log("centering");
                chartCenteringTypes[_params.chartType](person, id, o, fw, fh, ccw, cch, cco, cw, ch, co);
                var cccc = jsZoom.offset(chartDiv);
                //console.log("chart is now at", cccc.left, cccc.top);
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
            focus = sharingTime.getFocus();
            var _actuallyRedraw = function() {
                var curZoom = _params.zoom || 1;
                _zoom(1);
                _connectionMap = {};
                var drawFunction = chartTypes[_params.chartType];
                _slots = [];
                _connections = [];
                drawFunction(focus, 0, drawFunction, _slots, _connections);			
                var positioningFunction = chartPositioningTypes[_params.chartType];
                positioningFunction(_slots);								
                // draw the connections!
                if (drawConnections) {
                    connectionPointCache = {};
                    _drawConnections();
                }	
                if (waitDiv) waitDiv.fadeOut();
                chartDiv.css('visibility', 'visible');			
                // center on the focused person
                if (!_params.static)
                    _centerOn(focus, {duration:1000});
                self.fireUpdate(chartDiv.offset());

                // TODO: determine whether or not we want this repainted every time we do a redraw.
                if (previewUI !== null) {

                    _previewParams = $.extend(_previewParams, params);
                    previewUI.redraw(_previewParams);
                    _zoomAndCenterPreview(previewUI);				
                }

                _zoom(curZoom);
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

        var _zoomAndCenterPreview = function(previewUI) {
            var previewChart = previewUI.getChartDiv();						
            var chartPreviewContainer = previewChart.parent();		
            // get the size of the chart, and the size of the preview chart's container
            // this will give us the zoom size of the preview chart
            var pccw = previewChart.outerWidth(), pcch = previewChart.outerHeight();
            var pcw = chartPreviewContainer.outerWidth(), pch = chartPreviewContainer.outerHeight();
            var minRatio = Math.min(pcw/pccw, pch/pcch);
            var pco = chartPreviewContainer.offset();											

            previewUI.zoom(minRatio);
            //console.log(pccw,pcch,pcw,pch,pco.left,pco.top);
            var pcow = jsZoom.outerWidth(previewChart), pcoh = jsZoom.outerHeight(previewChart);
            jsZoom.offset(previewChart, {left:pco.left + ((pcw - pcow) / 2), top:pco.top + ((pch - pcoh) / 2)});

            return minRatio;
        };

        var _reposition = function(options) {
            if (_slots) {
                _params = $.extend(_params, options);
                var positioningFunction = chartPositioningTypes[_params.chartType];
                positioningFunction(_slots);
                var connFunction = chartConnectionTypes[_params.chartType];
                _drawConnections(connFunction(_connections));
            }				
        };

        var _zoom = function(percent) {			
            jsZoom.set(chartDiv, percent);	    	
            //must call proxy dragger here, to clamp the chart movement. zoom might have moved it out of view. 
            if (proxyDragger) proxyDragger.review();
            _params.zoom = percent;
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
        * notification from SharingTime object that the chart was updated.  data is the newly updated
        * data; we need to create and append UI elements for these. and also update the focus element,
        * since new data is always in reference to some existing chart member.
        */
        var _update = function(data) {
            _redraw();
        };

        /**
        * SharingTimeUI public API and UI functionality.
        */

        this.initialize = function(_sharingTime, params) { 
            sharingTime = _sharingTime;
            sharingTime.addListener({chartUpdated:_update});
            focus = sharingTime.getFocus();
            drawConnections = (typeof params.drawConnections == 'undefined' ? true : params.drawConnections);
            idPrefix = params.idPrefix || "";
            chartDiv = $("#" + params.chartDiv);

            _canvas = document.createElement("canvas");
            _canvas.id="chartCanvas";
            chartDiv.append(_canvas);

            _canvas.width = chartDiv.width(); 
            _canvas.height = chartDiv.height();

            if (ie) {
                // for IE we have to set a big canvas size. actually you can override this, too, if 1200 pixels
                // is not big enough for the biggest connector/endpoint canvas you have at startup.
                //jsPlumb.sizeCanvas(canvas, 0, 0, DEFAULT_NEW_CANVAS_SIZE, DEFAULT_NEW_CANVAS_SIZE);
                _canvas = G_vmlCanvasManager.initElement(_canvas);
            }

            waitDiv = params.waitDiv ? $("#" + params.waitDiv) : null; 
            chartContainer = params.chartContainer ? $("#" + params.chartContainer) : chartDiv.parent();			
            // prepare the ids, classes, etc.
            var defaults = $.extend({}, _params);
            _params = $.extend(defaults, params.defaults);
            var rendererClass = params.renderer || _params.renderer;

            isStatic = params.static !== null ? params.static : false;
            if (!isStatic)
                proxyDragger = new ProxyDragger(chartContainer, chartDiv, {filterClasses:"preview individual ui-slider-handle ui-slider"});

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

            // and set zoom, if it was provided		
            _redraw(params);			

            _params.zoom = _params.zoom || 1;
            if (_params.zoom) _zoom(_params.zoom);

            if (!isStatic) {

                var hoverCache = new SimpleCache(function(item) {
                    return item.attr(REL);			
                }, function(item) {
                    var a = sharingTime.findLineageList(item.attr(REL));
                    var ids = "";
                    for (var i = 0; i < a.people.length; i++) {
                        $("#" + idPrefix + defaults.ids.person + a.people[i].id).addClass("lineage_" + item.attr(REL));
                    }
                });

                var highlightCache = new SimpleCache(function(item) {
                    return item.attr(REL);

                },
                function(item) {
                    var a = sharingTime.findLineageList(item.attr(REL));
                    var hlList = [];
                    for (var i = 0; i < a.relationships.length; i++) {
                        var r = a.relationships[i];
                        hlList.push({p1:r[0], p2:r[1]});
                    }
                    return hlList;
                });

                // setup the ancestor/descendant hover functionality.
                // $("." + defaults.classes.individual).hover(function() {
                    $(document).on('mouseenter',"." + defaults.classes.individual,function(e) {
                        $(e.target).parent().addClass(defaults.classes.hover);
                        hoverCache.get($(e.target));
                        $(".lineage_" + $(e.target).attr(REL)).addClass(defaults.classes.selected);
                        if (drawConnections) {				
                            var hlList = highlightCache.get($(e.target));
                            _drawConnections(hlList);
                        }
                    });
                    $(document).on('mouseleave',"." + defaults.classes.individual,function(e) {
                        $(e.target).parent().removeClass(defaults.classes.hover);
                        $("." + defaults.classes.individual).removeClass(defaults.classes.selected);
                        if (drawConnections) {
                            _drawConnections();
                        }	
                    });
            }

            $("#" + defaults.wait).fadeOut();
            $("#" + defaults.chart).css('visibility', 'visible');

            // initialise the preview pane if we need to:
            var previewPane = null;
            if (params.preview) {			
                params.preview.chartType = _params.chartType;
                params.preview.orientation = _params.orientation;
                params.preview.zoom = 1;
                // here we set a few default values.
                if (typeof params.preview.drawConnections == 'undefined') {
                    params.preview.drawConnections = false;
                }
                if (typeof params.preview.static == 'undefined') {
                    params.preview.static = true;
                }
                params.preview.renderer = "standard";
                if (typeof params.preview.idPrefix == 'undefined') { 
                    params.preview.idPrefix = "preview_";
                }

                previewUI = new SharingTimeUI();						
                previewUI.initialize(sharingTime, params.preview);
                var previewChart = previewUI.getChartDiv();						
                var chartPreviewContainer = previewChart.parent();

                var minRatio = _zoomAndCenterPreview(previewUI);

                previewPane = new PreviewPane({chartZoom:_params.zoom, previewZoom:minRatio, container:chartContainer, chart:chartDiv, preview:previewChart, previewContainer:chartPreviewContainer});
                _previewParams = params.preview;
            }
            if (!isStatic) {
                var min = params.minZoom || 0.2, max = params.maxZoom || 2.5, step = params.zoomStep || 0.1;
                var slider = params.slider || "#slider", wheel = params.wheel || "#chartContainer";
                var zh = new ZoomHandler({ minZoom:min, maxZoom:max, zoomStep:step, slider:slider, wheel:wheel, onZoom:_zoom });

                if (previewPane !== null) {
                    proxyDragger.addListener(previewPane);
                    zh.addListener(previewPane);		
                    self.addListener(previewPane); 
                    previewPane.addListener({
                        previewDragEvent : function(pos) {
                            proxyDragger.moveToPosition(pos);
                        }
                    });
                }
            }		
        };
        this.getChartDiv = function() { return chartDiv; };
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
        this.focus = focus;
        this.getProxyDragger = function() { return proxyDragger; };
    };
})();
