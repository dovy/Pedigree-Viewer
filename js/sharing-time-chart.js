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
		var sharingTime = null, ui = null;
		var panFuncs = null; 
		
		this.HORIZONTAL = "horizontal";
		this.VERTICAL = "vertical";
				
		this.load = function(options, requestParameters) {
			ui = new SharingTimeUI();
			requestParameters = requestParameters || {};
			var finalReqParams = $.extend({ a: params.a, d: params.d, nfsid: params.nfsid }, requestParameters);

			(function(d) {
				sharingTime = SharingTime.getInstance(d['data']);				
				ui.initialize(sharingTime, options);
				panFuncs = { "left":ui.panLeft, "up":ui.panUp, "right":ui.panRight, "down":ui.panDown };
			})(params.data);

		};
		
		/**
		 * Pan the chart in the given direction. 
		 * @param direction One of "left", "up", "down", "right"
		 */
		this.pan = function(direction) {			
			panFuncs[direction]();
		};
		
		/**
		 * Recenters the chart to the currently focused individual.
		 */
		this.recenter = function() {
			ui.recenter();
		};
		
		/**
		 * Sets the orientation of the chart.
		 * @param orientation Either "horizontal" or "vertical"
		 */
		this.setOrientation = function(orientation) {
			ui.redraw({ orientation:orientation });
		};
	};	
})();
