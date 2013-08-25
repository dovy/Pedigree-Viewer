/**
 * This is the main chart entry point, wrapping sharing-time-ui.js (which itself
 * wraps sharing-time.js).  This script is used to manage things like ajax access, orientation
 * changes, etc. 
 */

(function() {
	
	var _defaults = {
			
			
	};

	/**
	 * SharingTime chart.  params should have, at the minimum, the endpoint for data:
	 * { dataUrl:....}
	 */
	var SharingTimeChart = window.SharingTimeChart = function(params) {
		params = params || {};
		var p = $.extend({}, _defaults);
		$.extend(p, params);

		this.sharingTime = null;
        this.ui = null;
		this.panFuncs = null; 
		
		this.HORIZONTAL = "horizontal";
		this.VERTICAL = "vertical";
				
		this.load = function(options, requestParameters) {
            this.options = options;
			this.ui = new SharingTimeUI();
			requestParameters = requestParameters || {};
			var finalReqParams = $.extend({ a: params.a, d: params.d, nfsid: params.nfsid }, requestParameters);

            this.sharingTime = SharingTime.getInstance(params.data.data);
            this.ui.initialize(this.sharingTime, options);
            this.panFuncs = { 
                "left":this.ui.panLeft, 
                "up":this.ui.panUp, 
                "right":this.ui.panRight, 
                "down":this.ui.panDown 
            };
		};
		
		/**
		 * Pan the chart in the given direction. 
		 * @param direction One of "left", "up", "down", "right"
		 */
		this.pan = function(direction) {			
			this.panFuncs[direction]();
		};

        this.dragPan = function(x,y){
            this.ui.dragPan(x,y);
        };
		
		/**
		 * Recenters the chart to the currently focused individual.
		 */
		this.recenter = function() {
			this.ui.recenter();
		};
		
		/**
		 * Sets the orientation of the chart.
		 * @param orientation Either "horizontal" or "vertical"
		 */
		this.setOrientation = function(orientation) {
			this.ui.redraw({ orientation:orientation });
		};

        this.refocus = function(personId){
            // Remove people
            $('#chart').children('div').remove();
            // Clear canvas now
            var canvas = $('#chartCanvas')[0];
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.sharingTime.refocus(personId);
            // clear existing stuff
            this.ui.redraw();
        };
	};	
})();
