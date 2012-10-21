<?php

/*
 * makeJson.php 
 *
 * Copyright: Michael Moore <stuporglue@gmail.com>
 * License: Use it and modify it however you want, including commercial use. 
 *
 * If you use it, I'd love to hear about it, but it's not required.
 *
 * Dependencies: 
 * You will need php-gedcom (https://github.com/stuporglue/php-gedcom)
 *
 * Usage:
 * Place gedToJson.php, php-gedcom and the GEDCOM file in the same directory
 *
 * Make calls to it like so:
 * gedToJson.php?ged=McGinnis  
 * gedToJson.php?ged=McGinnis&i=I7&a=15&d=2 (Starting with ancestor I7, fetch them plus 15 generations of ancestors and 2 generations of descendants
 *
 * Arguments:
 * 'ged' -- The filename (minus the .ged extension) The file must exist in the same directory as gedToJson.php
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
