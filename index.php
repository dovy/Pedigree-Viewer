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
        <meta charset="utf-8"/>
        <title>HTML5 Pedigree-Viewer Demo</title>

        <link href="css/ui/ui.reset.css" rel="stylesheet" media="all" /> 
        <link href="css/ui/ui.slider.css" rel="stylesheet" media="all" /> 
        <link rel="stylesheet" href="css/style.css"/>
        <link rel="stylesheet" href="css/pedigree-viewer.css"/>
        <style type='text/css'>
            #treediv {
            width: 50%;
            min-width: 650px;
            float: right;
            margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div id='treediv'></div>

        <div id='about'>
            <!-- This is the box the actual tree goes in -->
            <h1>HTML5 Pedigree-Viewer Demo</h1>
            <h2>A Pedigree-Viewer Demo</h2>
            <p>
                This is a bowtie view of part of my family tree. Other possible views include ancestors only and descendants only. 
            </p>
            <h2>Download It</h2>
            <p>
                Like what you see? Download the code for yourself!
                <a href='https://github.com/stuporglue/Pedigree-Viewer'>Dev Code</a> | 
                <a href='https://github.com/dovy/Pedigree-Viewer'>Stable Code</a>.
            </p>
            <h2>About</h2>
            <p>
                Pedigree-Viewer is an HTML/JavaScript pedigree viewer created by <a href='http://rtcollab.com/'>Real Time Collaboration</a>.	
                It loads the family tree structure from JSON via an AJAX call. This tree's source is <a href='data.json'>data.json</a>. Also 
                included is a PHP class and wrapper which works with <a href='https://github.com/stuporglue/php-gedcom'>PHP-Gedcom</a> to 
                create the needed JSON from a GEDCOM file as needed.  
            </p>
            <h2>Current Issues</h2>
            <p>
                <a href='https://github.com/dovy/Pedigree-Viewer/issues?state=open'>Bugs are now tracked on GitHub</a>.
            </p>
            <h2>Support</h2>
            <p>
                No official support is being offered by Real Time Collaboration. 
                You can <a href='https://github.com/stuporglue/'>contact me</a> and I will assist as I can.
            </p>
            <h2>License</h2>
            <p>
                Pedigree-Viewer is being licensed under the <a href='http://www.gnu.org/licenses/agpl-3.0.html'>Affero General Public License</a>, an open-source license. 
            </p>
        </div>

        <script type="text/javascript" src="js/excanvas.js"></script>
        <script type="text/javascript" src="js/jquery.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/jquery.mousewheel.js"></script>
        <script type="text/javascript" src="js/sharing-time.js"></script>
        <script type="text/javascript" src="js/sharing-time-ui.js"></script>
        <script type="text/javascript" src="js/sharing-time-chart.js"></script>
        <script type="text/javascript" src="js/jsZoom.js"></script>
        <script type="text/javascript" src="js/make_chart.js"></script>
        <script type="text/javascript" src="js/tree.js"></script>

        <script type="text/javascript"> 
            $(document).ready(function() { 
            pt = $('#treediv').pvTree('data.json','family.ged');
            });
        </script> 	
    </body>
</html>
