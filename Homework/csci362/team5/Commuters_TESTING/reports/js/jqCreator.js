// Version 34
// 11/06/2013
// 1. Added get getGridSelectedObject utility function

// Version 34
// 11/05/2013
// 1. Fixed Object.keys utility function. In IE, null is technically an object

// Version 33
// 11/04/2013
// 1. Rewrote the way imginputs are stored. Now they are stored in a data function rather than etched onto every object.
// 2. Added utility functions

// Version 32
// 10/31/2013
// 1. Added support for subitems in visisble cols. For example visible_cols=['item.item'] will display that value2013

// Version 31
// 10/30/2013
// 1. Fixed bugs

// Version 30
// 10/22/2013
// 1. Rewrote formatJQGrid. Much faster, cleaner.
// 2. Formatters now work when picking visible Columns
// 3. Widths now work

// Version 29
// 10/22/2013
// 1. fixed currency regex

// Version 29
// 10/22/2013
// 1. Added name of table to errors
// 2. Added checking if input object is [object Array]


//*******************************
// jQuery Extension
//*******************************

// Usage: $([SelectTableHere]).jqCreator(inputObject or inputString)

// String inputs
// Input                 Function
// getColumns            Returns an array of strings that correspond to the columns in the input object
// getData               Returns an array of objects that are in the jqgrid
// columnDialog          Shows a dialog letting users pick which columns are visible. Upon done, the visible columns are set


// What you can stick in the object:
// input                 input type               Nullable   Description
// jsonobject            JSON Object OR String.              Json object with the data elements. Can be a string or JSON object. Just make sure it has the element "rows" which is an array. 
// objectname            String.                    Y**      Name of the object you're inputting. This is for the custom formatter to access custom elements and for naming purposes. This is finicky and may break in the future. 

// width                 Int or String              Y        Total width of the jqGrid
// height                Int or String              Y        Total height of the jqGrid

// visible_cols          Array of strings.          Y        name of columns inside each 'stuff' above that are visible
// col_widths            Array of ints.             Y*       width of the columns in the order of visible cols
// col_aliases           Array of strings.          Y*       name that appears on the header of hte columns, in the order of visible cols
// col_formatters        Array of functions         Y        Each function corresponds with the visibile columns
// col_unformat          Array of functions         Y        Each function corresponds with the visibile columns
// col_frozen            Array of ints.             Y        Which columns to freeze upon scrolling

// rownumbers            boolean                    Y        Shows row numbers

// colModel              JSON Object OR String      Y        Allows users to overwrite the default colModel. Advanced users only. 
// colNames              JSON Object OR String      Y        Allows users to overwrite the default colName. Advanced users only. 

// caption               string                     Y        Caption for the jqGrid.

// imginput              String.                    Y**      Image source of the button on the right. This is for the custom formatter to style the button.
// formatter             function                   Y        Allows users to overwrite the default custom formatter. Advanced users only.  [Planning to remove?]
// button_position       int                        Y        Positions your button column on the left or right depending on input (Default: Right side)

// functions             Array of functions.        Y**      Functions of the butotn on the right. It will split the funcitons across image correctly if it's a multibutton image.
// pager_functions       Array of functions.        Y        The functions of the navBar. It'll take the first 5 functions in an array. 
// pager_caption         Array of strings  .        Y        The captions of the navbar buttons. 

// oddBackgroundColor    String                     Y        Background color of odd rows
// evenBackgroundColor   String                     Y        Background color of even rows

// oddTextColor          String                     Y        Text color of odd rows
// evenTextColor         String                     Y        Text color of even rows

// buttons***            Array of objects           Y        Appends buttons to the pager. 
// getColumns            String                     Y        returns array of columns to pick visibility
// doubleClick           function                   Y        Function upon double clicking a row

// subGrid               boolean                    Y        jqGrid's subGrid Option
// subGridExpanded       function                   Y        jqGrid's subGridExpanded
// multiselect           boolean                    Y        jqGrid's multiselect option

// options               object                     Y        object to append to jqgrid options. Will overwrite default ones

// Notes:
//  *: If they exist, col_widths, and col_aliases must be the same length.
// **: If you use the button on the right, you need objectname, imginput and functions.


//Button object format:
//
// {
//     id: "idOfButton",
//     caption: "Shown on bar",
//     title: "Mouseover Title",
//     buttonicon: "image here?",
//     onClickButton: function on click
// }

// Plans:
// input their own col_formatters? Store it into the table object, make it an array? Maybe 1 replaces the default?
// input their own colModel? 
(function($) {

    $.fn.jqCreator = function(input, input2) {

        if (typeof input === 'string') {
            switch (input) {
                case 'getColumns':
                    return $.fn.jqCreator.getColumns(this);
                    break;
                case 'getData':
                    return $.fn.jqCreator.getData(this);
                    break;
                case 'columnDialog':
                    $.fn.jqCreator.visibleColumnDialog(this);
                    break;

                default:
                    console.log("jqCreator: Not a recognized command");
                    break;
            }
        } else if (typeof input === 'object') {
            if (this.is('table')) {
                if ($.fn.jqCreator.isValidInput(input, this[0].id)) {
                    return $.fn.jqCreator.createJQ(this, input);
                }
            } else {
                console.log("Error: Input not a table");
            }
        }
        return this;
    }

    $.fn.jqCreator.jqCreatorFunctionHolder = {};

    //Actually creates the JQGrid and Navbar. 
    $.fn.jqCreator.createJQ = function(tableobject, input) {
        var newJsonObject,
            pagerObject,
            i,
            pager_buttons,
            JSONObject,
            table = tableobject[0].id,
            jsonobject = input["jsonobject"],
            visible_cols = input["visible_cols"],
            newvisible_cols = input["newvisible_cols"],
            col_widths = input["col_widths"],
            col_aliases = input["col_aliases"],
            col_formatters = input['col_formatters'],
            objectname = input["objectname"],
            imginput = input["imginput"],
            functions = input["functions"],
            emptyrecords = input["emptyrecords"],
            pager_functions = input["pager_functions"],
            pager_captions = input["pager_captions"],
            width = input["width"],
            height = input['height'],
            colModel = input['colModel'],
            colNames = input['colNames'],
            formatter = input['formatter'],
            multiselect = input['multiselect'] !== undefined ? input['multiselect'] : false,
            button_position = input['button_position'],
            caption = input['caption'] !== undefined ? input['caption'] : "",
            rownumbers = input['rownumbers'],
            doubleClick = input['doubleClick'],
            columns = input['columns'],
            subGrid = input['subGrid'] !== undefined ? input['subGrid'] : false,
            subGridExpanded = input['subGridExpanded'] !== undefined ? input['subGridExpanded'] : '',
            oddBackgroundColor = input['oddBackgroundColor'],
            evenBackgroundColor = input['evenBackgroundColor'],
            oddTextColor = input['oddTextColor'],
            evenTextColor = input['evenTextColor'],
            options = input['options'],
            buttons = input['buttons'];

        input['table'] = table;

        if (newvisible_cols !== undefined) {
            var tempColModel = $.fn.jqCreator.jqCreatorFunctionHolder[table]['currentJSONObject']['colModel'];
            var i;
            for (i = 0; i < tempColModel.length; i++) {
                if (tempColModel[i]['name'] !== 'Images') {
                    if (newvisible_cols.contains(tempColModel[i]['name'])) {
                        tempColModel[i]['hidden'] = false;
                        tempColModel[i]['width'] = $.fn.jqCreator.jqCreatorFunctionHolder[table]['width'] / newvisible_cols.length;
                    } else {
                        tempColModel[i]['hidden'] = true;
                    }
                }
            }

            newJsonObject = $.fn.jqCreator.jqCreatorFunctionHolder[table]['currentJSONObject'];
            newJsonObject['colModel'] = tempColModel;

        } else {

            //This object holds all of the data needed for the jqGrid to function
            $.fn.jqCreator.jqCreatorFunctionHolder[table] = {};
            $.fn.jqCreator.jqCreatorFunctionHolder[table]['input'] = input;

            width = width !== undefined && width !== null ? +width : 950;
            $.fn.jqCreator.jqCreatorFunctionHolder[table]['width'] = width;
            height = height !== undefined && height !== null ? +height : 'auto';

            //Sets up the navbar div if pager_functions is not equal to null
            if ((pager_functions !== undefined && pager_functions !== null) || (buttons !== undefined && buttons !== null)) {
                $('#' + table).after($("<div />").attr({
                    'id': 'Common_Pager'
                }));

                //navBar functions go into this area
                if (pager_functions !== undefined && pager_functions !== null) {
                    $.fn.jqCreator.jqCreatorFunctionHolder[table]["navBar"] = pager_functions;
                }
                pagerObject = $('#Common_Pager');
            } else {
                pagerObject = "";
            }

            //stores the button functions
            $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions'] = functions;

            newJsonObject = $.fn.jqCreator.formatJQgrid(jsonobject, input);


            $.fn.jqCreator.jqCreatorFunctionHolder[table]['currentJSONObject'] = newJsonObject;
        }

        $("#" + table).jqGrid('GridUnload');

        var inputObject = {
            // datatype: 'jsonstring',
            // datastr: newJsonObject.JSON,
            datatype: 'local',
            data: newJsonObject.JSON.rows,
            jsonReader: {
                root: 'rows',
                repeatitems: false
            },
            // colNames: newJsonObject.colNames,
            colModel: newJsonObject.colModel,
            rowNum: 10000,
            pager: pagerObject,
            sortorder: "asc",
            emptyrecords: emptyrecords,
            loadonce: true,
            caption: caption,
            subGrid: subGrid,
            subGridExpanded: subGridExpanded,
            ondblClickRow: doubleClick,
            hoverrows: false,
            viewrecords: true,
            autowidth: false,
            rownumbers: rownumbers !== undefined ? rownumbers : false,
            shrinkToFit: true,
            imgpath: '',
            width: width,
            height: height,
            // beforeSelectRow: beforeSelectRowFunction,
            multiselect: multiselect,
            loadComplete: function() {
                $(".jqCreator_Button").hover(function() {
                    $(this).css('cursor', 'pointer');
                }, function() {
                    $(this).css('cursor', 'auto');
                });

                // $("#" + table + " tr").mouseover(function() {
                // $(this).find("td").addClass('ui-state-hover');
                // });
                // $("#" + table + " tr").mouseout(function() {
                // $(this).find("td").removeClass('ui-state-hover');
                // });
            }
        };

        if (typeof options !== 'undefined' && typeof options === 'object') {
            jQuery.extend(inputObject, options);
        }


        $("#" + table).jqGrid(inputObject);

        //pager funciton to buttons:
        if (pager_functions !== undefined && pager_functions !== null) {
            // var buttonObjects = [];
            var i,
                currentFunction,
                caption,
                tempObject;
            for (i = 0; i < $.fn.jqCreator.jqCreatorFunctionHolder[table]["navBar"].length; i++) {
                caption = pager_captions !== null && typeof pager_captions[i] === "string" ? pager_captions[i] : "caption";
                currentFunction = new navBarFuncWrapper($("#" + table), $.fn.jqCreator.jqCreatorFunctionHolder[table]["navBar"][i], caption);


                tempObject = {
                    id: "btnCommon_" + i,
                    caption: caption,
                    title: "title",
                    buttonicon: "ui-icon-add",
                    onClickButton: currentFunction

                }
                $("#" + table).jqGrid('navGrid', "#Common_Pager", {
                    edit: false,
                    add: false,
                    del: false,
                    search: true
                }).jqGrid('navButtonAdd', "#Common_Pager", tempObject);
            }
        }

        //button array to buttons:
        if (buttons !== undefined && buttons !== null) {
            // var buttonObjects = [];
            var i = 0;
            for (i = 0; i < buttons.length; i++) {
                $("#" + table).jqGrid('navGrid', "#Common_Pager", {
                    edit: false,
                    add: false,
                    del: false,
                    search: true
                }).jqGrid('navButtonAdd', "#Common_Pager", buttons[i]);
            }
        }
        //Freezes the columns
        $("#" + table).jqGrid('setFrozenColumns');

        //colors

        if (oddBackgroundColor !== undefined && oddBackgroundColor !== null) {
            $('#' + table + ' tr.jqgrow:odd').css('background', oddBackgroundColor);
        }
        if (evenBackgroundColor !== undefined && evenBackgroundColor !== null) {
            $('#' + table + ' tr.jqgrow:even').css('background', evenBackgroundColor);
        }
        if (oddTextColor !== undefined && oddTextColor !== null) {
            $('#' + table + ' tr.jqgrow:odd').css('color', oddTextColor);
        }
        if (evenTextColor !== undefined && evenTextColor !== null) {
            $('#' + table + ' tr.jqgrow:even').css('color', evenTextColor);
        }

        return tableobject;
    }


    //Creates the colModel, colName and formats the JSON object with attributes for use later
    // $.fn.jqCreator.formatJQgrid = function(JSONObject, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table, pager_functions, width, inputcolModel, inputcolNames, formatter, button_position) {
    $.fn.jqCreator.formatJQgrid = function(jsonobject, input) {
        var width = input["width"],
            table = input['table'],
            colModel = [],
            object,
            rows;

        if (toString2(jsonobject) === "[object String]") {
            jsonobject = JSON.parse(jsonobject);
            rows = jsonobject.rows;
        } else if (toString2(jsonobject) === "[object Object]") {
            rows = jsonobject.rows;
        } else if (toString2(jsonobject) === "[object Array]") {
            rows = jsonobject;
            jsonobject = {
                'rows': jsonobject
            };
        }


        var currentColumn,
            currentValue,
            object = rows[0],
            visible_cols = input["visible_cols"];
        visible_columns = [],
        dateRegex = new RegExp(/[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]/),
        currencyRegex = new RegExp(/[0-9]*\.[0-9][0-9]/g);

        //build list of subkeys?
        var propertyNames = Object.keys(object);
        if (visible_cols !== undefined) {
            propertyNames = getFullKeys(object);
        } else {
            visible_cols = propertyNames;
        }
        var i,
            propertyName;
        for (i = 0; i<propertyNames.length; i++) {
            propertyName = propertyNames[i];
            currentValue = getValueFromObject(object, propertyName);

            // currentValue = object[propertyName];
            currentColumn = {};

            currentColumn["name"] = propertyName;
            currentColumn["jsonmap"] = propertyName;

            //Type checking
            if (dateRegex.test(currentValue)) {
                currentColumn["sorttype"] = 'date';
                currentColumn['formatter'] = 'date';
                currentColumn['formatoptions'] = {
                    'srcformat': 'm/d/Y h:i:s',
                    'newformat': 'm/d/Y H:i:s'
                };
            } else if (currencyRegex.test(currentValue)) {
                currentColumn["sorttype"] = 'int';
                currentColumn['formatter'] = 'currency';
                currentColumn['formatoptions'] = {
                    'prefix': '',
                    'suffix': ''
                };
                currentColumn['align'] = 'right';
            } else if (!isNaN(+currentValue)) {
                currentColumn["sorttype"] = 'int';
            }

            if (visible_cols.contains(propertyName)) {
                visible_columns[visible_cols.indexOf(propertyName)] = currentColumn;
            } else {
                currentColumn['hidden'] = true;
                currentColumn['width'] = 0;
                currentColumn['label'] = propertyName;
                colModel.push(currentColumn);

            }


        }

        //visible column loops
        var i,
            col_widths = input["col_widths"],
            col_aliases = input["col_aliases"],
            col_frozen = input['col_frozen'],
            col_formatters = input['col_formatters'],
            col_unformat = input['col_unformat'],
            col_widths_exists = col_widths !== undefined && col_widths !== null,
            col_aliases_exists = col_aliases !== undefined && col_aliases !== null,
            col_formatters_exists = col_formatters !== undefined && col_formatters !== null,
            col_unformat_exists = col_unformat !== undefined && col_unformat !== null,
            col_frozen_exists = col_frozen !== undefined && col_frozen !== null;

        //visible_columns, col_aliases_ col_widths, col_formatters should all be the same length and the same order
        for (i = 0; i < visible_columns.length; i++) {
            currentValue = visible_columns[i];

            if (col_widths_exists) {
                currentValue["width"] = col_widths[i];
            } else {
                currentValue['width'] = $.fn.jqCreator.jqCreatorFunctionHolder[table]["width"] / visible_columns.length;
            }

            if (col_aliases_exists) {
                currentValue["label"] = col_aliases[i];
            }

            if (col_formatters_exists) {
                if (col_formatters[i] !== null) {
                    currentValue['formatter'] = col_formatters[i];
                }
            }

            if (col_unformat_exists) {
                if (col_unformat[i] !== null) {
                    currentValue['unformat'] = col_unformat[i];
                }
            }

            if (col_frozen_exists) {
                if (col_frozen[i] !== null) {
                    currentValue['unformat'] = col_frozen[i];
                }
            }

            visible_columns[i] = currentValue;
        }

        var objectname = input["objectname"] !== undefined ? input["objectname"] : 'object',
            imginput = input["imginput"];
        //if there is an image, embedded each object with it so the formatter cna refer to it
        if (imginput !== undefined) {
            $.fn.jqCreator.jqCreatorFunctionHolder[table]['imginput'] = imginput;
            // var i;
            // for (i = 0; i < rows.length; i++) {
                // rows[i]['imgsrc'] = '/_layouts/images/' + imginput;
                // rows[i]['table'] = table;
            // }
        }

        if (objectname !== undefined) {
            var i;
            for (i = 0; i < rows.length; i++) {
                rows[i]['objectname'] = objectname;
            }
        }

        // var currentFormatter;
        // if(input['formatter'] !== undefined){
        // currentFormatter = $.fn.jqCreator.jqCreatorFunctionHolder[table]['formatter'] = input['formatter'];
        // 
        // } else {
        // }
        var currentFormatter = input['formatter'];
        button_position = input['button_position'];


        //if the imginput is defined, then we use the included formatter

        if (currentFormatter !== undefined || imginput !== undefined) {
            var position = button_position !== undefined && button_position !== null ? button_position : visible_columns.length;
            if (currentFormatter === undefined) {
                currentFormatter = $.fn.jqCreator.jqCreatorFunctionHolder[table]['formatter'] = $.fn.jqCreator.custom_formatter;
            }
            var buttonWidth = 34;

            if (imginput !== undefined) {
                var x = $('<img />').attr({
                    'imgsrc': '/_layouts/images/' + imginput,
                    'id': 'jqCreatorTempImage'
                });
                $('#' + table).append(x);

                buttonWidth = x.width();
                x.remove();

            }

            if (col_widths_exists) {
                if (position < visible_columns.length - 1) {
                    visible_columns[position + 1]['width'] -= buttonWidth;
                } else if (position >= visible_columns.lenth - 1) {
                    visible_columns[position - 1]['width'] -= buttonWidth;
                }
            } else {
                var i;
                for (i = 0; i < visible_columns.length; i++) {
                    visible_columns[i]['width'] = $.fn.jqCreator.jqCreatorFunctionHolder[table]['width'] / (visible_columns.length + 1);
                }
            }

            visible_columns.splice(position, 0, {
                name: 'Images',
                index: 'Images',
                label: ' ',
                width: 64,
                fixed: true,
                sortable: false,
                resizable: false,
                align: 'center',
                title: false,
                formatter: currentFormatter
            });
        }

        colModel = colModel.concat(visible_columns);

        var inputcolModel = input['colModel'],
            inputcolNames = input['colNames'];

        var outJSON = {
            // "colNames": inputcolNames !== undefined & inputcolNames !== null ? inputcolNames : colNames,
            "colModel": inputcolModel !== undefined & inputcolModel !== null ? inputcolModel : colModel,
            "JSON": jsonobject
        };



        return outJSON;
    }


    //The formatter used for the button on the right
    $.fn.jqCreator.custom_formatter = function(cellvalue, options, rowObject) {
        //var which_image = (Report == 'Report' || Report == 'Report' || Report == 'Query' ? 'execute_16x16.png' : 'tack_16x16.png')
        var object = rowObject['objectname'] !== undefined ? rowObject['objectname'] : 'object' ;
        var object_id = object + "_Id";
        var object_name = object + "_Name";


        var imgid = 'imgCommon' + object + 'Image_' + rowObject[object_id];
        var idattribute = object.toLowerCase() + "_id";
        var idname = object.toLowerCase() + "_name";
        var table = rowObject['table'] !== undefined ? rowObject['table'] : options['gid'];
        var imgpath = rowObject['imgsrc'] !== undefined ? rowObject['imgsrc'] :  '/_layouts/images/' + $.fn.jqCreator.jqCreatorFunctionHolder[table]['imginput'];
        var imgmapid = "#" + imgid + '_map';

        var work = '<div style="width:100%;height:20px;" >';

        var imginput = {};

        imginput['id'] = imgid;
        imginput['alt'] = 'Preview Details';
        imginput['class'] = 'jqCreator_Button';
        imginput[object_name.toLowerCase()] = rowObject[object_name];
        imginput[object_id.toLowerCase()] = rowObject[object_id];
        imginput['object_name'] = rowObject[object_name];
        imginput['object_id'] = rowObject[object_id];
        imginput['src'] = imgpath;
        imginput['table'] = table;

        //codetables have to be different so this is the result.

        if (rowObject.TableName !== undefined) {
            imginput['TableName'] = rowObject.TableName;
        }


        //x.attr('onclick','jqCreatorFunction (event, this.id,"'+ rowObject[objectname2]  + '");');
        //x.attr('onclick', 'return doCommon_Home_Reports_Click(this.id);');



        if ($.fn.jqCreator.jqCreatorFunctionHolder[table] !== undefined && $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions'] !== undefined) {
            imginput['usemap'] = imgmapid;
        }

        var x = $('<img />').attr(imginput);


        work += $(x).prop('outerHTML');
        if ($.fn.jqCreator.jqCreatorFunctionHolder[table] !== undefined && $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions'] !== undefined) {
            work += '<map name="' + imgmapid + '">';
            var coords = [0, 0, 15, 15];
            for (var i in $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions']) {
                coordstring = coords[0].toString() + "," + coords[1].toString() + "," + coords[2].toString() + "," + coords[3].toString();
                work += '    <area shape="rect" coords="' + coordstring + '" href="javascript:$.fn.jqCreator.jqCreatorFunction(event,\'' + imgid + '\',\'' + rowObject[object_id] + '\',' + i.toString() + ');">';
                coords[0] += 17;
                coords[1] += 0;
                coords[2] += 17;
                coords[3] += 0;
            }
            work += '</map>';


            work += '</div>';

        }

        return work;
    }

    //Checks if the input is valid
    $.fn.jqCreator.isValidInput = function(input, tableid) {
        var isValid = true,
            jsonobject = input["jsonobject"],
            visible_cols = input["visible_cols"],
            col_widths = input["col_widths"],
            col_aliases = input["col_aliases"],
            objectname = input["objectname"],
            imginput = input["imginput"],
            functions = input["functions"],
            pager_functions = input["pager_functions"],
            width = input["width"],
            colModel = input['colModel'],
            colNames = input['colNames'],
            formatter = input['formatter'],
            col_frozen = input['col_frozen'],
            rownumbers = input['rownumbers'],
            columns = input['columns'];


        //If jsonobject is a jsonstring, this converts it into a json object
        if (jsonobject === undefined || jsonobject === null) {
            console.log('Error on ' + tableid + 'No JSON inputted');
            isValid = false;
        } else {
            if (typeof jsonobject === "string") {
                try {
                    JSONObject = JSON.parse(jsonobject);
                } catch (err) {
                    console.log('Error on ' + tableid + 'jsonobject is not a valid JSON string');
                    isValid = false;
                }
            } else if (Object.prototype.toString.call(jsonobject) !== "[object Object]" && Object.prototype.toString.call(jsonobject) !== "[object Array]") {
                console.log('Error on ' + tableid + 'jsonobject not valid');
                isValid = false;
            }
        }

        if (visible_cols !== undefined && visible_cols !== null && Object.prototype.toString.call(visible_cols) !== "[object Array]") {
            console.log('Error on ' + tableid + 'visible_cols not valid');
            isValid = false;
        }


        if (col_widths !== undefined && col_widths !== null && Object.prototype.toString.call(col_widths) !== "[object Array]") {
            console.log('Error on ' + tableid + 'col_widths not valid');
            isValid = false;
        }

        if (col_aliases !== undefined && col_aliases !== null && Object.prototype.toString.call(col_aliases) !== "[object Array]") {
            console.log('Error on ' + tableid + 'col_aliases not valid');
            isValid = false;
        }

        if (col_widths !== undefined && col_widths !== null && col_aliases !== undefined && col_aliases !== null && col_widths.length !== col_aliases.length) {
            console.log('Error on ' + tableid + 'col_aliases and col_widths are not the same length');
            isValid = false;
        }

        if (objectname !== undefined && objectname !== null && Object.prototype.toString.call(objectname) !== "[object String]") {
            console.log('Error on ' + tableid + 'objectname not valid');
            isValid = false;
        }

        if (imginput !== undefined && imginput !== null && Object.prototype.toString.call(imginput) !== "[object String]") {
            console.log('Error on ' + tableid + 'imginput not valid');
            isValid = false;
        }

        if (functions !== undefined && functions !== null && Object.prototype.toString.call(functions) !== "[object Array]") {
            console.log('Error on ' + tableid + 'functions not valid');
            isValid = false;
        }

        if (pager_functions !== undefined && pager_functions !== null && Object.prototype.toString.call(pager_functions) !== "[object Array]") {
            console.log('Error on ' + tableid + 'pager_functions not valid');
            isValid = false;
        }

        if (width !== undefined && width !== null && !(Object.prototype.toString.call(width) === "[object String]" || Object.prototype.toString.call(width) === "[object Number]")) {
            console.log('Error on ' + tableid + 'width not valid');
            isValid = false;
        }


        if (colModel !== undefined && colModel !== null && Object.prototype.toString.call(colModel) !== "[object Array]") {
            console.log('Error on ' + tableid + 'colModel not valid');
            isValid = false;
        }

        if (colNames !== undefined && colNames !== null && Object.prototype.toString.call(colNames) !== "[object Array]") {
            console.log('Error on ' + tableid + 'colNames not valid');
            isValid = false;
        }

        if (formatter !== undefined && formatter !== null && Object.prototype.toString.call(formatter) !== "[object Function]") {
            console.log('Error on ' + tableid + 'formatter not valid');
            isValid = false;
        }

        if (col_frozen !== undefined && col_frozen !== null) {
            var i = 0;
            for (i; i < col_frozen.length; i++) {
                if (isNaN(+col_frozen[i])) {
                    console.log('Error on ' + tableid + 'col_frozen' + col_frozen[i] + 'not valid');
                    isValid = false;
                }
            }
        }

        if (columns !== undefined && columns !== null) {
            var i = 0;
            for (i; i < columns.length; i++) {
                if (typeof columns[i] !== 'object') {
                    console.log('Error on ' + tableid + 'columns' + columns[i] + 'not valid');
                    isValid = false;

                }
            }
        }

        if (rownumbers !== undefined && rownumbers !== null && Object.prototype.toString.call(rownumbers) !== "[object Boolean]") {
            console.log('Error on ' + tableid + 'rownumbers not valid');
            isValid = false;
        }

        return isValid;
    }
    $.fn.jqCreator.jqCreatorFunction = function(evt, id_name, object_id, i) {
        var table = $('#' + id_name).attr('table');
        //runs the corresponding function
        if (i > -1 && i < $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions'].length) {
            $.fn.jqCreator.jqCreatorFunctionHolder[table]['functions'][i](id_name);
        }

        $('.' + id_name).css('cursor', 'auto');

        return false;
    }


    $.fn.jqCreator.getColumns = function(tableobject) {
        var tableData = $.fn.jqCreator.getData(tableobject);
        var object = tableData[0];
        var outputArray = [];

        for (var propertyName in object) {
            outputArray.push(propertyName);
        }

        if (outputArray.contains('Images')) {
            imagesIndex = outputArray.indexOf('Images');
            beforeImages = outputArray.slice(0, imagesIndex)
            afterImages = outputArray.slice(imagesIndex + 1, outputArray.length);
            outputArray = beforeImages.concat(afterImages);
        }

        return outputArray;
    }

    $.fn.jqCreator.getData = function(tableobject) {
        var x = $('#' + tableobject[0].id).jqGrid('getRowData');
        var i = 0;
        for (i = 0; i < x.length; i++) {
            delete x[i]['Images'];
        }

        if (x === undefined) {
            x = $('#' + tableobject[0].id).jqGrid('getGridParam', 'data');
        }

        return x;
    }

    $.fn.jqCreator.visibleColumnDialog = function(tableobject) {
        var table = tableobject[0].id;
        var allColumns = $('#' + table).jqCreator('getColumns');
        var allColumns_json = [];

        var i;
        for (i = 0; i < allColumns.length; i++) {
            allColumns_json.push({
                'Column': allColumns[i]
            });
        }

        var json_input = {
            "page": 1,
            "total": 5,
            "records": 10,
            "rows": allColumns_json
        };


        var functionWhenDone = function() {
            var x = $('#COMMONVISIBLECOLS_JqGrid').jqGrid('getGridParam', 'selarrrow');
            var i;

            for (i = 0; i < x.length; i++) {
                x[i] = --x[i];
            }

            var allColumns = $('#COMMONVISIBLECOLS_JqGrid').jqGrid('getRowData');

            var outputArray = [];
            for (i = 0; i < x.length; i++) {
                outputArray.push(allColumns[x[i]]['Column']);
            }
            var newInput = $.fn.jqCreator.jqCreatorFunctionHolder[table]['input'];
            newInput['newvisible_cols'] = outputArray;

            $('#' + table).jqCreator(newInput);

            // initCommon_Objects_Grid(outputArray);
        }


        if (typeof showView_Only_Dialog === 'function') {
            showView_Only_Dialog("Pick visible columns", '<table id="COMMONVISIBLECOLS_JqGrid"> </table>', functionWhenDone)

            $('#COMMONVISIBLECOLS_JqGrid').jqCreator({
                'jsonobject': json_input,
                'multiselect': true,
                'width': 400
            });
        } else {
            console.log('jqCreator: showView_Only_Dialog not defined! ');
        }
    }


}(jQuery));

//lop through header to find which column to get

//jqgridID : ID of the table that JQgrid is set to
//column: the column as defined in colName or the header
//availible calculations:
// avg, sum, count, min, max

function jqAggCalc(jqgridID, column, calculation) {
    //Initializing values
    var rowids = [];
    var row_id;
    var reversedString,
        count,
        total,
        base,
        elements,
        i,
        currentitem,
        currentrow,
        reversedString,
        values;

    //grabs the row ids and pushes them into rowids
    $('#' + jqgridID).find('input, div').each(function() {
        row_id = $(this).attr('row_id');
        if (row_id !== undefined) {
            if ($.inArray(row_id, rowids) < 0 && row_id.length === 36) {
                rowids.push($(this).attr('row_id'));
            }
        }
    });


    //more values initialized
    count = 0;
    total = 0;
    //id of the fields without the row id
    base = jqgridID.substring(0, jqgridID.length - 7) + "_" + column.replace(" ", "_");
    elements = $('#' + jqgridID).find('div, input');
    values = [];


    for (j in rowids) {
        //Need to compare the reverse of the ids.
        // jqgridID: INVPROCHOURSDETAILS_JqGrid
        // base: INVPROCHOURSDETAILS_Hours
        // element[x].id: decINVPROCHOURSDETAILS_Hours_5a3edede-5fbf-407d-b8fd-6562ebfc114f
        // As you can see here, the first few characters of the rowid is variable
        // but it will always end with the base + "_" + column
        //therefor, we have to reverse both and compare them

        reversedString = base + "_" + rowids[j];

        reversedString = reversedString.split("").reverse().join("");


        for (i in elements) {
            if (elements[i] !== undefined && elements[i].id !== undefined) {
                if (elements[i].id.split("").reverse().join("").indexOf(reversedString) == 0) {

                    values.push($(elements[i]).is('div') ? $(elements[i]).html() : $(elements[i]).val());
                }
            }
        }
    }

    //total is the value that is returned. Whatever you do, set total to whatever you want to output
    switch (calculation.toUpperCase()) {
        case "SUM":
        case "ADD":
            for (i in values) {
                if (!isNaN(+values[i])) {
                    total += +values[i];
                } else {
                    throw "Error: Trying to sum non numbers";
                }
            }
            break;
        case "COUNT":
        case "CNT":
            total = values.length;
            break;
        case "AVERAGE":
        case "AVG":
            for (i in values) {
                if (!isNaN(+values[i])) {
                    total += +values[i];
                } else {
                    throw "Error: Trying to avg non numbers";
                }
            }

            total = total / (values.length);
            break;


        case "MIN":
            if (values.length > 0) {
                total = values[0];
                for (i in values) {
                    if (!isNaN(+values[i])) {
                        total = total > values[i] ? values[i] : total;
                    } else {
                        throw "Error: Trying to min non numbers";
                    }
                }
            }
            break;
        case "MAX":
            if (values.length > 0) {
                total = values[0];
                for (i in values) {
                    if (!isNaN(+values[i])) {
                        total = total < values[i] ? values[i] : total;
                    } else {
                        throw "Error: Trying to max non numbers";
                    }
                }
            }
            break;

        default:
            throw "Error: Not a valid calculation command";
    }

    return total;

}


// function jqCreator_ColumnSelect(table_id){
//     var allColumns = $('#'+ table_id).jqCreator('getColumns');

//     var allColumns_json = [];

//     var i;

//     for(i = 0; i < allColumns.length; i++){
//         allColumns_json.push({'Column':allColumns[i]});
//     }

//     var json_input = { 
//         "page": 1,
//         "total": 5,
//         "records": 10,
//         "rows":allColumns_json
//     };


//     showView_Only_Dialog("Pick visible columns", '<table id="COMMONVISIBLECOLS_JqGrid"> </table>', initCommon_Objects_Grid_Columns_End)

//     $('#COMMONVISIBLECOLS_JqGrid').jqCreator({
//         'jsonobject':json_input,
//         'multiselect':true,
//         'width':400
//     });

// }


// function initCommon_Objects_Grid_Columns_End(){
//     var x  = $('#COMMONVISIBLECOLS_JqGrid').jqGrid('getGridParam','selarrrow');
//     var i;

//     for(i = 0; i < x.length; i++){
//         x[i] = --x[i];
//     }

//     var allColumns = $('#COMMONVISIBLECOLS_JqGrid').jqGrid('getRowData');

//     var outputArray = [];
//     for(i = 0; i < x.length; i++){
//         outputArray.push(allColumns[x[i]]['Column']);
//     }

//     initCommon_Objects_Grid(outputArray);
// }

// function visibleColumnDialog(json_data){
//     $(
// }

//*******************************
// Code for around Invoice Processing
//********************************


//utility function

// function setCommon_Generic_Objects_Grid(json_data) {
//     json_data = getApp_Records(json_data, '', '');
//     var visible_cols = ['Utility_Name', 'Utility_Description'];
//     var col_widths = [200, 580];
//     var col_aliases = ['Utility Name', 'Utility Description'];
//     var objectname = 'Utility';
//     var imginput = "CCIT/execute_16x16.png";
//     var functions = [];
//     functions.push(function() {
//         alert("cat");
//     });
//     var table = "Common_Generic_Objects_JqGrid";

//     createJQ(json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table);

//     $('#divCommon_Generic_Objects_UserControl_Container').show();
// }

// function setCommon_Generic_Objects_Grid(params) {
//     var filters = params.filters;
//     var sql = params.sql;
//     var json_data = getApp_Records(sql, '', '');

//     $('#Common_Generic_Objects_JqGrid').jqCreator({
//         jsonobject: json_data,
//         visible_cols: ['Utility_Name', 'Utility_Description'],
//         col_widths: [250, 664],
//         col_aliases: ['Utility Name', 'Utility Description'],
//         objectname: 'Utility',
//         functions: [doCommon_Home_Generic_Objects_Click],
//         imginput: "CCIT/execute_16x16.png",
//         table: "Common_Generic_Objects_JqGrid",
//         width: 960
//     });

//     // createJQ(json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table, 960);

//     $(".Custom_Report_Preview_Hover").hover(function() {
//         $(this).css('cursor', 'pointer');
//     }, function() {
//         $(this).css('cursor', 'auto');
//     });



//$("#Common_Generic_Objects_JqGrid").jqGrid('GridUnload');

//if (json_data !== undefined && json_data !== null) {
//    initCommon_Generic_Objects_Grid(json_data);
//} else {
//    $('#divCommon_Generic_Objects_No_Results').show();
//}
// }



//This is for the utilities page.

// function doCommon_Home_Generic_Objects_Click(img_id) {
//     var utility_id = $('#' + img_id).attr('utility_id');
//     var utility_name = $('#' + img_id).attr('utility_name');

//     doCustom_Executable_Item_Click('utility', utility_name, 'navigate');
// }

//Reports function

// function initCommon_Reports_Grid() {
//     // var other_params;

//     //if (generic_lookup_lookup_data.max_columns != 'undefined' && generic_lookup_lookup_data.max_columns != null && generic_lookup_lookup_data.max_columns.toString().length > 0) {
//     //    if (!isNaN(generic_lookup_lookup_data.max_columns)) {
//     //        max_columns = parseInt(generic_lookup_lookup_data.max_columns);
//     //    }
//     //}
//     $('#Common_Reports_JqGrid').jqCreator({
//         jsonobject: common_custom_reports_json_data,
//         visible_cols: ['Report_Name', 'Report_Description'],
//         col_widths: [200, 580],
//         col_aliases: ['Report Name', 'Report Description'],
//         objectname: 'Report',
//         imginput: "CCIT/execute_16x16.png",
//         functions: [doCommon_Home_Reports_Click]
//     });


// createJQ(common_custom_reports_json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table);


// }

// function initCommon_Jobs_Grid() {
//     $('#Common_Jobs_JqGrid').jqCreator({
//         jsonobject: common_custom_jobs_json_data,
//         visible_cols: ['Job_Name', 'Job_Description'],
//         col_widths: [300, 600],
//         col_aliases: ['Job Name', 'Description'],
//         objectname: 'Job',
//         imginput: "CCIT/execute_16x16.png",
//         functions: [doCommon_Home_Jobs_Click],
//         table: "Common_Jobs_JqGrid"
//     });

//     // createJQ(common_custom_jobs_json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table);

//     //$('#gbox_Common_Jobs_JqGrid' + ' thead tr').show();
// }

// function initCommon_Codetables_Grid() {
//     //     {"Codetable_Id":"9954b49d-ccab-c042-a578-5512234ffd98",
//     // "Codetable_Key":"CT20130416_1147193437114_000001",
//     // "TableName":"Approval Code",
//     // "Description":"Approval Code",
//     // "Is_UserDefined":false,"Created_By":"System User",
//     // "Date_Created":"04/16/2013 11:47:19",
//     // "Modified_By":"System User",
//     // "Date_Modified":"04/16/2013 11:47:19"},

//     var visible_cols = ['TableName', 'Description'];
//     var col_widths = [300, 600];
//     var col_aliases = ['Table', 'Key'];
//     var objectname = 'Codetable';
//     var imginput = "CCIT/execute_16x16.png";
//     // var functions = [];
//     // functions.push(doCommon_Home_Codetables_Click);
//     var table = "Common_Codetables_JqGrid";

//     createJQ(common_custom_codetables_json_data, visible_cols, col_widths, col_aliases, objectname, null, null, table);

// }

// function initCommon_Groups_Grid() {
//     var visible_cols = ['Group_Name', 'Group_Description'];
//     var col_widths = [300, 600];
//     var col_aliases = ['Group', 'Description'];
//     var objectname = 'Group';
//     var imginput = "CCIT/execute_16x16.png";
//     var functions = [];
//     var table = "" + table;

//     createJQ(common_custom_groups_json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table);



// }

// function initCommon_Users_Grid() {
//     var visible_cols = ['Last_Name', 'First_Name', 'Display_Name', 'Email', 'User_Status'];
//     var col_widths = [180, 180, 179, 179, 179];
//     var col_aliases = undefined;
//     var objectname = 'User';
//     var imginput = "CCIT/execute_16x16.png";
//     var functions = [];
//     var table = "Common_Users_JqGrid";

//     createJQ(common_custom_users_json_data, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table);
// }



//*******************************
// Full Example
//*******************************

// function run() {
// // The object needs to look like this one: (It must have rows)
//     var jsonobject = {
//         "page": 1,
//         "total": 156,
//         "records": 10,
//         "rows": [

//             {
//                 "Object_Id": "e9ac253a-3c3e-47e4-869c-563e283835fb",
//                 "Object_Key": "INV20130528_162453176",
//                 "Name": "Phil Demo 2",
//                 "Description": "Phil Demo 2 - Services",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "7c3810f4-2068-4cb5-84bf-0dd36b0254a3",
//                 "Object_Key": "INVPROC_20130417_104016301",
//                 "Name": "Phil - Test 5",
//                 "Description": "Discount test (changed vendor terms)",
//                 "Created_By": "Guy, Test",
//                 "Date_Created": "04/17/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "15848790-8f10-48e5-ba32-7499fdc48ec6",
//                 "Object_Key": "INV20130528_162454783",
//                 "Name": "Phil Demo 1",
//                 "Description": "Phil Demo 1 - Contract",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "cddee9e5-0f71-4cfc-83a0-fcb6ba298db5",
//                 "Object_Key": "INV20130503_122513295",
//                 "Name": "Invoice-INV20130503_122513295",
//                 "Description": "batch test",
//                 "Created_By": "System User",
//                 "Date_Created": "05/03/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/05/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "0e1dc9bb-5e7c-4e79-a022-15ffd27446f7",
//                 "Object_Key": "INVPROC_20130416_133152878",
//                 "Name": "wTest",
//                 "Description": "addr cd 1 Line, 2 allocations;travel hours rates not met/exception yes",
//                 "Created_By": "Simpo, Tammy",
//                 "Date_Created": "04/16/2013",
//                 "Modified_By": "Simpo, Tammy",
//                 "Date_Modified": "04/16/2013",
//                 "Is_Locked": "No"
//             }
//         ]
//     };
// //  Name that appears on the colum headers to the user. Needs to be the same length as col_widths and visible_cols if they exist!
//     var col_aliases = [
//         "Name",
//         "Description",
//         "Created By",
//         "Date Created",
//         "Modified By",
//         "Date Modified"
//     ];

// // Which columns are visible. Needs to be the same length as col_aliases and col_widths if they exist!
//     var visible_cols = [
//         "Name",
//         "Description",
//         "Created_By",
//         "Date_Created",
//         "Modified_By",
//         "Date_Modified"
//     ];

// // Width of the columns. Needs to be the same length as col_aliases and visible_cols if they exist!
//     var col_widths = [
//         20,
//         10,
//         50,
//         50,
//         50,
//         50
//     ]

// // Needed if you use the image formatter
//     var objectname = "Object";

// // Source of the image on the button
//     var imginput = "CCIT/preview_copy_blank_52x16.png";


//     var x = function(id) {
//         alert("cat");
//     }

//     var y = function(id) {
//         alert("Dog");

//     }
//     var z = function(id) {
//         alert("Lizard");

//     }

// // Function array for the button on the right
//     var functions = [];

//     functions.push(x);
//     functions.push(y);
//     functions.push(z);

// // ID of the table where the jqGrid will go
//     var table = "Common_Generic_Objects_JqGrid";.

// // Functions for the navBar buttons
//    var pager_functions = [x,null,y,nul,z];
// //  The 5 correspond to Add, View, Edit, Delete, Export. You can pass in null if you want to hide that button.
// //  Example: [f,null,f,f] -> [Add, Edit, Delete]; [null,null,null,f,f] -> [Delete, Export]; [null, f] -> [Edit]  


//     createJQ(jsonobject, visible_cols, col_widths, col_aliases, objectname, imginput, functions, table, pager_functions);

// }



// *******************************
// Minimal Example
// *******************************

// function run() {
// // The object needs to look like this one: (It must have rows)
//     var jsonobject = {
//         "page": 1,
//         "total": 156,
//         "records": 10,
//         "rows": [

//             {
//                 "Object_Id": "e9ac253a-3c3e-47e4-869c-563e283835fb",
//                 "Object_Key": "INV20130528_162453176",
//                 "Name": "Phil Demo 2",
//                 "Description": "Phil Demo 2 - Services",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "7c3810f4-2068-4cb5-84bf-0dd36b0254a3",
//                 "Object_Key": "INVPROC_20130417_104016301",
//                 "Name": "Phil - Test 5",
//                 "Description": "Discount test (changed vendor terms)",
//                 "Created_By": "Guy, Test",
//                 "Date_Created": "04/17/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "15848790-8f10-48e5-ba32-7499fdc48ec6",
//                 "Object_Key": "INV20130528_162454783",
//                 "Name": "Phil Demo 1",
//                 "Description": "Phil Demo 1 - Contract",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "cddee9e5-0f71-4cfc-83a0-fcb6ba298db5",
//                 "Object_Key": "INV20130503_122513295",
//                 "Name": "Invoice-INV20130503_122513295",
//                 "Description": "batch test",
//                 "Created_By": "System User",
//                 "Date_Created": "05/03/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/05/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "0e1dc9bb-5e7c-4e79-a022-15ffd27446f7",
//                 "Object_Key": "INVPROC_20130416_133152878",
//                 "Name": "wTest",
//                 "Description": "addr cd 1 Line, 2 allocations;travel hours rates not met/exception yes",
//                 "Created_By": "Simpo, Tammy",
//                 "Date_Created": "04/16/2013",
//                 "Modified_By": "Simpo, Tammy",
//                 "Date_Modified": "04/16/2013",
//                 "Is_Locked": "No"
//             }
//         ]
//     };


// // ID of the table where the jqGrid will go
//     var table = "Common_Generic_Objects_JqGrid";


//     createJQ(jsonobject, null, null, null, null, null, null, table, null);

// }

//*******************************
// jQuery Example
//*******************************
// function run() {
//     var inputjsonobject = {
//         "page": 1,
//         "total": 156,
//         "records": 10,
//         "rows": [

//             {
//                 "Object_Id": "e9ac253a-3c3e-47e4-869c-563e283835fb",
//                 "Object_Key": "INV20130528_162453176",
//                 "Name": "Phil Demo 2",
//                 "Description": "Phil Demo 2 - Services",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "7c3810f4-2068-4cb5-84bf-0dd36b0254a3",
//                 "Object_Key": "INVPROC_20130417_104016301",
//                 "Name": "Phil - Test 5",
//                 "Description": "Discount test (changed vendor terms)",
//                 "Created_By": "Guy, Test",
//                 "Date_Created": "04/17/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "15848790-8f10-48e5-ba32-7499fdc48ec6",
//                 "Object_Key": "INV20130528_162454783",
//                 "Name": "Phil Demo 1",
//                 "Description": "Phil Demo 1 - Contract",
//                 "Created_By": "System User",
//                 "Date_Created": "05/28/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/10/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "cddee9e5-0f71-4cfc-83a0-fcb6ba298db5",
//                 "Object_Key": "INV20130503_122513295",
//                 "Name": "Invoice-INV20130503_122513295",
//                 "Description": "batch test",
//                 "Created_By": "System User",
//                 "Date_Created": "05/03/2013",
//                 "Modified_By": "Guy, Test",
//                 "Date_Modified": "07/05/2013",
//                 "Is_Locked": "No"
//             },

//             {
//                 "Object_Id": "0e1dc9bb-5e7c-4e79-a022-15ffd27446f7",
//                 "Object_Key": "INVPROC_20130416_133152878",
//                 "Name": "wTest",
//                 "Description": "addr cd 1 Line, 2 allocations;travel hours rates not met/exception yes",
//                 "Created_By": "Simpo, Tammy",
//                 "Date_Created": "04/16/2013",
//                 "Modified_By": "Simpo, Tammy",
//                 "Date_Modified": "04/16/2013",
//                 "Is_Locked": "No"
//             }
//         ]
//     };

//     var x = function(id) {
//         alert("cat");
//     }

//     var y = function(id) {
//         alert("Dog");

//     }
//     var z = function(id) {
//         alert("Lizard");
//     }

//     $('#Common_Generic_Objects_JqGrid').jqCreator({
//         jsonobject: inputjsonobject,
//         col_aliases: ["Name", "Description", "Created By", "Date Created", "Modified By", "Date Modified"],
//         visible_cols: ["Name", "Description", "Created_By", "Date_Created", "Modified_By", "Date_Modified"],
//         col_widths: [20, 10, 50, 50, 50, 50],
//         objectname: "Object",
//         imginput: "CCIT/preview_copy_blank_52x16.png",
//         functions: [x, y, z],
//         table: "Common_Generic_Objects_JqGrid",
//         pager_functions: [x, null, y, nul, z]
//     });



// function jqCreator_Tests(){
// $.fn.jqCreator.formatJQgrid;
// }



// function run() {
//     var inputjsonobject = {
//         "page": "1",
//         "total": 31,
//         "records": "10",
//         "rows": [{
//             "Object_Id": "33874356-04ca-49d0-8b51-117e5179afc3",
//             "Vendor": "19SCEG/SCE&G",
//             "Invoice_Number": "3029"
//         }, {
//             "Object_Id": "0c39101c-cb7b-4728-bf8d-1c0da80f9404",
//             "Vendor": "03CACS/Capitol Coffee & Supply",
//             "Invoice_Number": "97195"
//         }, {
//             "Object_Id": "00726803-0f4f-46a2-b37f-20fdf26bd94e",
//             "Vendor": "01ATNT/Alliant Techsystems Inc",
//             "Invoice_Number": "INV-00213140"
//         }, {
//             "Object_Id": "ecc1b149-37a6-41d7-95a5-278d9410d5f7",
//             "Vendor": "14NASS/NASSCO",
//             "Invoice_Number": "12-59999"
//         }, {
//             "Object_Id": "568c485e-042b-466a-aad9-30dadee7d86b",
//             "Vendor": "16PENN/Pennsylvania State Univ",
//             "Invoice_Number": "2BHN0-4"
//         }, {
//             "Object_Id": "b07e552b-12a4-4547-88ce-37ee8e265f04",
//             "Vendor": "21USC/USC",
//             "Invoice_Number": "69042"
//         }, {
//             "Object_Id": "877fe585-d61f-4036-8c11-3df105d3b7d5",
//             "Vendor": "02BASL/BAE Systems Land & Arm",
//             "Invoice_Number": "BVN0006"
//         }, {
//             "Object_Id": "e8f04c51-6630-4ea8-b83b-4c641e807b84",
//             "Vendor": "16PENN/Pennsylvania State Univ",
//             "Invoice_Number": "2BHR0-4"
//         }, {
//             "Object_Id": "790ec29b-4339-4294-9913-534f9dcb7b4e",
//             "Vendor": "01ATKS/ATK Launch Systems Inc",
//             "Invoice_Number": "E439-0014"
//         }, {
//             "Object_Id": "b7b73569-1dd3-4b9d-a485-582ce4090c64",
//             "Vendor": "02BAEO/BAE Systems, Ordnance",
//             "Invoice_Number": "12794"
//         }, {
//             "Object_Id": "0ed3a83f-5ef1-4a63-800b-609145207706",
//             "Vendor": "07GRNT/Gradient",
//             "Invoice_Number": "807-0001"
//         }, {
//             "Object_Id": "b4a38428-dbcf-4956-a8a7-6d2664beb648",
//             "Vendor": "07GDOT/General Dynamics OTS",
//             "Invoice_Number": "ATI-08-005"
//         }, {
//             "Object_Id": "876c323f-ed82-43de-a4ff-74700a1293e8",
//             "Vendor": "01ARUT/Armstrong Utilities, Inc.",
//             "Invoice_Number": "3694"
//         }, {
//             "Object_Id": "17e043f3-a5fb-47e1-a220-81726755f3a0",
//             "Vendor": "19SAVT/Savit Corporation",
//             "Invoice_Number": "J3P95-001"
//         }, {
//             "Object_Id": "47dee194-a52f-4ecf-b065-8be68308499d",
//             "Vendor": "09IOWA/Iowa State University",
//             "Invoice_Number": "62"
//         }, {
//             "Object_Id": "ebd78e10-1210-4d34-bf43-95ecf2e0c995",
//             "Vendor": "19SAVT/Savit Corporation",
//             "Invoice_Number": "J2P69-083"
//         }, {
//             "Object_Id": "fcd202bc-d4f6-491b-a41e-97f7ffe2e1f0",
//             "Vendor": "01AFS/American Foundry ",
//             "Invoice_Number": "cmc-smrt46"
//         }, {
//             "Object_Id": "b29eb158-a53a-441f-934c-98a20c62737a",
//             "Vendor": "14NASS/NASSCO",
//             "Invoice_Number": "7-59998"
//         }, {
//             "Object_Id": "97423639-6171-47bc-95e4-9ae82186df09",
//             "Vendor": "19SCII/SciTech Services Inc",
//             "Invoice_Number": "1037001-031"
//         }, {
//             "Object_Id": "b4d016ce-8df9-4198-bff0-9dd17247f0dc",
//             "Vendor": "12LHMAC/Lockheed Martin Aeronaut",
//             "Invoice_Number": "90014855"
//         }, {
//             "Object_Id": "681e4a97-27f1-4ed1-8565-a03e7468a76b",
//             "Vendor": "10JUDI/Judith MacGregor, TCS",
//             "Invoice_Number": "51"
//         }, {
//             "Object_Id": "b75083dc-915d-4469-aaeb-ae678873649d",
//             "Vendor": "03COMS/Commercial Maint. Svc",
//             "Invoice_Number": "31178"
//         }, {
//             "Object_Id": "ecc3706b-8cbe-4704-976c-b272823ec39f",
//             "Vendor": "01ALSC/Alloy Surfaces Company ",
//             "Invoice_Number": "205720"
//         }, {
//             "Object_Id": "d13bad9b-bc56-4cab-a5f7-bc6a930438aa",
//             "Vendor": "01ATNT/Alliant Techsystems Inc",
//             "Invoice_Number": "INV-00215800"
//         }, {
//             "Object_Id": "b7c82e12-2b50-42fe-8b5e-c703d34a09ac",
//             "Vendor": "12LHMAC/Lockheed Martin Aeronaut",
//             "Invoice_Number": "900144855"
//         }, {
//             "Object_Id": "3ef382a6-af59-469f-a2e3-d61defa9c275",
//             "Vendor": "02BCAB/Baciocco, Admiral Albert",
//             "Invoice_Number": "082213"
//         }, {
//             "Object_Id": "87586d8d-2ea5-44f8-aa05-e3ae2d09ce32",
//             "Vendor": "21UNTO/University of Toledo",
//             "Invoice_Number": "16333"
//         }, {
//             "Object_Id": "7c25cec4-21b7-4439-a685-eaf49d90864f",
//             "Vendor": "03CULM/Cullum Services Inc.",
//             "Invoice_Number": "94236"
//         }, {
//             "Object_Id": "50242a65-2b39-46e9-95b3-edb29eaade7b",
//             "Vendor": "02BAEO/BAE Systems, Ordnance",
//             "Invoice_Number": "12755"
//         }, {
//             "Object_Id": "6c02de35-c09f-49b5-910d-f6e253960465",
//             "Vendor": "15ORBT/Orbital Research Inc.",
//             "Invoice_Number": "2011-315"
//         }, {
//             "Object_Id": "1861f258-c19c-4bbb-a0a4-ff4b72568e46",
//             "Vendor": "01ATNT/Alliant Techsystems Inc",
//             "Invoice_Number": "INV-00213130"
//         }]
//     };

//     var x = function(id) {
//         alert("cat");
//     }

//     var y = function(id) {
//         alert("Dog");

//     }
//     var z = function(id) {
//         alert("Lizard");
//     }

//     $('#Common_Generic_Objects_JqGrid').jqCreator({
//         jsonobject: inputjsonobject
//     });

// }



// function run2() {
//     var inputjsonobject = {
//         "page": 1,
//         "total": 5,
//         "records": 10,
//         "rows": [{
//             "Object_Id": "7ba705c2-5ede-4ec8-a41f-cffa93aeceae",
//             "Object_Key": "INV20130503_122512109",
//             "Name": "Invoice-INV20130503_122512109",
//             "Description": "Invoice uploaded from staging job",
//             "Created_By": "System User",
//             "Date_Created": "05/03/2013",
//             "Modified_By": "Pat Gates",
//             "Date_Modified": "08/09/2013",
//             "Is_Locked": "No"
//         }, {
//             "Object_Id": "e4bdac49-ae69-40f5-b3d2-bc54441e2ba2",
//             "Object_Key": "INV20130423_142923413",
//             "Name": "Invoice-INV20130423_142923413",
//             "Description": "locking with reviewer signatures",
//             "Created_By": "System User",
//             "Date_Created": "04/23/2013",
//             "Modified_By": "Heinlein, Philip",
//             "Date_Modified": "06/18/2013",
//             "Is_Locked": "No"
//         }, {
//             "Object_Id": "242f2843-11bd-465f-a844-c63336ef724d",
//             "Object_Key": "INVPROC_20130425_150407277",
//             "Name": "Phil - Test 10B",
//             "Description": "Review Group search - PMO",
//             "Created_By": "Heinlein, Philip",
//             "Date_Created": "04/25/2013",
//             "Modified_By": "Heinlein, Philip",
//             "Date_Modified": "04/25/2013",
//             "Is_Locked": "No"
//         }, {
//             "Object_Id": "77977bac-d1b9-491c-ba1a-595f14cb64bc",
//             "Object_Key": "INVPROC_20130425_143109856",
//             "Name": "Phil - Test 10A",
//             "Description": "Review Group search - AFG",
//             "Created_By": "Heinlein, Philip",
//             "Date_Created": "04/25/2013",
//             "Modified_By": "Heinlein, Philip",
//             "Date_Modified": "04/25/2013",
//             "Is_Locked": "No"
//         }, {
//             "Object_Id": "9113b7a8-0180-4553-bb60-857de3338395",
//             "Object_Key": "INVPROC_20130419_131356141",
//             "Name": "Phil - Test 7",
//             "Description": "~!@#$%^&*()_ -= {}[]|\\ :;\"\u0027 ",
//             "Created_By": "Heinlein, Philip",
//             "Date_Created": "04/19/2013",
//             "Modified_By": "Heinlein, Philip",
//             "Date_Modified": "04/25/2013",
//             "Is_Locked": "No"
//         }]
//     };

//     var x = function(id) {
//         alert("cat");
//     }

//     var y = function(id) {
//         alert("Dog");

//     }
//     var z = function(id) {
//         alert("Lizard");
//     }

//     $('#Common_Generic_Objects_JqGrid').jqCreator({
//         jsonobject: inputjsonobject
//     });

// }



// function jqCreator_Tests() {
//     $.fn.jqCreator.formatJQgrid;
// }


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    }
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
}

$.fn.hcenter = function() {
    this.css({
        'position': 'absolute',
        'left': '50%'
        // ,'top': '50%'
    });
    this.css({
        'margin-left': -this.outerWidth() / 2 + 'px'
        // ,'margin-top': -this.outerHeight() / 2 + 'px'
    });

    return this;
}


function toString2(input) {
    return input !== undefined && input !== null ? Object.prototype.toString.call(input) : null;
}

Object.keys = Object.keys || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function(o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }

        return result;
    };
})();

function navBarFuncWrapper(inputtable, inputFunction, inputcaption) {
    var innerFunction = inputFunction;
    var caption = inputcaption;
    var table = inputtable;
    var run = function() {
        // var selectedRow = table.jqGrid('getGridParam', 'selrow') !== null ? (+table.jqGrid('getGridParam', 'selrow') - 1) : undefined;
        // var rowObject = selectedRow !== undefined ? table.jqGrid('getRowData')[selectedRow] : undefined;
        var rowObject = getGridSelectedObject(table);
        innerFunction(rowObject);
        return true;
    }
    return run;
}

function getFullKeys(object) {
    var propertyNames = Object.keys(object);
    var moreProps = [];
    var innerKey;
    var i;

    for (i = 0; i < propertyNames.length; i++) {
        var currentProperty = propertyNames[i];
        if (toString2(object[currentProperty]) === '[object Object]') {
            var currentSubItem = object[currentProperty];
            var innerKeys = getFullKeys(currentSubItem);
            var j;
            for (j = 0; j < innerKeys.length; j++) {
                moreProps.push([currentProperty, innerKeys[j]].join("."))
            }
        }
    }
    propertyNames = propertyNames.concat(moreProps);
    return propertyNames;

}

function getValueFromObject(object, inputarray) {
    if (typeof inputarray === 'string') {
        return getValueFromObject(object, inputarray.split('.'));
    } else if (toString2(inputarray) === '[object Array]') {
        if (inputarray.length === 1) {
            return object[inputarray[0]];
        } else {
            var currentValue = object[inputarray[0]];
            inputarray.splice(0, 1);
            return getValueFromObject(currentValue, inputarray);
        }
    } else {
        return undefined;
    }
}

//*******************************
// Utility functions
//*******************************

function count() {
    var c = 0;
    for (var p in this)
        if (this.hasOwnProperty(p))++c;
    return c;
}


function getRowData(table_id) {
    var x = $('#' + table_id).jqGrid('getRowData');
    if (x !== undefined && x.length > 0) {
        return x;
    } else {
        return $('#' + table_id).jqGrid('getGridParam', 'data');
    }

}

function getGridSelectedObject(input){
    var tableobject;
    if(toString2(input) === "[object HTMLTableElement]" || input instanceof jQuery){
        tableobject = $(input);
    } else if (typeof input === "string"){
        tableobject = $('#' + input);
    }

    var selectedRow = tableobject.jqGrid('getGridParam','selrow');
    var object = tableobject.jqGrid('getRowData',selectedRow);

    return object;
}


jQuery.fn.center = function() {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + "px");
    return this;
}
