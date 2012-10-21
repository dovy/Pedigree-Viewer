<?php

/*
 * gedToJson.php -- Turn a GEDCOM into a JSON file that Pedigree-Viewer can use
 
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

 * Dependencies: 
 * You will need php-gedcom (https://github.com/stuporglue/php-gedcom)
 *
 */

require 'php-gedcom/lib/Gedcom/bootstrap.php';

class gedToJson{
    /**
     * @class gedToJson
     *
     * @brief Turn a portion of a GEDCOM file into a JSON object for use in pedigree-viewer
    */

    var $people = Array();
    var $gedcom;
    var $descGens = -10;
    var $ancGens = 10;
    var $focus;

    /**
     * @brief Inialize a new gedToJson object
     *
     * @param $file (required) Path to a GEDCOM file that PHP can read
     *
     * @note Error messages will likely not be in JSON format
     */
    function __construct($file){
	$parser = new \Gedcom\Parser();

	try {
	    $this->gedcom = $parser->parse($file);
	} catch(Exception $e) {
	    echo $e->getMessage();
	    exit;
	}
    }

    /**
     * @brief Turn a portion of the GEDCOM into a JSON tree fragment
     *
     * Since GEDCOM files can contain thousands of individuals and the web user 
     * is probably only interested in a subset, and since their browser probably
     * won't enjoy dealing with thousands of extra divs we return only a fragment
     * of the pedigree, centered around a single individual.
     *
     * @param $i (optional) Which GEDCOM ID should the fragment be centered on? Defaults to the lowest ID in the GEDCOM file
     *
     * @param $a (optional) Number of ancestor generations from the individual. Defaults to 10.
     *
     * @param $d (optional) Number of descendant generations from the individual. Defaults to 10.
     *
     * @return A JSON string
     */
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


    /**
     * @brief To string. 
     *
     * If you want JSON with the defaults you should be able to do: 
     *
     * print new gedToJson('filename.ged');
     */
    function __toString(){
	return $this->toJson();
    }
}
