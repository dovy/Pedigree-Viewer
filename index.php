<!DOCTYPE html>
<html>
<!--
    https://github.com/stuporglue/Pedigree-Viewer/

    This code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE
    http://www.gnu.org/licenses/agpl-3.0.html

    SharingTime Pedigree Viewer
    Copyright (C) 2012 Real Time Collaboration

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/agpl-3.0.html>.
-->
    <head>
	<meta charset="utf-8">
	<title>HTML5 Pedigree-Viewer Demo</title>
	<link href="css/pedigree-viewer.css" rel="stylesheet" media="all">


	<!-- Yay jQuery! Yay jQuery-ui! -->
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>

	<script type="text/javascript" src="js/jquery.mousewheel.js"></script><!-- From here: https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js --> 

	<script type="text/javascript" src="js/pedigree-viewer.js"></script> 

	<!-- Kick it off once everything is ready -->
	<script type="text/javascript"> 
		$(document).ready(function(){
		    drawChart('data.json');
		});
	</script> 	
	<!-- 
	<script type='text/javascript'>
	    $(document).ready(function(){
		drawChart('<?="makeJson.php" . http_build_query($_GET);?>');
	    });
	</script>
	-->
	<style type='text/css'>
	    #page-content-wrapper {
		width: 50%;
		min-width: 650px;
		float: right;
		margin-bottom: 20px;
	    }
	</style>
    </head>
    <body>
	<div id="page_wrapper">
	    <div class="fixed" id="page-layout"><div id="page-content">

	    <!-- This is the box the actual tree goes in -->
	    <div id="page-content-wrapper" class="unselectable">
		<div id="tree" class="ui-corner-all">
		    <div id="chartContainer"> 
			<div id="chartPreviewContainer"> 
			    <div id="chartPreview"></div> 
			</div> 
			<div id="chart"></div> 
			<div id="wait">please wait...loading</div> 
		    </div> 
		</div>
	    </div>
	    <h1>HTML5 Pedigree-Viewer Demo</h1>
	    <h2>A Pedigree-Viewer Demo</h2>
	    <p>
		This is a view of the descendants of part of my family tree. 
	    </p>
	    <p>
		Pedigree-Viewer is an HTML/JavaScript pedigree viewer created by <a href='http://rtcollab.com/'>Real Time Collaboration</a>.	
		It loads the family tree structure from JSON via an AJAX call. This tree's source is <a href='data.json'>data.json</a>. Also 
		included is a PHP class and wrapper which works with <a href='https://github.com/stuporglue/php-gedcom'>PHP-Gedcom</a> to 
		create the needed JSON from a GEDCOM file as needed.  
	    </p>
	    <h3>Current Issues</h3>
	    <ul>
		<li>Some features like vertical tree orientation aren't demoed or tested yet.</li>
		<li>The tree is names only, and non-search engine friendly (so it wouldn't make a good personal genealogy page by itself)</li>
		<li>No other information is shown for ancestors except their names.</li>
		<li>Clicking an individual doesn't re-center the tree on them.</li>
		<li>Doesn't work with IE9 yet. Other versions of IE should probably work.</li>
	    </ul>
	    <h3>Support</h3>
	    <p>
		No official support is being offered by Real Time Collaboration. 
		You can <a href='https://github.com/stuporglue/'>contact me</a> and I will assist as I can.
	    </p>
	    <h3>License</h3>
	    <p>
		Pedigree-Viewer is being licensed under the <a href='http://www.gnu.org/licenses/agpl-3.0.html'>Affero General Public License</a>, an open-source license. 
	    </p>
				</div>
	    </div>
	</div>
	<div id="slider"></div>  
	<div id="info"></div>		
    </body>
</html>
