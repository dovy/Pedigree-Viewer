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
    $(".pan").bind("click", function() {
        chart.pan($(this).attr("rel"));
    });

    $("#centerFocus").bind('click', function() {
        chart.recenter();
    });

    // orientation
    $(".chkOrientation").click(function() {
        chart.setOrientation($(this).attr("rel"));
    });	
    $('#slider').removeClass('ui-slider-horizontal');

    return chart;
}
