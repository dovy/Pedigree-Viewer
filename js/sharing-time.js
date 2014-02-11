// family search demo js


(function() {	
	
	// incredibly, some versions of IE8 do not even have this method.
	if (!('filter' in Array.prototype)) {
	    Array.prototype.filter= function(filter, that /*opt*/) {
	        var other= [], v;
	        for (var i=0, n= this.length; i<n; i++)
	            if (i in this && filter.call(that, v= this[i], i, this))
	                other.push(v);
	        return other;
	    };
	}
	
	var _listeners = [];
	var MALE = 'M', FEMALE = 'F';
	var _people = null;
	var _focus = null;
	var _focusPerson = null;
	var _peopleTree = [];
	var _cachedItems = {};
	
	/**
	 * creates a "blank" father and assigns it to the given person. note a small weakness here; if
	 * used in conjunction with addBlankMother, this method has to be called first.
	 */
	var _addBlankFather = function(person) {
		person.father = _blankPerson(person, MALE);
		_addChild(person.father, person);
		person.f = person.father.id;
		_people.push(person.father);
	};		
	
	/**
	 * creates a "blank" mother and assigns it to the given person. note a small weakness here; if
	 * used in conjunction with addBlankFather, this method has to be called second, or the father
	 * and mother connections will not be established.
	 */
	var _addBlankMother = function(person) {	
		person.mother = _blankPerson(person, FEMALE);
		_addChild(person.mother, person);				
		person.m = person.mother.id;
		person.mother.spouse = person.father;
		person.mother.sp = person.father.id;
		person.father.spouse = person.mother;
		person.father.sp = person.mother.id;
		_people.push(person.mother);
	};
	
	var _addBlankParents = function(person) {
		_addBlankFather(person);
		_addBlankMother(person);
	};
	
	/**
	 * adds a child to this person's list, creating the list if necessary
	 * @param person person to add child to.
	 * @param child child to add.
	 * @return the person.
	 */
	var _addChild = function(person, child) {
		if (!person.children) person.children = [];
		person.children.push(child);
		return person;
	};
	
	/**
	 * adds a listener.
	 * @param l listener.  should implement 'chartUpdated' method.
	 */
	var _addListener = function(l) {
		_listeners.push(l);
	};
	
	/**
	 * creates a blank person.
	 */
	var _blankPerson = function(referencePerson, sex) {
		return {
			fn:'', sn:'', s:sex || '', children:[],
			f:null, m:null, sp:null,
			id:(new Date()).getTime() + "_" + sex + "_" + referencePerson.id,
			isBlank : true, reference: referencePerson
		};
	};
	
	/**
	 * caches a value for the given id,category pair, where id is some person's id and category
	 * is something like 'lineageList', 'offspring', etc.  note that this method returns the item
	 * it was asked to cache, so you can call it at the end of a function like this:
	 * 
	 * return _cache(id, "someCategory", MyReturnValue);
	 * 
	 * @param id id of the person to cache against.
	 * @param category type of item to cache.
	 * @param item item to cache. 
	 * @see _clearCache, _fromCache
	 */
	var _cache = function(id, category, item) {
	//	_log("cache called: id is " + id);
		var items = _cachedItems[category];
		if (items == null) {
			items = {};
			_cachedItems[category] = items;
		}
		items[new String(id)] = item;
		return item;
	};
	
	/**
	 * clears everything out of the cache. perhaps we could tweak this to take a list
	 * of categories at some stage, if that would be useful.
	 */
	var _clearCache = function() {
		for (var i in _cachedItems)
			delete _cachedItems[i];
	};
	
	
	/**
	 * Finds all the ancestors for a given person.  needs rework.
	 */
	var _findAncestors = function(id) {
		var a = _fromCache(id, "ancestors");
		if (a) return a;
		var l = [];
		var me = _findPerson(id);
		if (me) {
			var _checkOne = function(p, list) {
				// male centric here.  should take a comparator function.
				if (p.f != null) {
					var a = _findPerson(p.f);
					list.push(a);
					_checkOne(a, list);
				}
				if (p.m != null) {
					var a = _findPerson(p.m);
					list.push(a);
					_checkOne(a, list);
				}
			};				
			_checkOne(me, l);			
		};
		return _cache(id, "ancestors", l);		
	};
	
	var _findDescendants = function(id) {
		var d = _fromCache(id, "descendants");
		if (d) return d;
		var l = [];
		var me = _findPerson(id);
		if (me) {
			var _checkOne = function(p, list) {
				var o = _findOffspring(p.id);
				for (var i = 0; i < o.length; i++) {
					list.push(o[i]);
					_checkOne(o[i], list);
				}
			};				
			_checkOne(me, l);			
		};
		return _cache(id, "descendants", l);		
	};
	
	var _findLineageList = function(p) {
        if(typeof p == 'undefined'){
            return {people:[],relationships:[]};
        }

		var id = typeof p == 'string' ? p : p.id;
		var ll = _fromCache(id, "lineagelist");
		if (!ll) {
			var l = [];
			var r = [];
			var processAParentLevel = function(person, l, r) {
				if (typeof person == 'string') person = _findPerson(person);  // all methods should do this.
				if (person.father) {
					l.push(person.father);
					r.push([person, person.father]);
					processAParentLevel(person.father, l, r);
				}
				if (person.mother) {
					l.push(person.mother);
					r.push([person, person.mother]);
					processAParentLevel(person.mother, l, r);
				}
			};
			processAParentLevel(p, l, r);
			
			var processAChildLevel = function(person, l, r) {
				if (typeof person == 'string') person = _findPerson(person);  // all methods should do this.		
				for (var i = 0; i < person.children.length; i++) {
					l.push(person.children[i]);
					r.push([person, person.children[i]]);
					processAChildLevel(person.children[i], l, r);
				}
			};
			processAChildLevel(p, l, r);
			return _cache(p, "lineagelist", {people:l, relationships:r});
		}
		else {  return ll; }
	};
	
	/**
	 * Finds all the offspring for the person with the given id.
	 */
	var _findOffspring = function(id) {
		var o = _fromCache(id, "offspring");
		if (o) return o;
		return _cache(id, "offspring", _people.filter(function(p) { return id == p.f || id == p.m }));
	};
	
	var _findParents = function(id) {
		var pa = _fromCache(id, "parents");
		if (pa) return pa;
		var p =_findPerson(id);
		var parents = {mother:null, father:null};
		if (p) {
			parents.mother = _findPerson(p.m);
			parents.father = _findPerson(p.f);
		}
		return _cache(id, "parents", parents);
	};
	
	/**
	 * Finds the person with the given id.
	 * @param id
	 * @return
	 */
	var _findPerson = function(id) {
		var l = _fromCache(id, "person");
		if (l) return l;		
		l = _people.filter(function(person) { return person.id == id; });		
		return l.length > 0 ? _cache(id, "person", l[0]) : null;
	};		
	
	/**
	 * Finds the spouse for the person with the given id.
	 */
	var _findSpouse = function(id) {
		var s = _fromCache(id, "spouse");
		if (s) return s;
		var p = _findPerson(id);
		var spouse = null;
		if (p && p.sp) spouse = _findPerson(p.sp);
		return _cache(id, "spouse", spouse);
	};
	
	var _fireEvent = function(name, data) {
		for (var i in _listeners) {
			var l = _listeners[i];
			try { l[name](data); }
			catch (e) { }
		}
	};
	
	/**
	 * gets a value from the cache.
	 * @param id person's id
	 * @category what to get from the cache
	 */
	var _fromCache = function(id, category) {
		var items = _cachedItems[category];
		return items == null ? null : items[new String(id)];
	};
	
	/**
	 * initializes the given person by finding their mother and father and assigning them.
	 * 
	 */
	var _initializePerson = function(p) {
		if (!p.children) p.children = [];
		if (p.sp != null) p.spouse = _findPerson(p.sp);
		if (p.f != null) {
			var f = _findPerson(p.f);
			// here we check for circular dependencies..although perhaps not the most
			// robust, since a circular dependency could be established between two people of
			// the same ancestry that are more than one generation apart.
			if (f && f.f != p.id && f.m != p.id) p.father = f; 
			if (p.father) _addChild(p.father, p);
		}			
		if (p.m != null) {
			var m = _findPerson(p.m);
			if (m && m.m != p.id && m.f != p.id) p.mother = m;
			if (p.mother) _addChild(p.mother, p);
		}
		
		//_findLineageList(p.id);  // prime the cache!
	};

	var _initialize = function() {
		for (var i = 0; i < _people.length; i++) {
			var p = _people[i];
			_initializePerson(p);
		}		
	};

    var refocus = function(personId){
        _focusPerson = _findPerson(personId);
    };
	
	var _log = function(msg) {
		if (typeof console != "undefined") {
			try { console.log(msg); }
			catch (e) {};
		}
	};
	
	/**
	 * appends the given data, which is expected to have a 'focus' individual and a list of
	 * other people.  the focus individual should already exist; their record is updated.
     * Not 100% this function actually works or gets called :-/
	 */
	var _append = function(data) {
		for (var i in data.people) {
			_people.push(data.people[i]);
			_initializePerson(data.people[i]);
		}
		// now update the focus person
		var f = _findPerson(data.focus.id);
		_initializePerson(f);
		_focus = data.focus.id;
		_focusPerson = _findPerson(_focus);
		_fireEvent("chartUpdated", data);
	};

    var _addPeople = function(people){
        for(var i in people){
            if(!_findPerson(i)){
                _people.push(people[i]);
            }
        }
        for(var i in people){
            _initializePerson(people[i]);
        }
    }
				
	var _sharingTime = function(data) {
		_people = data.people;
		_focus = data.focus;
		_focusPerson = _findPerson(_focus);
		_initialize();
		var self = this;
		this.addBlankFather = _addBlankFather;
		this.addBlankMother = _addBlankMother;
		this.addBlankParents = _addBlankParents;
		this.addListener = _addListener;
		this.findAncestors = _findAncestors;
		this.findDescendants = _findDescendants;
		this.findLineageList = _findLineageList;
		this.findParents = _findParents;
		this.findPerson = _findPerson;		
		this.findOffspring = _findOffspring;		
		this.findSpouse = _findSpouse;
		this.getFocus = function() { return _focusPerson; };
		this.getPeopleCount = function() { return _people.length; };
		this.makeBlankPerson = _blankPerson;						
		this.append = _append;
        this.addPeople = _addPeople;
        this.people = _people;
        this.focus = _focus;
        this.refocus = refocus;
	};
	
	var SharingTime = window.SharingTime = {
		getInstance : function(data) {
			return new _sharingTime(data);
		}			
	};	
})();
