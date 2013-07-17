/*
 * jsZoom is a toolkit that supports zooming elements on a page.  For modern browsers
 * it uses CSS3's 'scale' property; for, erm, other browsers it uses the 'zoom' property.
 * 
 * jsZoom has been tested on Chrome, Safari, FF 3.x and IE7/8.  It probably works
 * on other WebKit browsers, too, but something's up on Opera right now.
 * 
 * Currently, the 'translate' property is not supported, but it should be.  And hopefully
 * soon will be.
 */
(function() {
	
	var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
	var ZOOM = "zoom", SCALE = "scale", MOZ_TRANSFORM = "-moz-transform",
		WEBKIT_TRANSFORM = "-webkit-transform", O_TRANSFORM = "-o-transform",
		TRANSFORM = "transform", FONT_SIZE = "font-size", LINE_HEIGHT = "line-height",
		UNKNOWN = "unknown";
	
	var _toScale = function(v) { return SCALE + "(" + v + ")"; };
	var _matrixDecoder = function(v) {
		// pattern: matrix(0.69, 0, 0, 0.69, 0px, 0px)
		var i1 = v.indexOf("("), i2 = v.indexOf(",");
		return v.substring(i1 + 1, i2);
	};
	var _scaleDecoder = function(v) {
		// pattern: scale(0.69)
		var i1 = v.indexOf("("), i2 = v.indexOf(")");
		return v.substring(i1 + 1, i2);
	};
	var _decoders = {
		"-moz-transform" 	: _matrixDecoder,
		"-webkit-transform" : _scaleDecoder,
		"-o-transform" 		: _matrixDecoder,
		"transform"			: _scaleDecoder	
	};
	var _encoders = {
		"-moz-transform" 	: _toScale,
		"-webkit-transform" : _toScale,
		"-o-transform" 		: _toScale,
		"transform"			: _toScale		
	};
	
	var _getZoomAndProperty = function(element) {
		if (!ie) {
			for (var i in _decoders) {
				try {
					var v = element.css(i);
					if (v && v != "none") {
						var vv = _decoders[i](v);
						if (vv) return [vv, i];
					}
				}
				catch (e) { }
			}
			return [1, UNKNOWN];
		}
		else {
			return [element.css(ZOOM), ZOOM];
		}
	};
	
	var _getOffset = function(element) {
		var scale = _getZoomAndProperty(element);
		var o = element.offset();
		if (WEBKIT_TRANSFORM == scale[1] || scale[0] == 1) {
            return o;
        } else {
			var l = o.left + (element.outerWidth() * (1 - scale[0]) / 2), t = o.top + (element.outerHeight() * (1 - scale[0]) / 2);
			return {left:l, top:t};
		}
	};
	
	/**
	 * sets the offset of the given element so that a call to .offset() would
	 * return the value passed in here; that is to say converts the point to one
	 * that makes sense given its current zoom.   
	 */
	var _setOffset = function(element, offset) {
		var scale = _getZoomAndProperty(element);
		if (WEBKIT_TRANSFORM == scale[1] || scale[0] == 1) { 
            return element.offset(offset);
        } else {
			var l = offset.left - (element.outerWidth() * (1 - scale[0]) / 2), t = offset.top - (element.outerHeight() * (1 - scale[0]) / 2);
			return element.offset({left:l, top:t});
		}
	};
	
	var jsZoom = window.jsZoom = {
		
		/**
		 * sets the current zoom for the given element.
		 */
		set : function(element, zoomAsADecimal) {
			if (!ie) {
				for (var i in _encoders) {
					element.css(i, _encoders[i](zoomAsADecimal));
				}
			}
			else {
				element.css(ZOOM, zoomAsADecimal);
			}
		},			
		
		/**
		 * gets the current zoom, as a decimal, for the element.
		 */
		get : function(element) {
			return _getZoomAndProperty(element)[0];
		},
		
		/**
		 * returns the visible width of the element, taking zoom into account.
		 */
		outerWidth : function(element) {
			return jsZoom.get(element) * element.outerWidth();			
		},
		
		/**
		 * returns the visible height of the element, taking zoom into account.
		 */
		outerHeight : function(element) {
			return jsZoom.get(element) * element.outerHeight();			
		},
		
		/**
		 * gets or sets the offset.  
		 * 
		 * when setting offset, you pass in the location on the screen where you
		 * want the left,top corner of this element to appear. under the hood, jsZoom will translate 
		 * that, taking into account the current zoom.
		 * 
		 * when getting an offset, jsZoom returns you where the left,top corner is
		 * in absolute terms on the display.
		 */
		offset : function(element, offset) {
			if (arguments.length == 1) {
                return _getOffset(element);
            } else {
                return _setOffset(element, offset);
            }
		}
	};
})();
