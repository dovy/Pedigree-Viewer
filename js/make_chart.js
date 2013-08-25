function makeStChart(json){
    var chart = new SharingTimeChart({data:json});	

    chart.load({
        chartDiv : "chart",
        chartContainer : "chartContainer",
        chartType:'bowtie',
        orientation: 'horizontal',
        defaults:{						
            highlightPaintStyle:{ lineWidth:12, strokeStyle:'#736d66' } // this is for highlighting connectors
        },
        preview : {
            chartDiv : "chartPreview",
            chartContainer : "chartPreviewContainer"
        },
        limit:7
    });

    // pan
    $(".pan").on("click", function() {
        chart.pan($(this).attr("rel"));
    });

    $('#chartContainer').on('touchmove',function(e){
        var touches = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]; 
        var xdist = touches[0].pageX - touches[touches.length - 1].pageX; 
        var ydist = touches[0].pageY - touches[touches.length - 1].pageY; 
        chart.dragPan(xdist,ydist);
    });

    $("#centerFocus").on('click', function(e) {
    });

    // orientation
    $(".chkOrientation").on('click',function(e) {
        chart.setOrientation($(this).attr("rel"));
    });	
    $('#slider').removeClass('ui-slider-horizontal');

    return chart;
}
