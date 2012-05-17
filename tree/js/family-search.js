// family search demo js


(function() {	
	
	// incredibly, some versions of IE8 do not event have this method.
	if (!('filter' in Array.prototype)) {
	    Array.prototype.filter= function(filter, that /*opt*/) {
	        var other= [], v;
	        for (var i=0, n= this.length; i<n; i++)
	            if (i in this && filter.call(that, v= this[i], i, this))
	                other.push(v);
	        return other;
	    };
	}
	
	var Person = function(data) {
		data = data || {};
		this.id = data.id;   // todo auto create a temp id for new people?
		this.firstname = data.fn;
		this.surname = data.sn;
		this.father = data.f;
		this.mother = data.m;
		this.sex = data.s;
		this.spouse = data.sp;		
	};
	
	var Couple = function(data1, data2) {
		// todo does a Couple need an id too?  could be handy.
		this.person1 = new Person(data1);
		this.person2 = new Person(data2);
		this.focus = this.person1;				// i see this being used as a convenience accessor.
	};
	
	var MALE = 'M', FEMALE = 'F';
	
	// logic functions	
	var _people = null;
	var _focus = null;
	var _focusPerson = null;
	var _peopleTree = [];
		
	var _personCache = {};	
	
	/**
	 * creates a blank person.
	 */
	var _blankPerson = function(referencePerson, sex) {
		return {
			fn:'',
			sn:'',
			s:sex || '',
			children:[],
			f:null,
			m:null,
			sp:null,
			id:(new Date()).getTime() + "_" + sex + "_" + referencePerson.id,
			isBlank : true ,
			reference: referencePerson
		};
	};
	
	/**
	 * Finds the person with the given id.
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
	
	var _findParents = function(id) {
		var p =_findPerson(id);
		var parents = {mother:null, father:null};
		if (p) {
			parents.mother = _findPerson(p.m);
			parents.father = _findPerson(p.f);
		}
		return parents;
	};
	
	/**
	 * Finds all the ancestors for a given person.  needs rework.
	 */
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
				if (p.m != null) {
					var a = _findPerson(p.m);
					list.push(a);
					_checkOne(a, list);
				}
			};				
			_checkOne(me, l);			
		};
		return l;		
	};
	
	var _findDescendants = function(id) {
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
		return l;		
	};
	
	/**
	 * Finds all the offspring for the person with the given id.
	 */
	var _findOffspring = function(id) {
		// cache..
		return _people.filter(function(p) { return id == p.f || id == p.m });
	};
	
	/**
	 * Finds all ancestors and descendants for the person with the given id.
	 */
	var _findLineageList = function(id) {
		var l = _findAncestors(id);
		l = l.concat(_findDescendants(id));
		return l;
	};
	
	var _alternateFindLineageList = function(p) {
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
		return {people:l, relationships:r};
		
	};
	
	/**
	 * Finds the spouse for the person with the given id.
	 */
	var _findSpouse = function(id) {
		// cache... all these should go through a helper method that can cache by category.
		var p = _findPerson(id);
		var spouse = null;
		if (p && p.sp)
			spouse = _findPerson(p.sp);
		return spouse;
	};

	/**
	 * adds a child to this person's list, creating the list if necessary
	 * @param person
	 * @param child
	 * @return the person.
	 */
	var _addChild = function(person, child) {
		if (!person.children) person.children = [];
		person.children.push(child);
		return person;
	};

	var _initialize = function() {
		for (var i = 0; i < _people.length; i++) {
			var p = _people[i];
			if (!p.children) p.children = [];
			if (p.sp != null) p.spouse = _findPerson(p.sp);
			if (p.f != null) {
				p.father = _findPerson(p.f);
				if (p.father) _addChild(p.father, p);
			}			
			if (p.m != null) {
				p.mother = _findPerson(p.m);
				if (p.mother) _addChild(p.mother, p);
			}
		}		
	};
	
	var _addBlankFather = function(person) {
		person.father = _blankPerson(person, MALE);
		_addChild(person.father, person);
		person.f = person.father.id;
		_people.push(person.father);
	};
	
	var _addBlankParents = function(person) {
		_addBlankFather(person);
		_addBlankMother(person);
	};
	
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
		
	var _sharingTime = function(data) {
		_people = data.people;
		_focus = data.focus;
		_initialize();
		var self = this;
		this.findDescendants = _findDescendants;
		this.findParents = _findParents;
		this.findPerson = _findPerson;
		this.findAncestors = _findAncestors;
		this.findOffspring = _findOffspring;
		this.findLineageList = _findLineageList;
		this.alternateFindLineageList = _alternateFindLineageList;
		this.findSpouse = _findSpouse;
		this.makeBlankPerson = _blankPerson;
		this.addBlankFather = _addBlankFather;
		this.addBlankMother = _addBlankMother;
		this.addBlankParents = _addBlankParents;
		_focusPerson = _findPerson(_focus);
		this.getFocus = function() { return _focusPerson; };
	};
	
	var SharingTime = window.SharingTime = {
		getInstance : function(data) {
			return new _sharingTime(data);
		}			
	};	
})();