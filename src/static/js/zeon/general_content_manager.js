var DATA_LIST_REQUEST = null;
var NOTIFICATION_STATUS = {
	SUCCESS: 0,
    IN_PROCESS: 1,
    FAIL: 2,
	INFO: 3
}
var ACTION_NOTIFICATION_TIMEOUT = null;

$(document).ready(function(){	
	"use strict"
	
	//$('body').tooltip({selector:'[data-toggle=tooltip]'})
						
	$(document).on('click', function (e) {
		$('.zeon-contextmenu').hide(); // Hide context menus irrespective of anything.
		if ($(e.target).closest('.dropdown').length == 0) {
			$('.dropdown-content').hide();
		}
		/*
		//$('.dropdown-content').hide();
		$("tr").removeClass("zeon-hovered");
		*/
	});
	
	$('.modal').on('shown.bs.modal', function (e) {
		$(this).find('input.form-control:first').focus();
	});
	
	$(document).on('click', '.open-modal', function(e) {
		var $triggered_elem = $(this);
		var modal_id = $triggered_elem.data('target');
		$(modal_id).on('show.bs.modal', function(event) {
			var head = $triggered_elem.data('head') // Extract info from data-* attributes
			// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
			// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
			var modal = $(this);
			modal.find('.modal-title').text(head);
		}).modal({backdrop:'static',keyboard:false});
	});
	
	/*
	$(document).click(function(){
		$('.dropdown-content').toggle(false);
	});
	*/
	
	$(document).on('focus', '.zeon_error', function(e){
		$(this).parent().find('.zeon_field_error_msg').toggle();
		// $(this).removeClass('zeon_error');
	});
	
	$(document).on('blur', '.zeon_error', function(e){
		$(this).parent().find('.zeon_field_error_msg').toggle();
	});
	
	$.ajaxSetup({
		headers: { "X-CSRFToken": getCookie("csrftoken") }
	});
	
	/*
	$(document).on('change', 'select', function(e) {
		e.stopPropagation();
		save_to_local_storage($(this));
	});
	*/
	
	
	$('form input').on("keydown", function(e) 
	{
		var inputs = $(this).parents("form").eq(0).find(":input");
		var idx = inputs.index(this);
		switch(e.which)
		{	
			case 13, 39, 40: /* Enter, key down, or key right */
				e.preventDefault();
				if (idx == inputs.length - 1) 
					inputs[0].select()
				else 
				{
					inputs[idx + 1].focus(); //  handles submit buttons
					inputs[idx + 1].select();
				}
				break;
			case 38: /* key up */
				e.preventDefault();
				if (idx == 0) 
					inputs[inputs.length - 1].select()
				else 
				{
					inputs[idx - 1].focus(); //  handles submit buttons
					inputs[idx - 1].select();
				}
				break;
			default: return; // exit this handler for other keys
		}
		return;
	});
	
	$('.zeon-datepicker input').val(get_today('-'));	

	// $('[data-toggle="tooltip"]').tooltip(); //enables tooltips
	$.ajaxSetup({
		// Function for fixing ajax FORBIDDEN mistake stemming from csrftoken firewall in Django
		// Used in conjunction with getCookie() defined in this file
		headers: { "X-CSRFToken": getCookie("csrftoken") }
	});
	

	
	/* ----------------------------------------------------    PARSLEY                      ---------------------------------------------------------------------------------------- */
	// Previous button is easy, just go back
	$('.form-navigation .previous').click(function() 
	{
		navigateTo(curIndex() - 1, $(this).closest('form'));
	});

	// Next button goes forward iff current block validates
	$('.form-navigation .next').click(function() 
	{
		if ($(this).closest('form').parsley().validate({group: 'block-' + curIndex()}))
			navigateTo(curIndex() + 1, $(this).closest('form')); 	
	});

	// Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
	$('.modal.fade').each(function(i, modal_form)
	{
		$(modal_form).find('.form-section').each(function(index, section) 
		{
			$(section).find(':input').attr('data-parsley-group', 'block-' + index);
		});
	});
	
	$('form').each(function() 
	{
		navigateTo(0, $(this)); // Start at the beginning
	});
	
	/* ----------------------------------------------------    PARSLEY                      ---------------------------------------------------------------------------------------- */
	
		
	
	/* ----------------------------------------------------    FOR BOOTSTRAP TAB MENU. STAYING ON THE ACTIVE TAB WHEN REFRESHING PAGE  --------------------------------------------- */
});

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

var save_to_local_storage = function(obj)
{
	if (typeof(Storage) !== "undefined") {
		var val = obj.val();
		if (typeof val === 'object' && val !== undefined) {
			val = JSON.stringify(val);
		}			
		localStorage.setItem(obj.attr('id'), val);
	}
}

$.fn.is_empty = function()
{
	var result = true;
	this.find('input:not([type=checkbox],[type=button],[type=submit])').each(function() 
	{
	  if ($(this).val() != '')
	  {
		result = false;
	  }
	});
	return result;
}

var append_to_the_beginning = function($table, $new_row)
{
	if (get_row_count($table) == 0)
		$table.find('tbody').append($new_row);
	else
		$table.find('tbody > tr:first').before($new_row);	
}
$.fn.zeon_val = function()
{
	var result;
	if ( this.is( "input[type='number']" ) )
	{		
		result = this.val()
		if (result == '')
			result = '0'
		result = result.toDouble();
		
	}
	else if  ( this.is( "input[type='text']" ) ) 
	{
		result = this.val();
	}
	else if  ( this.is( "input[type='checkbox']" ) ) 
	{
		if (this.is(':checked'))
			result = 1;
		else
			result = 0;
	}
	else if  ( this.is( "select" ) ) 
	{
		if (this.val() == null)
			result = []
		else
			result = this.val();
	}
	else if ( this.is( "td" ) ) 
	{
		var $input = this.find('input');
		if ($input.length !== 0)
			return $input.val();
		else
			return this.find('span').html();
	}
	else
	{
		result = this.html().toDouble();
	}
	
	return result;
}

function navigateTo(index, $form) {
	$form.find('.form-section').hide();
		
	// Mark the current section with the class 'current'
	$form.find('.form-section')
		.removeClass('current')
		.eq(index)
		.addClass('current');
		
	// Show only the navigation buttons that make sense for the current section:
	$form.find('.current').show();
	$form.find('.form-navigation .previous').toggle(index > 0);
	var atTheEnd = (index >= $form.find('.form-section').length - 1);
	$form.find('.form-navigation > .next').toggle(!atTheEnd);
	$form.find('.form-navigation').find(':input[type = submit]').not('.monopoly_input').toggle(atTheEnd);
}

function curIndex() {
	// Return the current index by looking at which section has the class 'current'
	return $('.form-section').index($('.form-section').filter('.current'));
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}

String.prototype.zeon_float_formatter = function(){
	var result = this;
	result = result.replace(new RegExp("^(\\d{" + (result.length%3?result.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim(); 
	result = result.replace(/\s/g, NUMBER_THOUSANDS_SEPARATOR);
	return result; 
}

function filter_table_by_checkbox(checked, yardstick_value, yardstick_attr, table_rows){ 
	if (checked)
		table_rows.filter(function (i, v) 
		{
			return ($(this).attr(yardstick_attr) == yardstick_value) 
		}).show();
	
	else
		table_rows.filter(function (i, v) 
		{
			return ($(this).attr(yardstick_attr) == yardstick_value) 
		}).hide();
}

Date.prototype.getQuarter = function(d){
	d = d || new Date();
	var m = Math.floor(d.getMonth()/3) + 2;
	return m > 4? m - 4 : m;
}

var get_column_count = function(table_id){
	return $(table_id).find('thead')[0].firstElementChild.childElementCount;
}

var get_row_count = function($table){
	return $table.find('tbody')[0].childElementCount;
}

var create_new_empty_row = function($table){
	number_of_columns = get_column_count($table);
	return $('<tr>' + Array(number_of_columns + 1).join('<td></td>') + '</tr>');
}

var get_today = function(delimiter){
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();

	return d.getFullYear() + delimiter + (month<10 ? '0' : '') + month + delimiter + (day<10 ? '0' : '') + day;
	
}

function diff_days(date_start, date_end){
	var one_day = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	if (!(date_start instanceof Date))
	{
		date_start = new Date(date_start);
	}
	if (!(date_end instanceof Date))
	{
		date_end = new Date(date_end);
	}
	return Math.round(Math.abs((date_end.getTime() - date_start.getTime())/(one_day)));
}

function get_current_month(){
	var d = new Date();
	return d.getMonth();
}

function get_current_year(){
	var d = new Date();
	return d.getFullYear();
}

var increment_date = function(initial_date_str, day_increment){
	// Assuming YYYY-MM-DD format
	var initial_date_split = initial_date_str.split("-");
	var date = new Date(initial_date_split[0], initial_date_split[1] - 1, initial_date_split[2]);
	date.setDate(date.getDate() + day_increment);
	var month = date.getMonth()+1;
	var day = date.getDate();
	return date.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
}

var intToStr = function (number, precision) {
    
	precision = typeof precision !== 'undefined' ? precision : NUMBER_DEFAULT_PRECISION;
	str = number.toFixed(precision);
	
	str += '';
	
	x = str.split('.');
		
	x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
	if (NUMBER_COUNTRY_FORMAT = 'RUS')
		while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
	else
		while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return (x1 + x2);
}

var get_server_file =  function(file_name){
	$.ajax(
	{
		type: "GET",
		url: '/send_file_to_frontend/',
		data: {'file_name':file_name},
		success: function(data)
		{ 			
			return data; 
		},
		error: function()
		{
			alert('Could not upload ');
		}
	});
}

function getCookie(c_name){
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function ajax_call_json (url, json_obj){
	
	var ticked_rows_json = 'json_data=' + JSON.stringify(json_obj);
	$.post(url, ticked_rows_json);
}

var DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31]
var MONTH_NAMES_RUS = ['январь','‘евраль','ћарт','јпрель','ћай','»юнь','»юль','јвгуст','—ент¤брь','ќкт¤брь','Ќо¤брь','ƒекабрь'];

// Returns the number of days in the month in a given year (January=0)
function days_in_month(month,year){
    if ((month==1)&&(year%4==0)&&((year%100!=0)||(year%400==0)))
	{
		return 29;
    }
	else
	{
		return DAYS_IN_MONTH[month];
    }
}

function set_active_date(td_obj){
	selected_day = td_obj.attr('data-day');
	td_obj.closest('table.calendarMonth').attr('data-day', selected_day);
}

function get_selected_date (monthCalendar){
	//$.format.date(new Date(), 'yy-MM-dd');
	var day = monthCalendar.attr('data-day');
	var month = monthCalendar.attr('data-month');
	var year = monthCalendar.attr('data-year');
	return (new Date(year, month, day));
}

function setDisplayedMonth(table_container_id, month, current_year){
	"use strict"
	
	table_container = $('#' + table_container_id);
	if (month<0)
	{
		for (var i=0;i<12;i++)
		{
			document.getElementById('calendarMonth'+i).style.display='none';
		}
		
		build_calendar(table_container, 11, current_year- 1);
		table_container.find('table.calendarMonth').attr('data-month', 11);
		table_container.find('table.calendarMonth').attr('data-year', current_year - 1);
    }
	else if (month > 11)
	{
		for (var i=0;i<12;i++)
		{
			document.getElementById('calendarMonth'+i).style.display='none';
		}
		
		build_calendar(table_container, 0, current_year + 1);
		
		table_container.find('table.calendarMonth').attr('data-month', 0);
		table_container.find('table.calendarMonth').attr('data-year', current_year + 1);
	}
	else
	{
		for (var i=0;i<12;i++)
		{
			if (i !== month)
				document.getElementById('calendarMonth'+i).style.display='none';
		}
		document.getElementById('calendarMonth'+ month).style.display='inline';
		table_container.find('table.calendarMonth').attr('data-month', month);
		table_container.find('table.calendarMonth').attr('data-year', current_year);
    }
}

function previous (obj, target_obj_type, class_name){
	  if (obj.closest(target_obj_type).hasClass(class_name))
    {
    	   return obj.closest(target_obj_type);
    }
    else
    {
        return obj.closest(target_obj_type).prevAll('.' + class_name);
    } 
}

function zeon_selectize_callback(url, data, callback){
	$.ajax({
		url: url,
		type: 'GET',
		data: data,
		error: function() { callback(); },
		success: function(res) {
			callback(JSON.parse(res.content));
		}
	});
}

// Checks whether element is currently seeable by user
$.fn.isOnScreen = function(x, y){
    // http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
    if(x == null || typeof x == 'undefined') x = 1;
    if(y == null || typeof y == 'undefined') y = 1;
    
    var win = $(window);
    
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var height = this.outerHeight();
    var width = this.outerWidth();
 
    if(!width || !height){
        return false;
    }
    
    var bounds = this.offset();
    bounds.right = bounds.left + width;
    bounds.bottom = bounds.top + height;
    
    var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
    if(!visible){
        return false;   
    }
    
    var deltas = {
        top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
        bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
        left : Math.min(1, ( bounds.right - viewport.left ) / width),
        right : Math.min(1, ( viewport.right - bounds.left ) / width)
    };
    
    return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;
    
}

// http://james.padolsey.com/javascript/regex-selector-for-jquery/
// http://stackoverflow.com/questions/190253/jquery-selector-regular-expressions
// Enables easy interface for regex search
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

var is_empty_content = function(response){
	if (response.indexOf('empty_table_indicator') > 0)
		return true;
	return false;
}

function remove_selected_rows($table){
	$table.find('tbody tr').each(function (i, row) 
	{
		var $row = $(row);
		if ($row.find('input.tableRowChecker').is(':checked')) 
		{
			$row.remove();
		}		
	});
}

function turn_on_thinking_mode($table){
	$table.find('tbody').html('');
	$table.closest('form').find('.empty_table_indicator').css('display', 'none');
	$table.closest('form').find('div.ajax_loader').css('display', 'block');
}

var manage_empty_content_message = function(response, $target_form){
	$('.ajax_loader').css('display', 'none');
	if (is_empty_content(response))
		$target_form.find('.empty_content_indicator').css('display', 'block');
}

function refresh_zeon_data_table(response, $table){
	$table.find('tbody').html(response);
	manage_empty_content_message(response,$table.closest('form'));
}

function hide_empty_content_message(){
	$('.empty_table_indicator').hide();
}
/* ------------------------------------------------    Number formatting   ----------------------------------- */

String.prototype.toDouble = function(precision){
	if (precision == undefined)
		return parseFloat(this.replace(",", "."));
	return parseFloat(this.replace(",", "."));
}

String.prototype.string_between = function(substring1, substring2){
	var start_pos = this.indexOf(substring1) + substring1.length;
	var end_pos = this.indexOf(substring2,start_pos);
	return this.substring(start_pos,end_pos);
}

function get_formset_id (input_element){
	django_generated_id = input_element.attr('id');
	return django_generated_id.string_between('id_form-', '-');
}

function isnull(variable, val_if_undefined){
	if (variable == undefined || variable == 'null')
		return val_if_undefined;
	else
		return variable;
}

var populateSelectize = function(selectize_analogue, url_selected_values_list){
    selectize_analogue.clearOptions();
	 
	if (typeof(url_selected_values_list) !=='undefined')
	{
		$.get(url_selected_values_list, function(response) 
		{
			content = JSON.parse(response.content);
			for (var i = 0; i < content.length; i++)
			{
				selectize_analogue.addOption({
					text: content[i].text,
					value: content[i].value
				});
				// selectize_analogue.addItem(content[i].value);
			}
		});
	}
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
}

function focusAndPlaceCaretAtEnd(el) {
    /*
	var range = document.createRange();
    var sel = window.getSelection();
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
	*/
	
	if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
	el.focus();
}

var localCache = {}

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    // if (options.cache) {
	var success = originalOptions.success || $.noop,
		url = originalOptions.url,
		type = originalOptions.type;
	//remove jQuery cache as we have our own localCache
	options.cache = false;
	options.beforeSend = function () {
		
		if (type.toLowerCase() == 'get') {
			if (localCache[url]) {
				console.log('Asking cache for ' + url);
				success(localCache[url]);
				return false;
			}
			else {
				console.log('Asking server for ' + url);
			}
		}
	
		return true;
	};
	
    // }
});

function adjusted_request(request_type, url, params, callback) {
	
	if (params.button){
		if (params.button.hasClass('_has-spinner'))
		{
			params.button.button('loading');
		}
	}
	
	if (params.container) {
		if (params.show_loader) {
			params.container.html('');
			params.container.append('<img class="center-center _ajax-loader" src="/static/img/ajax-loader.gif" alt="Ajax loader" />');
		}
	}
	
	$.ajax({
		type: request_type,
		url: url,
		data: params.data,	
		success: function(response) {
			if (params.container && params.show_loader) {
				params.container.find('._ajax-loader').remove();
			}
			if (response.success === true){
				
				hide_notification();
				if (request_type.toLowerCase() == 'get') {
					localCache[url] = response;
				}
				else {
					params.clearCache = params.hasOwnProperty('clearCache') ? params[clearCache] : true;
					if (params.clearCache) {
						localCache = [];
					}
				}
				
				if (callback){
					if(typeof callback === 'function') {
						callback(response.object);
					}
				}
				if (params.form){
					params.form.find('.zeon_field_error_msg').css('display', 'none');
					params.form.find('.zeon_non_field_error_wrap').css('display', 'none');
					if (params.button ){
						params.button.button('reset');
					}		
				}
				
			}
			else{
				if (params.button){	
					if (params.button.hasClass('_has-spinner')){
						params.button.button('reset');
					}
				}	
				render_server_errors(response, params.form);
			}
		},
		error: function(xhr, textStatus, error){
			if (params.container && params.show_loader) {
				params.container.find('._ajax-loader').remove();
			}
			
			if (params.button){
				if (params.button.hasClass('_has-spinner')){
					params.button.button('reset');
				}
			}
			var error_msg = null;
			if (xhr.readyState == 4) {
				// server error
				error_msg = "HTTP error. " + xhr.statusText;
			}
			else if (xhr.readyState == 0) {
				// Network error (i.e. connection refused, access denied due to CORS, etc.)
				error_msg = gettext ("Check your Internet connection");
			}
			else {
				error_msg = gettext("Error message from the server");
			}

			render_server_errors({'error_str': error_msg}, params.form);
		}
	});
}

function post_adjusted(url){
	// https://www.markhansen.co.nz/javascript-optional-parameters/
	
	var params;
	var callback;
	if (typeof arguments[1] == "object") {
		params = arguments[1];
		callback = arguments[2];
	} 
	else {
		params = {};
		callback = arguments[1];
	}	
	
	var data = params.data || {}
	
	adjusted_request('POST', url, params, callback);
}

function get_adjusted(url){
	// https://www.markhansen.co.nz/javascript-optional-parameters/
	
	var params;
	var callback;
	if (typeof arguments[1] == "object") {
		params = arguments[1];
		callback = arguments[2];
	} 
	else {
		params = {};
		callback = arguments[1];
	}	
	
	var data = params.data || {}
	
	adjusted_request('GET', url, params, callback);
}

function localCacheSmartClear() {
	localCache = [];
}

function extractContentFromHTML(s) {
  var span= document.createElement('span');
  span.innerHTML= s;
  return span.textContent || span.innerText;
};

function highlight_search(text, $element) {

	var query = text // + '(?=[^>]*</)';
	var regexp = new RegExp(query, "gim");
	var e = $element.html();
	var enew = e.replace(/(<span class = "highlight">|<\/span>)/igm, "");
	$element.html(enew);
	var newe = enew.replace(regexp, '<span class = "highlight">\$&</span>');
	$element.html(newe);
	
};

function show_notification(msg, status, link, callback) {
	var html = '';
	if (status == NOTIFICATION_STATUS.SUCCESS) {
		html = ':) ' + msg;
	}
	else if (status == NOTIFICATION_STATUS.FAIL){
		html = 'ERROR: ' + msg;
	}
	else {
		html = msg;
	}
	
	if (link) {
		html += ' <a class="notification__link font-bold" href="#">' + link + '</a>'
	}
	
	if (link) {
		$('#notification a').on('click', callback);
	}
	
	$('#notification').html(html).fadeIn(0);
	
	if (status == NOTIFICATION_STATUS.SUCCESS || status == NOTIFICATION_STATUS.FAIL) {		
		clearTimeout(ACTION_NOTIFICATION_TIMEOUT);
		ACTION_NOTIFICATION_TIMEOUT = setTimeout(function() {
			$('#notification').fadeOut(1500);
		}, 5000); // <-- time in milliseconds
	}
}

function hide_notification(){
	$('#notification').addClass('dn');
}

function scrollToElem($elem, $container){
    $container.stop().animate({
		scrollTop: $elem.position().top 
	}, 0);
}

function customized_date(date){
	var now = new Date();
	var result;
	if (moment(date).years === now.getFullYear()){
		result = moment(date).format('DD MMM');
	}
	else {
		result = moment(date).format('DD MMM YYYY');
	}
	return result;
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function keycode_is_letter_or_symbol(keycode){
	if ((keycode == 8) ||
	    (keycode >= 48 && keycode <= 90) ||
	    (keycode >= 96 && keycode <= 111) ||
	    (keycode === 186) ||
	    (keycode >= 188 && keycode <= 192) ||
	    (keycode >= 219 && keycode <= 222))
		return true;
	else 
		return false;

}

function clear_standard_fields($form){
	$form.find('input[type = text], input[type = number], textarea').val('');
}
	
function invalid_input_alert(msg){
	alert(gettext(msg));
}

function standard_listeners(wrapper) {
	wrapper.on('click', '.remove-value', function(e){
		$(this).closest('.form-box').find('input, textarea').val('');
	});
}

function formset_listeners($wrapper) {
	/*
	$('.formset-add-item input').on('keydown change', function(e) {
		var $item = $(this).closest('.formset-item');
				
		if ($(this).is(':last-child')){
			if (keycode_is_letter_or_symbol(e.which)){
				add_formset($item, $item.data('prefix'));
				$item.find('.formset-mark-deleted').css('display', 'inline-block');
			}
		}
		else if ($(this).is(':nth-last-child(2)')){
			if ($(this).val() == ''){
				$item.next().remove();
			}
		}
	});
	*/
	
	$wrapper.on('click', '._formset-add-btn', function(e) {
		var $item = $(this).parent().find('.formset-item:last');
		add_formset($item, $item.data('prefix'));
	});
	
	$wrapper.on('click', '._formset-remove-btn', function(e) {
	    e.preventDefault();
		var $item = $(this).closest('.formset-item');
		var $delete_checkbox = $item.find("input[name$='-DELETE']");
		$delete_checkbox.prop('checked', true);
		$item.children().toggleClass('dn');
		$item.find('._required').removeAttr("required");
		//$item.find('> *').not('.formset-undo-deleted').css('display', 'none');
		//$item.find('.formset-undo-deleted').css('display', 'block');
	});
	
	$wrapper.on('click', '._formset-undo-link', function(e) {
	    e.preventDefault();
		var $item = $(this).closest('.formset-item');
		var $delete_checkbox = $item.find("input[name$='-DELETE']");
		$delete_checkbox.prop('checked', false);
		$item.children().toggleClass('dn');
		$item.find('._required').prop('required', 'true');
		$item.find('input').focus();
		// $item.find('.formset-undo-deleted').css('display', 'none');
		// $item.find('> *').not('.formset-undo-deleted').css('display', 'block');
	});
}

function clear_formsets(form) {
	
	form.find('[id$="-TOTAL_FORMS"]').each(function() {
		$(this).val(1);
		var name = $(this).attr('name');
		var prefix = name.replace('-TOTAL_FORMS', '');
		$('.formset-item[data-prefix=' + prefix + ']:not(:first)').remove();
		var item = $('.formset-item[data-prefix=' + prefix + ']');
		var delete_checkbox = item.find("input[name$='-DELETE']");
		
		item.find('input, select').each(function() {
			if(!$(this).is("select")) {
				$(this).val('');
			}
			$(this).removeAttr('checked');
		});
		
		item.addClass('dn');
		item.find('._required').removeAttr('required');		
		
		if (delete_checkbox.prop('checked')){
			delete_checkbox.prop('checked', false);
			item.children().toggleClass('dn');
		}	
		
	});
}

function add_formset($item, prefix) {
	var $new_element = $item.clone(true);
	$item.removeClass('dn');
	// Fixing "Empty fields non-focusable" error for extra form in formsets

	$item.find('._required').prop("required", "true");
	
	var total = $('#id_' + prefix + '-TOTAL_FORMS').val();
    $new_element.find('input, select').each(function() {
        var name = $(this).attr('name').replace('-' + (total-1) + '-','-' + total + '-');
        var id = 'id_' + name;
		$(this).attr('id', id);
		$(this).attr('name', name);
		if(!$(this).is("select")) {
			$(this).val('');
		}
		$(this).removeAttr('checked');
	});
    $new_element.find('label').each(function() {
        var newFor = $(this).attr('for').replace('-' + (total-1) + '-','-' + total + '-');
        $(this).attr('for', newFor);
    });
    total++;
    $('#id_' + prefix + '-TOTAL_FORMS').val(total);
	$item.after($new_element);
	$item.find('input').focus();
}

function increment_formset(prefix, count){
	var initial_forms_count = parseInt($('#id_' + prefix + '-INITIAL_FORMS').val());
	initial_forms_count += count;
	$('#id_' + prefix + '-INITIAL_FORMS').val(initial_forms_count);
}