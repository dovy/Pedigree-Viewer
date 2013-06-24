(function($){
    /*
    * The PedigreeTreeViewer object
    *
    * Creates a Leaflet.js map and populates it with the contents of a GEDCOM file
    *
    * @param target             -- the jQuery element (a div) which will hold the map
    * @param gedcomparserurl    -- Url to a script that will take the required parsing parameters
    * @param gedcom             -- Relative path to the gedcom file we're going to use
    * @param options            -- Hash of options (none used yet!)
    *
    *
    * About gedcomparserurl
    *
    * Get Parameters are: 
    * g -- the name of the gedcom file to parse. It is up to gedcomparserurl to determine the absolute path 
    */
    function PedigreeTreeViewer(target,gedcomparserurl,gedcom,options){


        this._target = $(target)[0];
        this.gedcom = gedcom;               // gedcom filename to parse
        this.parserurl = gedcomparserurl;   // gedcom parser URL
        this.options = options || {};

        var self = this;

        this.init = function(){
            var treehtml = '';
            treehtml += '<div id="page_wrapper">';
            treehtml += '<div class="fixed" id="page-layout"><div id="page-content">';
            treehtml += '        <div id="page-content-wrapper" class="unselectable">';
            treehtml += '            <div id="tree" class="ui-corner-all">';
            treehtml += '                <div id="chartContainer"> ';
            treehtml += '                    <div id="chart"></div> ';
            treehtml += '                    <div id="wait">please wait...loading</div> ';
            treehtml += '                </div> ';
            treehtml += '                <div id="chartPreviewContainer"> ';
            treehtml += '                    <div id="chartPreview"></div> ';
            treehtml += '                </div> ';
            treehtml += '                <div id="info"></div>		';
            treehtml += '                <a id="dialog_link" class="btn ui-state-default ui-corner-all chkOrientation" href="#h" rel="horizontal">';
            treehtml += '                    <span class="ui-icon ui-icon-newwin"></span>';
            treehtml += '                    Horizontal Orientation';
            treehtml += '                </a>';
            treehtml += '                <a class="btn ui-state-default ui-corner-all chkOrientation" id="vert" href="#v" rel="vertical">';
            treehtml += '                    <span class="ui-icon ui-icon-carat-2-n-s"></span>';
            treehtml += '                    Vertical Orientation';
            treehtml += '                </a>';
            treehtml += '                <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; ">';
            treehtml += '                    <div style="left: 16px; top: 17px; width: 59px; height: 62px; overflow-x: hidden; overflow-y: hidden; position: absolute; ">';
            treehtml += '                        <img style="position: absolute; left: 0px; top: 0px; -webkit-user-select: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-style: initial; border-color: initial; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; -webkit-user-drag: none; " src="css/compas.png">';
            treehtml += '                        </div>';
            treehtml += '                    </div>';
            treehtml += '                    <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; " id="compass" title="">';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 17px; width: 18px; height: 18px; cursor: pointer; " rel="up" class="pan" title="Pan up"></div>';
            treehtml += '                        <div style="position: absolute; left: 16px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="left" class="pan" title="Pan left"></div>';
            treehtml += '                        <div style="position: absolute; left: 56px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="right" class="pan" title="Pan right"></div>';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 57px; width: 18px; height: 18px; cursor: pointer; " rel="down" class="pan" title="Pan down"></div>';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 37px; width: 18px; height: 18px; cursor: pointer; " id="centerFocus" title="Return to the focus couple"></div>';
            treehtml += '                    </div>';
            treehtml += '                    <div style="top: 80px; padding-left: 40px;position:absolute;width: 100%;">';
            treehtml += '                        <div id="slider" class="ui-slider ui-widget ui-widget-content ui-corner-all ui-slider-vertical">';
            treehtml += '                            <a href="#" class="ui-slider-handle ui-state-default ui-corner-all" ></a>';
            treehtml += '                        </div>';
            treehtml += '                    </div>';
            treehtml += '                </div>';
            treehtml += '                <div class="clear"></div>';
            treehtml += '            </div>';
            treehtml += '            <div class="clear"></div>';
            treehtml += '        </div>';
            treehtml += '    </div>';

            $(this._target).html(treehtml);

            this.addAncestorsToTree();
        };

        this.addAncestorsToTree = function(){
            var params = {
                g:this.gedcom
            };

            $.getJSON(this.parserurl,params,function(json){
                var tmp;

                // for(var i = 0;i<json.features.length;i++){
                // }
                makeStChart(json);
            });
        };


        this.init();
    }

    $.fn.pvTree = function(gedcomparserurl,gedcom,options){
        return new PedigreeTreeViewer(this,gedcomparserurl,gedcom,options);
    };
})(jQuery);
