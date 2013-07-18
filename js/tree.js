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
        this.people = {};

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
            treehtml += '                <span id="dialog_link" class="btn ui-state-default ui-corner-all chkOrientation" rel="horizontal">';
            treehtml += '                    <span class="ui-icon ui-icon-newwin"></span>';
            treehtml += '                    Horizontal Orientation';
            treehtml += '                </span>';
            treehtml += '                <span class="btn ui-state-default ui-corner-all chkOrientation" id="vert" rel="vertical">';
            treehtml += '                    <span class="ui-icon ui-icon-carat-2-n-s"></span>';
            treehtml += '                    Vertical Orientation';
            treehtml += '                </span';
            treehtml += '                <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; ">';
            treehtml += '                    <div style="left: 16px; top: 17px; width: 59px; height: 62px; overflow-x: hidden; overflow-y: hidden; position: absolute; ">';
            treehtml += '                        <div class="pvcompas"></div>';
            treehtml += '                        </div>';
            treehtml += '                    </div>';
            treehtml += '                    <div style="position: absolute; left: 0px; top: 0px; width: 90px; height: 90px; " id="compass" title="">';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 17px; width: 18px; height: 18px; cursor: pointer; " rel="up" class="pan" title="Pan up"></div>';
            treehtml += '                        <div style="position: absolute; left: 16px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="left" class="pan" title="Pan left"></div>';
            treehtml += '                        <div style="position: absolute; left: 56px; top: 37px; width: 18px; height: 18px; cursor: pointer; " rel="right" class="pan" title="Pan right"></div>';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 57px; width: 18px; height: 18px; cursor: pointer; " rel="down" class="pan" title="Pan down"></div>';
            treehtml += '                        <div style="position: absolute; left: 36px; top: 37px; width: 18px; height: 18px; cursor: pointer; " id="centerFocus" title="Return to the focus couple"></div>';
            treehtml += '                    </div>';
            treehtml += '                    <div id="slider" class="ui-slider ui-widget ui-widget-content ui-corner-all ui-slider-vertical">';
            treehtml += '                        <a href="#" class="ui-slider-handle ui-state-default ui-corner-all" ></a>';
            treehtml += '                    </div>';
            treehtml += '                </div>';
            treehtml += '                <div class="clear"></div>';
            treehtml += '            </div>';
            treehtml += '            <div class="clear"></div>';
            treehtml += '        </div>';
            treehtml += '    </div>';

            $(this._target).html(treehtml);

            this.addAncestorsToTree();

            if(typeof this.options.personClick == 'function'){
                $(document).on('click','.chartperson',this.options.personClick);
            }

        };

        this.addAncestorsToTree = function(){
            var params = {
                g:this.gedcom
            };

            $.getJSON(this.parserurl,params,function(json){
                var data = {data:{focus:null,people:[]}};
                var person,i;
                var ids = [];
                for(i = 0;i<json.length;i++){
                    person = {};
                    person.id = json[i].id;
                    ids.push(json[i].id);

                    person.fn = json[i].name;
                    // sn: ,
                    person.s = (json[i].gender == 'F' ? 'F' : 'M');
                    if(typeof json[i].fathers != 'undefined'){
                        person.f = json[i].fathers[0];
                    }
                    if(typeof json[i].mothers != 'undefined'){
                        person.m = json[i].mothers[0];
                    }
                    if(typeof json[i].wife != 'undefined'){
                        person.sp = json[i].wife[0];
                    }else if(typeof json[i].husb != 'undefined'){
                        person.sp = json[i].husb[0];
                    }

                    data.data.people.push(person);
                }
                ids.sort();

                data.data.focus = ids[0];
                self.chart = makeStChart(data);

                for(i = 0;i<json.length;i++){
                    self.people[json[i].id] = json[i];
                }
            });
        };

        this.refocus = function(id){
            this.chart.refocus(id);
        };

        this.init();
    }

    $.fn.pvTree = function(gedcomparserurl,gedcom,options){
        return new PedigreeTreeViewer(this,gedcomparserurl,gedcom,options);
    };
})(jQuery);
