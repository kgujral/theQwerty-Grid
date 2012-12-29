// global variables 
var _theQwertyGrid_table;
var _theQwertyGrid_rowStart;
var _theQwertyGrid_rowEnd;
var _theQwertyGrid_pageSize;
var _theQwertyGrid_data;
var _theQwertyGrid_displayData;
var _theQwertyGrid_cols;
var _theQwertyGrid_sortInAsc;
var _theQwertyGrid_PK = new Array();
var _theQwertyGrid_tableProps;
//end of global variables


/**
 * initialising various table properties
 */
		function theQwertyGrid_init(_tableProps) {
			
			_tableProps.data = typeof(_tableProps.data) === "undefined" ? (new Array()) : _tableProps.data;
			_tableProps.errorMessage = typeof(_tableProps.errorMessage) === "undefined" ? "No data to display" : _tableProps.errorMessage;
			_tableProps.loadingImage = typeof(_tableProps.loadingImage) === "undefined" ? "undefined" : _tableProps.loadingImage;
			_tableProps.wrapperId = typeof(_tableProps.wrapperId) === "undefined" ? "body" : "#"+_tableProps.wrapperId;
			_tableProps.tableId = typeof(_tableProps.tableId) === "undefined" ? "table-id" : _tableProps.tableId;
			_tableProps.pageSize = typeof(_tableProps.pageSize) === "undefined" ? [10,20,30] :  _tableProps.pageSize;
			_tableProps.style = typeof(_tableProps.style) === "undefined" ? "" :  _tableProps.style;
			var _indexPK = 0;
			for(var i=0; i<_tableProps.cols.length; i++) {
				_tableProps.cols[i].sortable = typeof(_tableProps.cols[i].sortable) === "undefined" ? false :  _tableProps.cols[i].sortable;
				_tableProps.cols[i].hide = typeof(_tableProps.cols[i].hide) === "undefined" ? false :  _tableProps.cols[i].hide;
				_tableProps.cols[i].PK = typeof(_tableProps.cols[i].PK) === "undefined" ? false :  _tableProps.cols[i].PK;
				if(_tableProps.cols[i].PK == true) {
					_theQwertyGrid_PK[_indexPK ++] = i;
				} 
				_tableProps.cols[i].type = (typeof(_tableProps.cols[i].type) === "undefined") || (_tableProps.cols[i].type != "string" && _tableProps.cols[i].type != "int") ? "string" :  _tableProps.cols[i].type;
				_tableProps.cols[i].displayAs = typeof(_tableProps.cols[i].displayAs) === "undefined" ? "normal" :  _tableProps.cols[i].displayAs;
				_tableProps.cols[i].values = typeof(_tableProps.cols[i].values) === "undefined" ? new Array() :  _tableProps.cols[i].values;
				_tableProps.cols[i].displayValues = typeof(_tableProps.cols[i].displayValues) === "undefined" ? _tableProps.cols[i].values :  _tableProps.cols[i].displayValues;
				_tableProps.cols[i].func = typeof(_tableProps.cols[i].func) === "undefined" ? "theQwertyDummyFunction" :  _tableProps.cols[i].func;
				_tableProps.cols[i].transformer = typeof(_tableProps.cols[i].transformer) === "undefined" ? "theQwertyDummyFunctionArg" :  _tableProps.cols[i].transformer;
				_tableProps.cols[i].cssClass = typeof(_tableProps.cols[i].cssClass) === "undefined" ? "" :  _tableProps.cols[i].cssClass;
				_tableProps.cols[i].width = typeof(_tableProps.cols[i].width) === "undefined" ? "auto" :  _tableProps.cols[i].width;
				
			}
			_tableProps.controls = typeof(_tableProps.controls) === "undefined" ? (new Array()) : _tableProps.controls;
			for(var i=0; i<_tableProps.controls.length; i++) {
				_tableProps.controls[i].type = typeof(_tableProps.controls[i].type) === "undefined" ? "button" :  _tableProps.controls[i].type;
				_tableProps.controls[i].func = typeof(_tableProps.controls[i].func) === "undefined" ? "theQwertyDummyFunction" :  _tableProps.controls[i].func;
				_tableProps.controls[i].caption = typeof(_tableProps.controls[i].caption) === "undefined"  ? "" :  _tableProps.controls[i].caption;
				_tableProps.controls[i].cssClass = typeof(_tableProps.controls[i].cssClass) === "undefined"  ? "" :  _tableProps.controls[i].cssClass;
				_tableProps.controls[i].headerCaption = typeof(_tableProps.controls[i].headerCaption) === "undefined"  ? _tableProps.controls[i].caption :  _tableProps.controls[i].headerCaption;
				_tableProps.controls[i].title = typeof(_tableProps.controls[i].title) === "undefined"  ? _tableProps.controls[i].caption :  _tableProps.controls[i].title;
				_tableProps.controls[i].displayPredicate = typeof(_tableProps.controls[i].displayPredicate) === "undefined" ? "theQwertyDummyFunction" :  _tableProps.controls[i].displayPredicate;
				_tableProps.controls[i].predicateProperty = typeof(_tableProps.controls[i].predicateProperty) === "undefined" ? _tableProps.cols[0].name : _tableProps.controls[i].predicateProperty;
			}

			_tableProps.paging = typeof(_tableProps.paging) === "undefined" ? (new Array()) : _tableProps.paging;
			_tableProps.paging.enable = typeof(_tableProps.paging.enable) === "undefined" ? false :  _tableProps.paging.enable;
			_tableProps.paging.remote = typeof(_tableProps.paging.remote) === "undefined" ? false :  _tableProps.paging.remote;
			_tableProps.paging.totalRecords = typeof(_tableProps.paging.totalRecords) === "undefined" ? _tableProps.data.length :  _tableProps.paging.totalRecords;
			_tableProps.paging.url = typeof(_tableProps.paging.url) === "undefined" ? "" :  _tableProps.paging.url;
			_tableProps.successCallback = typeof(_tableProps.successCallback) === "undefined" ? "theQwertyDummyFunction" :  _tableProps.successCallback;
		
			jQuery(_tableProps.wrapperId).hide();
			_theQwertyGrid_tableProps = _tableProps;
			_theQwertyGrid_rowStart = 0;
			_theQwertyGrid_pageSize = _tableProps.pageSize[0];
			_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
			_theQwertyGrid_data = _tableProps.data;
			_theQwertyGrid_displayData = _theQwertyGrid_data;
			_theQwertyGrid_cols = _tableProps.cols;
			_theQwertyGrid_sortInAsc = true;
			
			if(_tableProps.paging.totalRecords <= 0) {
				theQwertyGrid_showErrorMessage(_tableProps.errorMessage);
			}
			else {
				theQwertyGrid_createTable(_tableProps);
				theQwertyGrid_prevNextDisable();
			}
			
		}
// ------------------------------------------------------------------------------------------------------
// Creating table DOM
// ------------------------------------------------------------------------------------------------------
		
/**
 * creates the table's header
 */
		function theQwertyGrid_tableHeader (_tableProps){
			var thead = jQuery("<thead>");
			var tbody = jQuery("<tbody>");
			tbody.attr("id",_tableProps.tableId+"_rows");
			var theadTr = jQuery("<tr class='portlet-section-header results-header'>");
			
			for(var i=0; i< _tableProps.headerCols.length; i++) {
				var thWidth = typeof _tableProps.cols[i] === "undefined" ? "auto" : _tableProps.cols[i].width;
				if(!typeof(_tableProps.cols[i]) === "undefined" && _tableProps.cols[i].sortable) {
					var sortFunc="";
					if(_tableProps.cols[i].type == "string") {
						sortFunc = "theQwertyGrid_sortString";
					}
					else if(_tableProps.cols[i].type == "int") {
						sortFunc = "theQwertyGrid_sortInt";
					}
					theadTr.append(jQuery("<th width='"+thWidth+"' class='tableHeading'>").append("<a onclick=\""+sortFunc+"(\'"+_tableProps.cols[i].name+"\')\">"+_tableProps.headerCols[i]+"</a>"));
				}
				else if(typeof(_tableProps.cols[i]) != "undefined" && !_tableProps.cols[i].hide) {
					theadTr.append(jQuery("<th width='"+thWidth+"' class='tableHeading'>").append(_tableProps.headerCols[i]));
				}
				else if(typeof(_tableProps.cols[i]) === "undefined") {
					theadTr.append(jQuery("<th width='"+thWidth+"' class='tableHeading'>").append(_tableProps.headerCols[i]));
				}
			}
			thead.append(theadTr);
			_theQwertyGrid_table.append(thead);
			_theQwertyGrid_table.append(tbody);
		}
/**
 * creates table's footer
 */
		function theQwertyGrid_tableFooter(_tableProps) {
			if(_tableProps.paging.enable) {
				theQwertyGrid_setPageSize(false,_tableProps.pageSize[0]);
			}
		}
/**
 * creates actual table DOM
 */
		function theQwertyGrid_createTable(_tableProps) {
			_theQwertyGrid_table = jQuery("<table class = 'p90x-display-grid'>");
			_theQwertyGrid_table.attr("id",_tableProps.tableId);
			_theQwertyGrid_table.attr("style", "display: none;");
			theQwertyGrid_tableHeader(_tableProps);
			theQwertyGrid_tableFooter(_tableProps);
			jQuery(_tableProps.wrapperId).append(_theQwertyGrid_table);
			theQwertyGrid_addRows(_theQwertyGrid_displayData, _tableProps);
		}
		
/**
 * add rows to table body
 */
		function theQwertyGrid_addRows (data, tableProps) {
			var PKVals;
			var tbody = jQuery("#"+tableProps.tableId+"_rows");
			for (var i = 0; i < data.length; i++) {
			
				PKVals = "'"+data[i][_theQwertyGrid_cols[0].name]+"'";
	   			for(var j=1; j< _theQwertyGrid_PK.length; j++) {
	   				PKVals += ", '"+data[i][_theQwertyGrid_cols[_theQwertyGrid_PK[j]].name]+"'";
	        	}
				
	        	var tr = jQuery("<tr>").attr("id",tableProps.tableId+"_row"+i);
	        	var td = jQuery("<td>");
	        	if(i % 2 == 0)
	        		tr.attr("class", "odd");
	        	else
	        		tr.attr("class", "even");
	        		
	   			for(var j=0; j< _theQwertyGrid_cols.length; j++) {
	   				if(!_theQwertyGrid_cols[j].hide) {
						if(_theQwertyGrid_cols[j].displayAs == "normal") {
							tr.append(jQuery("<td>").html(window[_theQwertyGrid_cols[j].transformer](data[i][_theQwertyGrid_cols[j].name])));
						}
						else if(_theQwertyGrid_cols[j].displayAs == "select") {
							var selectId = tableProps.tableId+"-select-"+j;
							var val = data[i][_theQwertyGrid_cols[j].name];
							var selectHtml = "<select id=\""+selectId+"\"class=\"theQwertyGrid_controls "+_theQwertyGrid_cols[j].cssClass+"\" onchange=\""+_theQwertyGrid_cols[j].func+"(this,"+PKVals+")\">";
							var optionHtml = "";
							for(var  k=0; k<_theQwertyGrid_cols[j].values.length; k++) {
								if(_theQwertyGrid_cols[j].values[k] == val) {
									optionHtml += "<option selected =\"selected\" value=\""+_theQwertyGrid_cols[j].values[k]+"\">"+_theQwertyGrid_cols[j].displayValues[k]+"</option>";
								} else {
									optionHtml += "<option value=\""+_theQwertyGrid_cols[j].values[k]+"\">"+_theQwertyGrid_cols[j].displayValues[k]+"</option>";
								}
							}
							selectHtml += optionHtml + "</select>";
							
							tr.append(jQuery("<td>").html(selectHtml));
						}
	   				}
	        	}
	   			
	   			for(var j=0; j< tableProps.controls.length; j++) {
	   				if(window[tableProps.controls[j].displayPredicate](data[i][tableProps.controls[j].predicateProperty])) {
		   				if(tableProps.controls[j].type == "button") {
		   					td.append("<input title=\""+tableProps.controls[j].title+"\" class=\"theQwertyGrid_controls "+tableProps.controls[j].cssClass+"\" type=\""+tableProps.controls[j].type+"\" value=\""+tableProps.controls[j].caption+"\" onclick=\""+tableProps.controls[j].func+"(this,"+PKVals+")\"/>");
		   				}
		   				else if(tableProps.controls[j].type == "select") {
		   					var selectId = tableProps.tableId+"-select-"+i;
		   					td.append("<select id=\""+selectId+"\"class=\"theQwertyGrid_controls "+tableProps.controls[j].cssClass+"\" onchange=\""+tableProps.controls[j].func+"(this,"+PKVals+")\"></select>");
		   				}
	   				}
	        	}
	   			if(tableProps.controls.length) {
	   				tr.append(td);
	   			}
	   			tbody.append(tr);
				for(var j=0; j< tableProps.controls.length; j++) {
					if(tableProps.controls[j].type == "select") {
	   					var selectId = tableProps.tableId+"-select-"+i;
	   					window[tableProps.controls[j].populateFunc](selectId);
	   				}
				}
			}
			if(data.length > 0) {
				window[tableProps.successCallback]();
			}
			
		}

// ------------------------------------------------------------------------------------------------------
// End of Creation of table DOM functions
// ------------------------------------------------------------------------------------------------------
	

		
// ------------------------------------------------------------------------------------------------------
// Paging functions
// ------------------------------------------------------------------------------------------------------

/**
 * selects a subset of data according to the page size selected
 * and fills the grid
 */
		function theQwertyGrid_setPageSize(resetFlag, size) {
			if(resetFlag) {
				_theQwertyGrid_rowStart = 0;
			}
			_theQwertyGrid_pageSize = parseInt(size);
			_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
			if(_theQwertyGrid_rowEnd >= _theQwertyGrid_tableProps.paging.totalRecords) {
				_theQwertyGrid_rowEnd = _theQwertyGrid_tableProps.paging.totalRecords;
			}
			if(_theQwertyGrid_tableProps.paging.remote) {
				theQwertyGrid_loadPaginationData(_theQwertyGrid_rowStart, _theQwertyGrid_rowEnd-1);
			}
			else {
				var temp = [];
				for(var i=_theQwertyGrid_rowStart; i<_theQwertyGrid_rowEnd; i++) {
					temp.push(_theQwertyGrid_data[i]);
				}
				_theQwertyGrid_displayData = temp;
				theQwertyGrid_prevNextDisable();
				theQwertyGrid_reFillTable(_theQwertyGrid_displayData);
			}
			return false;
		}
		
/**
 * shows the previous page of grid
 */		
		function theQwertyGrid_prevPage () {
			_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart;
			_theQwertyGrid_rowStart = _theQwertyGrid_rowEnd - _theQwertyGrid_pageSize < 0 ?
									  0 : _theQwertyGrid_rowEnd - _theQwertyGrid_pageSize;
			theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
			return false;
		}
		
/**
 * shows the previous page of grid
 */		
		function theQwertyGrid_nextPage () {
			_theQwertyGrid_rowStart = _theQwertyGrid_rowEnd;
			_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize > _theQwertyGrid_tableProps.paging.totalRecords ?
									_theQwertyGrid_tableProps.paging.totalRecords : _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
			theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
			return false;
		}
		
		function theQwertyGrid_firstPage () {
			theQwertyGrid_setPageSize(true, _theQwertyGrid_pageSize);
			return false;
		}
		
		function theQwertyGrid_lastPage () {
			var totalPages = Math.ceil(_theQwertyGrid_tableProps.paging.totalRecords / _theQwertyGrid_pageSize);
			_theQwertyGrid_rowStart = parseInt(totalPages - 1)* _theQwertyGrid_pageSize;
			_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize > _theQwertyGrid_tableProps.paging.totalRecords ?
					_theQwertyGrid_tableProps.paging.totalRecords : _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
			theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
			return false;
		}
/**
 * disables or enables the prev and next buttons.
 */
		function theQwertyGrid_prevNextDisable() {
			if(_theQwertyGrid_rowStart <= 0) {
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_first").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_first_disabled").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_prev").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_prev_disabled").hide();
			}
			if(_theQwertyGrid_rowEnd < _theQwertyGrid_tableProps.paging.totalRecords) {
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_next").show();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_next_disabled").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_last").show();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_last_disabled").hide();
			}
			if(_theQwertyGrid_rowStart > 0) {
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_first").show();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_first_disabled").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_prev").show();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_prev_disabled").hide();
			}
			if(_theQwertyGrid_rowEnd >= _theQwertyGrid_tableProps.paging.totalRecords) {
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_next").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_next_disabled").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_last").hide();
				jQuery("."+_theQwertyGrid_tableProps.tableId+"_last_disabled").hide();
			}
		}
/**
 * loads remote data.
 * @param pageStart
 * @param pageEnd
 */	
		function theQwertyGrid_loadPaginationData(pageStart, pageEnd) {
			theQwertyGrid_startLoading();
			pageEnd ++;
			/**
			 * Converting to pageNumber and pageSize 
			 */
			var pageSize = _theQwertyGrid_pageSize;
			var pageNumber = Math.ceil(pageEnd / pageSize) ;
			/**
			 * page number is 0 index based.
			 */
			pageNumber--;
			jQuery.ajax({
				url : _theQwertyGrid_tableProps.paging.url,
				dataType : 'json',
				data:{pageNumber: pageNumber, pageSize: pageSize},
				success : function(data) {
					theQwertyGrid_stopLoading();
					theQwertyGrid_paginationControls();
					_theQwertyGrid_displayData = data.data;
					_theQwertyGrid_tableProps.data = data.data;
					theQwertyGrid_prevNextDisable();
					theQwertyGrid_reFillTable(_theQwertyGrid_displayData);
				}
			});
		}
		
		function theQwertyGrid_paginationControls() {
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"_before").remove();
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"_after").remove();
			var div = jQuery("<div class= 'theQwerty-paging-controls' id="+_theQwertyGrid_tableProps.tableId+"_before>");
//			var controls = "<div class=\"taglib-page-iterator\">";
//							/*"<div class=\"search-results\">\
//							Showing <span id=\""+_theQwertyGrid_tableProps.tableId+"_rowStart\">"+parseInt(_theQwertyGrid_rowStart+1)+"</span> - \
//							<span id=\""+_theQwertyGrid_tableProps.tableId+"_rowEnd\">"+_theQwertyGrid_rowEnd+"</span>\
//							of <span id=\""+_theQwertyGrid_tableProps.tableId+"_totalRecords\">"
//									+_theQwertyGrid_tableProps.paging.totalRecords+"</span> results.</div>"*/
//			
//			controls += "<div class=\"search-pages\">";
////				<div class=\"delta-selector\">Items per page	<select class=\"theQwertyGrid_controls\" onchange=\"theQwertyGrid_setPageSize(true,this.options[this.selectedIndex].value);\">";
////			for(var i=0; i<_theQwertyGrid_tableProps.pageSize.length; i++) {
////				if(_theQwertyGrid_tableProps.pageSize[i] == _theQwertyGrid_pageSize)
////					controls+=("<option selected=\"selected\">"+_theQwertyGrid_tableProps.pageSize[i]+"</option>");
////				else
////					controls+=("<option>"+_theQwertyGrid_tableProps.pageSize[i]+"</option>");
////			}
////			controls += "</select></div>";

			var totalPages = Math.ceil(_theQwertyGrid_tableProps.paging.totalRecords / _theQwertyGrid_pageSize);
			var currentPage = Math.ceil(parseInt(_theQwertyGrid_rowStart+1) / _theQwertyGrid_pageSize);
//			controls += "<div class=\"page-selector\">	Page ";
//					"<select onchange=\"theQwertyGrid_gotoPage(this);\">";
//			for(var i=1; i<=totalPages; i++) {
//				if(i == currentPage)
//					controls+=("<option selected=\"selected\">"+i+"</option>");
//				else
//					controls+=("<option>"+i+"</option>");
//			}
//			controls += "</select>	of	"+totalPages+"	</div>";
			var controls = "";
			controls +=
					/*"<span style=\"display :none;\" class = \"first "+_theQwertyGrid_tableProps.tableId+"_first_disabled\">	First	</span>" +
					"<a class = \"first "+_theQwertyGrid_tableProps.tableId+"_first\" onclick=\"theQwertyGrid_firstPage()\">	First	</a>	" +*/
					"<span style=\"display :none;\" class = \"qwerty-disabled previous "+_theQwertyGrid_tableProps.tableId+"_prev_disabled\">	&lt; Previous	</span>" +
					"<a href=\"#\" class = \"previous "+_theQwertyGrid_tableProps.tableId+"_prev\" onclick=\"theQwertyGrid_prevPage()\">	&lt; Previous	</a>	" +
					"<span class='pg-num'>"+currentPage+"	of	"+totalPages+"</span>"+
					"<span style=\"display :none;\" class = \"qwerty-disabled next "+_theQwertyGrid_tableProps.tableId+"_next_disabled\">	Next &gt;	</span>" +
					"<a href=\"#\" class = \"next "+_theQwertyGrid_tableProps.tableId+"_next\" onclick=\"theQwertyGrid_nextPage()\">	Next &gt;	</a>" /*+
					"<span style=\"display :none;\" class = \"last "+_theQwertyGrid_tableProps.tableId+"_last_disabled\">	Last	</span>" +
					"<a class = \"last "+_theQwertyGrid_tableProps.tableId+"_last\" onclick=\"theQwertyGrid_lastPage()\">	Last	</a></div>"*/;	
//			controls += "</div></div></div></div>";
			controls+= "</div>";
			
			jQuery(div).html(controls);
			var div2 = jQuery("<div>");
			jQuery(div2).attr("id",_theQwertyGrid_tableProps.tableId+"_after");
			jQuery(div2).attr("class","theQwerty-paging-controls");
			
			jQuery(div2).html(jQuery(div).html());
			jQuery("#"+_theQwertyGrid_tableProps.tableId).before(div);
			jQuery("#"+_theQwertyGrid_tableProps.tableId).after(div2);
		}
		
		function theQwertyGrid_gotoPage(obj) {
			var currentPage = jQuery(obj).val();
			_theQwertyGrid_rowStart = parseInt(currentPage - 1)* _theQwertyGrid_pageSize;
			theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
		}
// ------------------------------------------------------------------------------------------------------
// End of paging functions
// ------------------------------------------------------------------------------------------------------

		
// ------------------------------------------------------------------------------------------------------
// Sorting functions
// ------------------------------------------------------------------------------------------------------

/**
 * controls the integer sorting.
 */
		function theQwertyGrid_sortInt(key) {
			if(_theQwertyGrid_sortInAsc) {
				_theQwertyGrid_sortInAsc = false;
				_theQwertyGrid_displayData.sort(function(a,b) {
					return a[key] - b[key];
				});
			}
			else {
				_theQwertyGrid_sortInAsc = true;
				_theQwertyGrid_displayData.sort(function(b,a) {
					return a[key] - b[key];
				});
			}
			theQwertyGrid_reFillTable(_theQwertyGrid_displayData);
			
		}
/**
 * Controls the String sorting functions
 */
		function theQwertyGrid_sortString(key) {
			if(_theQwertyGrid_sortInAsc) {
				_theQwertyGrid_sortInAsc = false;
				_theQwertyGrid_displayData.sort(function(a,b){
					return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
				});
			}
			else {
				_theQwertyGrid_sortInAsc = true;
				_theQwertyGrid_displayData.sort(function(b,a){
					return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
				});
			}
			theQwertyGrid_reFillTable(_theQwertyGrid_displayData);
		}

// ------------------------------------------------------------------------------------------------------
// End of sorting functions
// ------------------------------------------------------------------------------------------------------

		
		
// ------------------------------------------------------------------------------------------------------
// Utility functions
// ------------------------------------------------------------------------------------------------------

/**
 * remove all rows from table body
 */
		function theQwertyGrid_clearAllRows() {
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"_rows tr").remove();
		}
/**
 * removes all rows and inserts new data passed as argument
 */
		function theQwertyGrid_reFillTable(data) {
			theQwertyGrid_clearAllRows();
			theQwertyGrid_addRows(data, _theQwertyGrid_tableProps);
		}
		
		function theQwertyDummyFunction() {
			return true;
		}

		function theQwertyDummyFunctionArg(arg) {
			return arg;
		}
		
		function theQwertyGrid_showErrorMessage(message) {
			var div = jQuery("<div class = \"grid-error-message\">");
			jQuery(div).html(message);
			jQuery(_theQwertyGrid_tableProps.wrapperId).show();
			jQuery(_theQwertyGrid_tableProps.wrapperId).append(div);
		}
		
		function theQwertyGrid_startLoading() {
			jQuery(_theQwertyGrid_tableProps.wrapperId).show();
			if(_theQwertyGrid_tableProps.loadingImage != "undefined") {
				var html = jQuery("#"+_theQwertyGrid_tableProps.loadingImage).html();
				var center = jQuery("<center>");
				var div = jQuery("<div id=\""+_theQwertyGrid_tableProps.tableId+"-loading\">");
				jQuery(div).html(html);
				jQuery(center).append(div);
				jQuery("#"+_theQwertyGrid_tableProps.tableId+"_before").hide();
				jQuery("#"+_theQwertyGrid_tableProps.tableId+"_after").hide();
				jQuery("#"+_theQwertyGrid_tableProps.tableId).hide();
				
				jQuery(_theQwertyGrid_tableProps.wrapperId).append(center);
			}
		}

		function theQwertyGrid_stopLoading() {
			if(_theQwertyGrid_tableProps.loadingImage != "undefined") {		
				jQuery("#"+_theQwertyGrid_tableProps.tableId+"-loading").remove();
				jQuery("#"+_theQwertyGrid_tableProps.tableId).fadeIn();
				jQuery("#"+_theQwertyGrid_tableProps.tableId+"_before").show();
				jQuery("#"+_theQwertyGrid_tableProps.tableId+"_after").show();
			}
		}
// ------------------------------------------------------------------------------------------------------
// End of utility functions
// ------------------------------------------------------------------------------------------------------
		
//defining the name-space
var theQwerty={};

theQwerty.grid =
	function (_tableProps) {
	//start of function body
	jQuery("#"+_tableProps.tableId).remove();
	theQwertyGrid_init(_tableProps);
};
    
