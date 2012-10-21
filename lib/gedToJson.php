<?php

/*
 * gedToJson.php 
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
 * 	defaults to 10 
 * 'd'   -- Number of generations of descendants to find
 * 	optional
 * 	defaults to 10 
 */
require 'php-gedcom/lib/Gedcom/bootstrap.php';

class gedToJson{

    var $people = Array();
    var $gedcom;
    var $descGens = -10;
    var $ancGens = 10;
    var $focus;

    function __construct($file){
	$parser = new \Gedcom\Parser();

	try {
	    $this->gedcom = $parser->parse($file);
	} catch(Exception $e) {
	    echo $e->getMessage();
	    exit;
	}
    }

    function toJson($i = NULL, $a = 10,$d = 10){
	if(!is_null($a)){
	    $this->ancGens = $a;
	}
	if(!is_null($d)){
	    $this->descGens = -1 * $d;
	}

	$queue = Array();
	if(!is_null($i)){
	    $this->focus = $i;
	    $queue[] = Array('id' => $_GET['i'], 'depth' => 0, 'direction' => 'SELF');  // which way to go? SELF, BACK or FORWARD. Self means both ways
	}else{
	    $indis = $this->gedcom->getIndi();
	    if(count($indis) > 0){
		$keys = array_keys($indis);
		sort($keys);
		$start = array_shift($keys);
		$queue[] = Array('id' => $start, 'depth' => 0, 'direction' => 'SELF');  // which way to go? SELF, BACK or FORWARD. Self means both ways
	    }    
	}
	$this->focus = $queue[0]['id'];

	$this->people = Array();

	while($current = array_shift($queue)){
	    if(array_key_exists($current['id'],$this->people) && array_key_exists('id',$this->people[$current['id']])){
		continue; // must be a loop in the tree. We already processed this person
	    }
	    $indi = $this->gedcom->getIndi($current['id']);
	    $this->people[$current['id']]['id'] = $indi->getId(); // id 
	    $this->people[$current['id']]['fn'] = $indi->name[0]->givn; // firstname
	    $this->people[$current['id']]['sn'] = $indi->name[0]->surn; // surname 
	    $this->people[$current['id']]['s'] = ($indi->getSex() ? strtoupper($indi->getSex()) : NULL); // sex

	    // Get relationships and add children or parents to queue (if needed)
	    if(($current['direction'] == 'BACK' || $current['direction'] == 'SELF') && $current['depth'] < $this->ancGens){
		foreach($indi->getFamc() as $famObj){
		    $famId = $famObj->getFamc();
		    $fam = $this->gedcom->getFam($famId);
		    if($h = $fam->getHusb()){
			$queue[] = Array('id' => $h,'depth' => $current['depth'] + 1,'direction' => 'BACK');
			$this->people[$current['id']]['f'] = $h;
		    }
		    if($w = $fam->getWife()){
			$queue[] = Array('id' => $w,'depth' => $current['depth'] + 1,'direction' => 'BACK');
			$this->people[$current['id']]['m'] = $w;
		    }
		}
	    }
	    foreach($indi->getFams() as $famObj){
		$famId = $famObj->getFams();
		$fam = $this->gedcom->getFam($famId);

		$h = $fam->getHusb();
		$w = $fam->getWife();
		if($h){
		    $this->people[$h]['sp'] = $w;
		    $queue[] = Array('id' => $h,'depth' => $current['depth'],'direction' => $current['direction']);
		}
		if($w){
		    $this->people[$w]['sp'] = $h;
		    $queue[] = Array('id' => $w,'depth' => $current['depth'],'direction' => $current['direction']);
		}

		if(($current['direction'] == 'FORWARD' || $current['direction'] == 'SELF') && $current['depth'] > $this->descGens){
		    foreach($fam->getChil() as $childId){
			$queue[] = Array('id' => $childId,'depth' => $current['depth'] - 1 ,'direction' => 'FORWARD');

			if($h){
			    $this->people[$childId]['f'] = $h;
			}
			if($w){
			    $this->people[$childId]['m'] = $w;
			}
		    }
		}
	    }
	}

	$json = Array(
	    "data" => Array(
		"focus" => $this->focus,
		"people" => array_values($this->people),
	    )
	);
	$json = json_encode($json);
	return preg_replace('/,{/',"\n,{",$json);
    }


    // Send the response
    function __toString(){
	return $this->toJson();
    }
}
