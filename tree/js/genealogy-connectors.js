// connectors for sharing time's genealogy chart. 
(function() {
	
	jsPlumb.Connectors.Genealogy = function(params) {
		params = params || {};
		var minStubLength = params.minStubLength || 30;
		var padding = 20;
		this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth) {
			var result = [];
			var so = sourceAnchor.getOrientation(), to = targetAnchor.getOrientation();
			var dx = Math.abs(sourcePos[0] - targetPos[0]) / 2;
			var dy = Math.abs(sourcePos[1] - targetPos[1]) / 2;
			// x,y,w,h
			var tlX = Math.min(sourcePos[0], targetPos[0]) - padding;
			var tlY = Math.min(sourcePos[1], targetPos[1]) - padding;
			var w = Math.abs(sourcePos[0] - targetPos[0]) + padding * 2;
			var h = Math.abs(sourcePos[1] - targetPos[1]) + padding * 2;
			result.push(tlX);result.push(tlY);result.push(w);result.push(h);
			// start position
			result.push(sourcePos[0] - tlX);result.push(sourcePos[1] - tlY);
			// first stub
			result.push(sourcePos[0] + (dx * so[0]) - tlX);
			result.push(sourcePos[1] + (dy * so[1]) - tlY);
			// second stub
			result.push(targetPos[0] + (dx * to[0]) - tlX);
			result.push(targetPos[1] + (dy * to[1]) - tlY);
			// end position
			result.push(targetPos[0] - tlX);result.push(targetPos[1] - tlY);
			
			return result;
		};
		
		this.paint = function(dimensions, ctx) { 
			ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.lineTo(dimensions[8], dimensions[9]);
            ctx.lineTo(dimensions[10], dimensions[11]);
            ctx.stroke();
		};
	};
})();