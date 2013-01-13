var theQwerty = function() {

	var _theQwertyGrid_table = {};
	var _theQwertyGrid_rowStart = 0;
	var _theQwertyGrid_rowEnd = 0;
	var _theQwertyGrid_pageSize = 0;
	var _theQwertyGrid_data = [];
	var _theQwertyGrid_displayData = [];
	var _theQwertyGrid_cols = [];
	var _theQwertyGrid_sortInAsc = true;
	var _theQwertyGrid_PK = [];
	var _theQwertyGrid_tableProps = [];
	
	/**
	 * initialising various table properties
	 */
	function theQwertyGrid_init(_tableProps) {
		_tableProps.data = _tableProps.data || [];
		_tableProps.displayData = _tableProps.displayData || "";
		_tableProps.errorMessage = _tableProps.errorMessage || THE_QWERTY_DEFAULTS.text.errorMessage;
		_tableProps.loadingImage = _tableProps.loadingImage || "undefined";
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
			_tableProps.cols[i].values = typeof(_tableProps.cols[i].values) === "undefined" ? [] :  _tableProps.cols[i].values;
			_tableProps.cols[i].displayValues = typeof(_tableProps.cols[i].displayValues) === "undefined" ? _tableProps.cols[i].values :  _tableProps.cols[i].displayValues;
			_tableProps.cols[i].transformer = typeof(_tableProps.cols[i].transformer) === "undefined" ? theQwertyDummyFunctionArg :  _tableProps.cols[i].transformer;
			_tableProps.cols[i].cssClass = typeof(_tableProps.cols[i].cssClass) === "undefined" ? "" :  _tableProps.cols[i].cssClass;
			_tableProps.cols[i].width = typeof(_tableProps.cols[i].width) === "undefined" ? "auto" :  _tableProps.cols[i].width;
			
		}
		_tableProps.controls = typeof(_tableProps.controls) === "undefined" ? [] : _tableProps.controls;
		for(var i=0; i<_tableProps.controls.length; i++) {
			_tableProps.controls[i].type = typeof(_tableProps.controls[i].type) === "undefined" ? "button" :  _tableProps.controls[i].type;
			_tableProps.controls[i].caption = typeof(_tableProps.controls[i].caption) === "undefined"  ? "" :  _tableProps.controls[i].caption;
			_tableProps.controls[i].cssClass = typeof(_tableProps.controls[i].cssClass) === "undefined"  ? "" :  _tableProps.controls[i].cssClass;
			_tableProps.controls[i].headerCaption = typeof(_tableProps.controls[i].headerCaption) === "undefined"  ? _tableProps.controls[i].caption :  _tableProps.controls[i].headerCaption;
			_tableProps.controls[i].title = typeof(_tableProps.controls[i].title) === "undefined"  ? _tableProps.controls[i].caption :  _tableProps.controls[i].title;
			_tableProps.controls[i].displayPredicate = typeof(_tableProps.controls[i].displayPredicate) === "undefined" ? theQwertyDummyFunction :  _tableProps.controls[i].displayPredicate;
			_tableProps.controls[i].predicateProperty = typeof(_tableProps.controls[i].predicateProperty) === "undefined" ? _tableProps.cols[0].name : _tableProps.controls[i].predicateProperty;
		}
	
		_tableProps.paging = typeof(_tableProps.paging) === "undefined" ? [] : _tableProps.paging;
		_tableProps.paging.enable = typeof(_tableProps.paging.enable) === "undefined" ? false :  _tableProps.paging.enable;
		_tableProps.paging.remote = typeof(_tableProps.paging.remote) === "undefined" ? false :  _tableProps.paging.remote;
		_tableProps.paging.totalRecords = typeof(_tableProps.paging.totalRecords) === "undefined" ? _tableProps.data.length :  _tableProps.paging.totalRecords;
		_tableProps.url = typeof(_tableProps.url) === "undefined" ? "" :  _tableProps.url;
		_tableProps.successCallback = typeof(_tableProps.successCallback) === "undefined" ? theQwertyDummyFunction :  _tableProps.successCallback;
	
		jQuery(_tableProps.wrapperId).hide();
		_theQwertyGrid_tableProps = _tableProps;
		_theQwertyGrid_rowStart = 0;
		_theQwertyGrid_pageSize = _tableProps.pageSize[0];
		_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
		_theQwertyGrid_data = _tableProps.data;
		_theQwertyGrid_displayData = _theQwertyGrid_data;
		_theQwertyGrid_cols = _tableProps.cols;
		_theQwertyGrid_sortInAsc = true;
		
		THE_QWERTY_DEFAULTS.id.pagingPrev = _theQwertyGrid_tableProps.tableId+"-prev-link";
		THE_QWERTY_DEFAULTS.id.pagingNext = _theQwertyGrid_tableProps.tableId+"-next-link";

		THE_QWERTY_DEFAULTS.cssClass.pagingPrevSys = _theQwertyGrid_tableProps.tableId+"-prev";
		THE_QWERTY_DEFAULTS.cssClass.pagingPrevDisabledSys = _theQwertyGrid_tableProps.tableId+"-prev-disabled";
		
		THE_QWERTY_DEFAULTS.cssClass.pagingNextSys = _theQwertyGrid_tableProps.tableId+"-next";
		THE_QWERTY_DEFAULTS.cssClass.pagingNextDisabledSys = _theQwertyGrid_tableProps.tableId+"-next-disabled";
		
		THE_QWERTY_DEFAULTS.cssClass.pagingFirstDisabledSys = _theQwertyGrid_tableProps.tableId+"-first-disabled";
		THE_QWERTY_DEFAULTS.cssClass.pagingLastDisabledSys = _theQwertyGrid_tableProps.tableId+"-last-disabled";
		
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
	function theQwertyGrid_tableHeader (_tableProps) {
		var thead = jQuery("<thead>");
		var theadTr = jQuery("<tr>");
		theadTr.addClass(THE_QWERTY_DEFAULTS.cssClass.theadTr);
		
		for(var i=0; i< _tableProps.headerCols.length; i++) {
			var theadTrTh = jQuery("<th>");
			theadTrTh.addClass(THE_QWERTY_DEFAULTS.cssClass.theadTrTh);
			var thWidth = typeof _tableProps.cols[i] === "undefined" ? "auto" : _tableProps.cols[i].width;
			theadTrTh.attr("width", thWidth);
			if(!typeof(_tableProps.cols[i]) === "undefined" && _tableProps.cols[i].sortable) {
				var sortFunc="";
				if(_tableProps.cols[i].type == "string") {
					sortFunc = "theQwertyGrid_sortString";
				}
				else if(_tableProps.cols[i].type == "int") {
					sortFunc = "theQwertyGrid_sortInt";
				}
				theadTr.append(theadTrTh.append("<a onclick=\""+sortFunc+"(\'"+_tableProps.cols[i].name+"\')\">"+_tableProps.headerCols[i]+"</a>"));
			}
			else if(typeof(_tableProps.cols[i]) != "undefined" && !_tableProps.cols[i].hide) {
				theadTr.append(theadTrTh.append(_tableProps.headerCols[i]));
			}
			else if(typeof(_tableProps.cols[i]) === "undefined") {
				theadTr.append(theadTrTh.append(_tableProps.headerCols[i]));
			}
		}
		thead.append(theadTr);
		return thead;
	}
	/**
	 * creates table's footer
	 */
	function fetchData(_tableProps) {
		if(_tableProps.paging.enable) {
			theQwertyGrid_setPageSize(false,_tableProps.pageSize[0]);
		}
	}
	/**
	 * creates actual table DOM
	 */
	function theQwertyGrid_createTable(_tableProps) {
		var tbody = jQuery("<tbody>");
		tbody.attr("id",_tableProps.tableId+"_rows");
		
		
		
		_theQwertyGrid_table = jQuery("<table>");
		_theQwertyGrid_table.addClass(THE_QWERTY_DEFAULTS.cssClass.table);
		_theQwertyGrid_table.attr("id",_tableProps.tableId);
		_theQwertyGrid_table.attr("style", "display: none;");
		
		var thead = theQwertyGrid_tableHeader(_tableProps);
		fetchData(_tableProps);

		_theQwertyGrid_table.append(thead);
		_theQwertyGrid_table.append(tbody);
		jQuery(_tableProps.wrapperId).append(_theQwertyGrid_table);
		theQwertyGrid_addRows(_theQwertyGrid_displayData, _tableProps);
	}
	
	/**
	 * add rows to table body
	 */
	function theQwertyGrid_addRows (data, tableProps) {
		var tbody = jQuery("#"+tableProps.tableId+"_rows");
		for (var i = 0; i < data.length; i++) {
			PKVals = getPKParams(data[i]);
	    	var tr = jQuery("<tr>").attr("id",tableProps.tableId+"_row"+i);
	    	var td = jQuery("<td>");
	    	if(i % 2 == 0)
	    		tr.attr("class", THE_QWERTY_DEFAULTS.cssClass.tbodyTrOdd);
	    	else
	    		tr.attr("class", THE_QWERTY_DEFAULTS.cssClass.tbodyTrEven);
	    		
			for(var j=0; j< _theQwertyGrid_cols.length; j++) {
				if(!_theQwertyGrid_cols[j].hide) {
					var tdx = getTDValue(_theQwertyGrid_cols[j], data[i], i);
					tr.append(tdx);
				}
	    	}
			
			for(var j=0; j< tableProps.controls.length; j++) {
				getControlsData(td, tableProps.controls[j], data[i]);
	    	}
			if(tableProps.controls.length) {
				tr.append(td);
			}
			tbody.append(tr);
		}
		if(data.length > 0) {
			tableProps.successCallback();
		}
	}
	
	// ------------------------------------------------------------------------------------------------------
	// End of Creation of table DOM functions
	// ------------------------------------------------------------------------------------------------------
	
	function getPKParams(data) {
		var PKVals = "";
		for(var j=0; j< _theQwertyGrid_PK.length; j++) {
			PKVals += ", '"+data[_theQwertyGrid_cols[_theQwertyGrid_PK[j]].name]+"'";
    	}
		// Removing the extra ', ' in the beginning of the PK value
		PKVals = PKVals.substring(2);
		return PKVals;
	}
	
	function getTDValue(col, data, i) {
		
		var td = jQuery("<td>");
		if(col.displayAs == "normal") {
			td.html(col.transformer(data[col.name]));
		}
		
		else if(col.displayAs == "select") {
			td = getSelectTD(col, data, i);
		}

		else if(col.displayAs == "template") {
			td = getTemplateTD(col, data);
		}
		return td;
	}
	
	function getSelectTD(col, data, i) {
		var td = jQuery("<td>");
		var PKVals = getPKParams(data);
		var selectId = _theQwertyGrid_tableProps.tableId+"-"+col.name+"-select-"+i;
		var val = data[col.name];
		var onchange = "";
		if(typeof col.func !== "undefined") {
			onchange = " onchange=\""+col.func+"(this,"+PKVals+")\"";
		}
		var selectHtml = "<select id=\""+selectId+"\" class=\""+THE_QWERTY_DEFAULTS.cssClass.controls+" "+col.cssClass + "\""+onchange+">";
		var optionHtml = "";
		for(var  k=0; k<col.values.length; k++) {
			if(col.values[k] == val) {
				optionHtml += "<option selected =\"selected\" value=\""+col.values[k]+"\">"+col.displayValues[k]+"</option>";
			} else {
				optionHtml += "<option value=\""+col.values[k]+"\">"+col.displayValues[k]+"</option>";
			}
		}
		selectHtml += optionHtml + "</select>";
		
		td.html(selectHtml);
		return td;
	}
	
	function getTemplateTD(col, data) {
		var td = jQuery("<td>");
		fillTemplate(col.templateId, td, data);
		return td;
	}
	
	function getControlsData(td, control, data) {
		var predicates = "";
		for(var k=0;k<control.predicateProperty.length;k++) {
			predicates+= ", "+data[control.predicateProperty[k]];
		}
		predicates = predicates.substring(2);
		
		var func = "";
		if(typeof control.func !== "undefined") {
			func = " onclick=\""+control.func+"(this,"+PKVals+")\"";
		}
		
		if(control.displayPredicate(predicates)) {
			if(control.type == "button") {
				td.append("<input title=\""+control.title+"\" class=\""+THE_QWERTY_DEFAULTS.cssClass.controls+" "+control.cssClass+"\" type=\""+control.type+"\" value=\""+control.caption+"\""+func+"/>");
			}
		}
	}
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
			theQwertyGrid_loadPaginationData(_theQwertyGrid_rowStart, _theQwertyGrid_rowEnd);
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
	}
	
	/**
	 * shows the previous page of grid
	 */		
	function theQwertyGrid_prevPage () {
		_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart;
		_theQwertyGrid_rowStart = _theQwertyGrid_rowEnd - _theQwertyGrid_pageSize < 0 ?
								  0 : _theQwertyGrid_rowEnd - _theQwertyGrid_pageSize;
		theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
	}
	
	/**
	 * shows the previous page of grid
	 */		
	function theQwertyGrid_nextPage () {
		_theQwertyGrid_rowStart = _theQwertyGrid_rowEnd;
		_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize > _theQwertyGrid_tableProps.paging.totalRecords ?
								_theQwertyGrid_tableProps.paging.totalRecords : _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
		theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
	}
	
	function theQwertyGrid_firstPage () {
		theQwertyGrid_setPageSize(true, _theQwertyGrid_pageSize);
	}
	
	function theQwertyGrid_lastPage () {
		var totalPages = Math.ceil(_theQwertyGrid_tableProps.paging.totalRecords / _theQwertyGrid_pageSize);
		_theQwertyGrid_rowStart = parseInt(totalPages - 1)* _theQwertyGrid_pageSize;
		_theQwertyGrid_rowEnd = _theQwertyGrid_rowStart + _theQwertyGrid_pageSize > _theQwertyGrid_tableProps.paging.totalRecords ?
				_theQwertyGrid_tableProps.paging.totalRecords : _theQwertyGrid_rowStart + _theQwertyGrid_pageSize;
		theQwertyGrid_setPageSize(false, _theQwertyGrid_pageSize);
	}
	/**
	 * disables or enables the prev and next buttons.
	 */
	function theQwertyGrid_prevNextDisable() {
		if(_theQwertyGrid_rowStart <= 0) {
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingFirst).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingFirstDisabledSys).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingPrevSys).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingPrevDisabledSys).show();
		}
		if(_theQwertyGrid_rowEnd < _theQwertyGrid_tableProps.paging.totalRecords) {
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingNextSys).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingNextDisabledSys).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingLast).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingLastDisabledSys).hide();
		}
		if(_theQwertyGrid_rowStart > 0) {
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingFirst).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingFirstDisabledSys).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingPrevSys).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingPrevDisabledSys).hide();
		}
		if(_theQwertyGrid_rowEnd >= _theQwertyGrid_tableProps.paging.totalRecords) {
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingNextSys).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingNextDisabledSys).show();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingLast).hide();
			jQuery("."+THE_QWERTY_DEFAULTS.cssClass.pagingLastDisabledSys).show();
		}
	}
	/**
	 * loads remote data.
	 * @param pageStart
	 * @param pageEnd
	 */	
	function theQwertyGrid_loadPaginationData(pageStart, pageEnd) {
		theQwertyGrid_startLoading();
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
			url : _theQwertyGrid_tableProps.url,
			dataType : 'json',
			data:{pageNumber: pageNumber, pageSize: pageSize},
			success : function(data) {
				var displayData = _theQwertyGrid_tableProps.displayData == "" ? data : data[_theQwertyGrid_tableProps.displayData];
				theQwertyGrid_stopLoading();
				theQwertyGrid_paginationControls();
				_theQwertyGrid_displayData = displayData;
				_theQwertyGrid_tableProps.data = displayData;
				theQwertyGrid_prevNextDisable();
				theQwertyGrid_reFillTable(_theQwertyGrid_displayData);
			}
		});
	}
	
	function getTotalPages() {
		return Math.ceil(_theQwertyGrid_tableProps.paging.totalRecords / _theQwertyGrid_pageSize);
	}
	
	function getCurrentPage() {
		return Math.ceil(parseInt(_theQwertyGrid_rowStart+1) / _theQwertyGrid_pageSize);
	}
	function theQwertyGrid_paginationControls() {
		jQuery("#"+_theQwertyGrid_tableProps.tableId+"_before").remove();
		jQuery("#"+_theQwertyGrid_tableProps.tableId+"_after").remove();
		var div = jQuery("<div class= '"+THE_QWERTY_DEFAULTS.cssClass.pagingControls+"' id="+_theQwertyGrid_tableProps.tableId+"_before>");
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
	
		var totalPages = getTotalPages();
		var currentPage = getCurrentPage();
		
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
				buildElement("span", "", "display: none;", THE_QWERTY_DEFAULTS.cssClass.pagingPrev+" "+THE_QWERTY_DEFAULTS.cssClass.pagingDisabled+" "+THE_QWERTY_DEFAULTS.cssClass.pagingPrevDisabledSys, THE_QWERTY_DEFAULTS.text.previous) +
				buildElement("a", THE_QWERTY_DEFAULTS.id.pagingPrev,"",THE_QWERTY_DEFAULTS.cssClass.pagingPrev+" "+THE_QWERTY_DEFAULTS.cssClass.pagingPrevSys, THE_QWERTY_DEFAULTS.text.previous) +
//				"<a href=\"#\" class = \"previous "+_theQwertyGrid_tableProps.tableId+"_prev\" onclick=\"theQwertyGrid_prevPage()\">	&lt; Previous	</a>	" +
				
				"<span class=\""+THE_QWERTY_DEFAULTS.cssClass.pagingPageNumber+"\">"+currentPage+"	of	"+totalPages+"</span>"+
				buildElement("span", "", "display: none;", THE_QWERTY_DEFAULTS.cssClass.pagingNext+" "+THE_QWERTY_DEFAULTS.cssClass.pagingDisabled+" "+THE_QWERTY_DEFAULTS.cssClass.pagingNextDisabledSys, THE_QWERTY_DEFAULTS.text.next) +
				buildElement("a", THE_QWERTY_DEFAULTS.id.pagingNext,"",THE_QWERTY_DEFAULTS.cssClass.pagingNext+" "+THE_QWERTY_DEFAULTS.cssClass.pagingNextSys, THE_QWERTY_DEFAULTS.text.next);
//				"<span style=\"display :none;\" class = \"qwerty-disabled next "+_theQwertyGrid_tableProps.tableId+"_next_disabled\">	Next &gt;	</span>" +
//				"<a href=\"#\" class = \"next "+_theQwertyGrid_tableProps.tableId+"_next\" onclick=\"theQwertyGrid_nextPage()\">	Next &gt;	</a>" /*+
//				"<span style=\"display :none;\" class = \"last "+_theQwertyGrid_tableProps.tableId+"_last_disabled\">	Last	</span>" +
//				"<a class = \"last "+_theQwertyGrid_tableProps.tableId+"_last\" onclick=\"theQwertyGrid_lastPage()\">	Last	</a></div>"*/;	
	//			controls += "</div></div></div></div>";
		controls+= "</div>";
		
		jQuery(div).html(controls);
		var div2 = jQuery("<div>");
		jQuery(div2).attr("id",_theQwertyGrid_tableProps.tableId+"_after");
		jQuery(div2).attr("class","theQwerty-paging-controls");
		
		jQuery(div2).html(jQuery(div).html());
		jQuery("#"+_theQwertyGrid_tableProps.tableId).before(div);
		jQuery("#"+_theQwertyGrid_tableProps.tableId).after(div2);
		bindAllEvents();
	}
	
	function buildElement(element, id, style, css, innerhtml) {
		return "<"+element+" id='"+id+"' style='" +style+"' class='"+css+"'> "+innerhtml+"</"+element+">";
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
		var div = jQuery("<div class = \""+THE_QWERTY_DEFAULTS.cssClass.errorMessage+"\">");
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
		jQuery("#"+_theQwertyGrid_tableProps.tableId).fadeIn();
		if(_theQwertyGrid_tableProps.loadingImage != "undefined") {		
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"-loading").remove();
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"_before").show();
			jQuery("#"+_theQwertyGrid_tableProps.tableId+"_after").show();
		}
	}
	
	function bind(element, event, func) {
		jQuery("."+element).bind(event, func);
	}
	
	function bindAllEvents() {
		bind(THE_QWERTY_DEFAULTS.cssClass.pagingPrevSys, 'click', theQwertyGrid_prevPage);
		bind(THE_QWERTY_DEFAULTS.cssClass.pagingNextSys, 'click', theQwertyGrid_nextPage);
	}
	
	function fillTemplate(templateId, element, data) {
		var template = jQuery("#"+templateId);
		var html = template.tmpl(data);
		element.html(html);
	}
	
	// ------------------------------------------------------------------------------------------------------
	// End of utility functions
	// ------------------------------------------------------------------------------------------------------
	
	this.grid =	function (_tableProps) {
		jQuery("#"+_tableProps.tableId).remove();
		theQwertyGrid_init(_tableProps);
	};
	
	this.getCurrentRows = function() {
		return _theQwertyGrid_displayData;
	};
};

var THE_QWERTY_DEFAULTS = {
	id: {
	},
	cssClass: {
		table : "p90x-display-grid",
		thead : "",
		theadTr : "portlet-section-header results-header",
		theadTrTh : "tableHeading",
		tbody: "",
		tbodyTr: "",
		tbodyTrOdd: "odd",
		tbodyTrEven: "even",
		tbodyTrTd: "",
		controls: "theQwertyGrid-controls",
		pagingControls: "theQwerty-paging-controls",
		pagingFirst: "first",
		pagingPrev: "previous",
		pagingNext: "next",
		pagingLast: "last",
		pagingDisabled: "theQwerty-disabled",
		pagingPageNumber: "pg-num",
		errorMessage: "grid-error-message"
	},
	text: {
		previous: " &lt; Previous ",
		next: " Next &gt; ",
		errorMessage: "No data to display"
	}
};
