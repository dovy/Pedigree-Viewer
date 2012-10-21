<?php

/*
 * makeJson.php -- Use the query string parameters to invoke gedToJson and get a JSON pedigree fragment
 
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

 
 * Usage:
 * Install php-gedcom in the lib directory. Put your GEDCOM file in the same directory as this file
 *
 * Make calls to it like so:
 * makeJson.php?ged=McGinnis  
 * makeJson.php?ged=McGinnis&i=I7&a=15&d=2 (Starting with ancestor I7, fetch them plus 15 generations of ancestors and 2 generations of descendants
 *
 * Arguments:
 * 'ged' -- The filename (minus the .ged extension) The file must exist in the same directory as makeJson.php
 * 	required
 *
 * 'i' 	 -- Id of the Ancestor to start at
 * 	optional
 * 	defaults to lowest ancestor id in the file as determined by PHP's sort 
 *
 * 'a'   -- Number of generations of ancestors to find
 * 	optional
 * 	defaults to 100
 * 'd'   -- Number of generations of descendants to find
 * 	optional
 * 	defaults to 100 
 */

// Verify safety of file
if(!file_exists($_GET['ged'] . ".ged")){
    die("Bad Request");
}else{
    $file = getcwd() . '/' . $_GET['ged'] . ".ged";
}

require_once('lib/gedToJson.php');
$gtj = new gedToJson($file);

if(array_key_exists('i',$_GET)){
    $focusIndividual = $_GET['i'];
}else{
    $focusIndividual = NULL;
}

if(array_key_exists('a',$_GET)){
    $ancestors = $_GET['a'];
}else{
    $ancestors = NULL;
}

if(array_key_exists('d',$_GET)){
    $descendants = $_GET['d'];
}else{
    $descendants = NULL;
}

header("Content-type: text/javascript; charset=utf-8");
print $gtj->toJson($focusIndividual,$ancestors,$descendants);
