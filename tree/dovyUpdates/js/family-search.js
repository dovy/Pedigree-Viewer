// family search demo js


(function() {
	
	// logic functions	
	var _people = null;
	var _focus = null;
	var _focusPerson = null;
	var _peopleTree = [];
	
	var _personCache = {};
	
	/**
	 * finds the person with the given id.
	 * @param id
	 * @return
	 */
	var _findPerson = function(id) {
		var l = _personCache[new String(id)];
		if (!l) {
			l = _people.filter(function(person) { return person.id == id; });
			if (l.length > 0) _personCache[new String(id)] = l;
		}
		return l.length > 0 ? l[0] : null;
	};
	
	var _findAncestors = function(id) {
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
			};				
			_checkOne(me, l);			
		};
		return l;		
	};
	
	var _findOffspring = function(id) {
		// cache..
		return _people.filter(function(p) { return id == p.f || id==p.m });
	};
	
	var _findLineageList = function(id) {
		var l = _findAncestors(id);
		var addOffspring = function(id) {
			var o = _findOffspring(id);
			if (o && o.length > 0) {
				l = l.concat(o);
				for (var i = 0; i < o.length; i++) {
					addOffspring(o[i].id);
				}
			};
		};
		addOffspring(id);
		return l;
	};
		
		
	var _familySearch = function(data) {
		_people = data.people;
		_focus = data.focus;
		var self = this;		
		this.findPerson = _findPerson;
		this.findAncestors = _findAncestors;
		this.findOffspring = _findOffspring;
		this.findLineageList = _findLineageList;
		_focusPerson = _findPerson(_focus);
		this.getFocus = function() { return _focusPerson; };
	};
	
	var FamilySearch = window.FamilySearch = {
		getInstance : function(data) {
			return new _familySearch(data);
		}			
	};	
})();