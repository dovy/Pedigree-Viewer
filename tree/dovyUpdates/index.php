	
<?php
session_start();
include('header.inc'); ?>

		<div class="fixed" id="sub-nav"><div class="page-title">
			<h1>HTML5/JS Pedigree</h1>
		</div>
<?php include('top_buttons.php'); ?></div>
		<div class="fixed" id="page-layout"><div id="page-content">
			<div id="page-content-wrapper" class="unselectable" style="margin: 0 !important; padding: 0 !important;">

				<link rel="stylesheet" href="style.css">
				
<div id="tree" class="ui-corner-all">
	<div id="chartContainer"> 
		<div id="chart"></div> 
		<div id="wait">please wait...loading</div> 
	</div> 
	<div id="chartPreviewContainer"> 
		<div id="chartPreview"></div> 
	</div> 
	<div id="info"></div>		
	
  	<script type="text/javascript" src="/js/excanvas.js"></script> 
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.min.js"></script>	
	<script type="text/javascript" src="../js/jquery.mousewheel.js"></script>
	<script type="text/javascript" src="../js/jsZoom.js"></script>
	<script type="text/javascript" src="../js/sharing-time.js"></script> 
	<script type="text/javascript" src="../js/sharing-time-ui.js"></script>
	<script type="text/javascript" src="../js/sharing-time-chart.js"></script> 


	<script type="text/javascript"> 
		$(document).ready(function() {			
			var chart = new SharingTimeChart({dataUrl:"../data/nine_levels.json"});	

			chart.load({
				chartDiv : "chart",
				chartContainer : "chartContainer",
				chartType:'<? if ($_GET['ctype'] != "") echo $_GET['ctype']; else echo "ancestor";  ?>',
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
		});
	</script> 	

<div style="-webkit-user-select: none; z-index: 0; position: absolute; left: -1px; top: 5px; overflow-x: hidden; overflow-y: hidden; text-align: left; width: 90px; height: 196px; z-index: 9999;" class="gmnoprint unselectable" id="lmc3d">
  <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; overflow-x: hidden; overflow-y: hidden; "></div>
  <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; ">
    <div style="left: 16px; top: 17px; width: 59px; height: 62px; overflow-x: hidden; overflow-y: hidden; position: absolute; "><img style="position: absolute; left: 0px; top: 0px; -webkit-user-select: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; -webkit-user-drag: none; " src="http://maps.gstatic.com/intl/en_us/mapfiles/mapcontrols3d5.png"></div>
  </div>
  <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; " id="compass" title="">
    <div style="position: absolute; left: 36px; top: 17px; width: 18px; height: 18px; cursor: pointer; " rel="up" class="pan" title="Pan up"></div>
    <div style="position: absolute; left: 16px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="left" class="pan" title="Pan left"></div>
    <div style="position: absolute; left: 56px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="right" class="pan" title="Pan right"></div>
    <div style="position: absolute; left: 36px; top: 57px; width: 18px; height: 18px; cursor: pointer; " rel="down" class="pan" title="Pan down"></div>
    <div style="position: absolute; left: 36px; top: 37px; width: 18px; height: 18px; cursor: pointer; " id="centerFocus" title="Return to the focus couple"></div>
  </div>
<div id="slider" style="position: absolute; left: 40px; top: 78px;"></div>  
</div>



			<div class="clear"></div>
		</div>
	</div>
<?php include('footer.inc'); ?>
