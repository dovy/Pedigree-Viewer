<!DOCTYPE html>
<html>
    <head>
	<meta charset="utf-8">
	<title>Descendants of Patrick McGuinness</title>

	<link href="css/style.css" rel="stylesheet" media="all">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

<!-- From here: https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js --> 
<script type="text/javascript" src="js/jquery.mousewheel.js"></script>


<script type="text/javascript" src="js/jsZoom.js"></script>
<script type="text/javascript" src="js/sharing-time.js"></script> 
<script type="text/javascript" src="js/sharing-time-ui.js"></script>
<script type="text/javascript" src="js/sharing-time-chart.js"></script> 


<script type="text/javascript"> 
$(document).ready(function(){
    var chart = new SharingTimeChart({dataUrl:"data.json"});	

    <?php
	if(array_key_exists('ged',$_GET) && file_exists('lib/php-gedcom')){
	    $args['ged'] = $_GET['ged'];

	    if(array_key_exists('i',$_GET)){
		$args['i'] = $_GET['i'];
	    }
	    if(array_key_exists('a',$_GET)){
		$args['a'] = $_GET['a'];
	    }
	    if(array_key_exists('d',$_GET)){
		$args['d'] = $_GET['d'];
	    }

	    $dataUrl = "makeJson.php" . http_build_query($args);
	}
	
	if(!isset($dataUrl)){
	    $dataUrl = 'data.json';
	}
	
    ?>

    var chart = new SharingTimeChart({dataUrl:"<?=$dataUrl?>"});	

    chart.load(
	{
	    chartDiv : "chart",
		chartContainer : "chartContainer",
		chartType:'bowtie',
		orientation: 'horizontal',
	    defaults:
	    {						
		highlightPaintStyle:{ lineWidth:12, strokeStyle:'#736d66' } // this is for highlighting connectors
	    },
	    preview : 
	    {
		chartDiv : "chartPreview",
		    chartContainer : "chartPreviewContainer"
	    },
	    limit:100
	}
    );

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
});
</script> 	
	</head>
	<body>
	    <div id="page_wrapper">
		<h1>Descendants of Patrick McGuinness</h1>
		<div id="page-header">
		</div>
		    <div class="fixed" id="page-layout"><div id="page-content">
			    <div id="page-content-wrapper" class="unselectable" style="margin: 0 !important; padding: 0 !important;">
				<div id="tree" class="ui-corner-all">
				    <div id="chartContainer"> 
					<div id="chart"></div> 
					<div id="wait">please wait...loading</div> 
				    </div> 
				    <div id="chartPreviewContainer"> 
					<div id="chartPreview"></div> 
				    </div> 
				</div>
			    </div>
			</div>
		</div>
	    </body>
	</html>
