var slotMoment;
$(function()
{
	"use strict"
	
	if (!localStorage.defaultCalendarView){
		localStorage.defaultCalendarView = 'month';
	}
	
	var $content_wrapper = $('#content-wrapper');
	
	if ($('#calendar-short-list').length > 0) {
		initiate_calendar();
	}
	
	$content_wrapper.on('mouseenter', '._calendar-note', function(){
		$(this).find('.list-search-form__autocomplete-close').removeClass('dn');
	});
	
	$content_wrapper.on('mouseleave', '._calendar-note', function(){
		$(this).find('.list-search-form__autocomplete-close').addClass('dn');
	});
	
	$('.fc-year-button.fc-button.fc-state-default').draggable({
		revert: true,      // immediately snap back to original position
		revertDuration: 0  //
	});
	
	// $('textarea').autosize();

	$content_wrapper.on('dblclick', '.tab__notification-link', function(){
	
		var self = $(this);

		self.find('span.tab__notification-description').addClass('dn');
		self.find('textarea.tab__notification-description').removeClass('dn').focus();
		
	});
	
	$content_wrapper.on('dblclick', '.tab__notification-link', function(){
	
		var self = $(this);

		self.find('._calendar-note-text').addClass('dn');
		self.find('._calendar-note-textarea').removeClass('dn').focus();
		
	});

	$content_wrapper.on('keypress', '._calendar-note-textarea', function(e){
		if (e.type === 'focusout' || (e.keyCode === 13 && !e.shiftKey)){
			e.preventDefault();
			var self = $(this);
			var inserted_text = self.val();
			var $li = self.closest('._calendar-note');
			var note_id = $li.data('id');
			if (!inserted_text) {
				if (!note_id) {
					$li.addClass('dn');
				}
				return false;
			}
			self.addClass('dn');
			$li.find('span.tab__notification-description').html(inserted_text).removeClass('dn');
			var params = {'data': {'id': note_id,
								   'text': inserted_text}}
			show_notification(gettext('Saving note...'), NOTIFICATION_STATUS.IN_PROGRESS);
			post_adjusted('/a_calendar_note_save/', params, function(response){
				if (note_id){
					show_notification(gettext('Note successfully saved'), NOTIFICATION_STATUS.SUCCESS);
				}
				else {
					// Temp code. Should be replaced by formset architecture. Read about formset pagination
					var $li_copy = $li.clone(true);
					$li.removeAttr('id');
					$li.data('id', response.note_id);
					$li_copy.find('._calendar-note-textarea').val('');
					$li_copy.find('._calendar-note-text').html('');
					$li_copy.addClass('dn');
					$('#calendar-note-list-wrapper').prepend($li_copy);
					show_notification(gettext('Note successfully created'), NOTIFICATION_STATUS.SUCCESS);
					makeCalendarNotesDraggable();
				}
			});
		}
	});
	
	$content_wrapper.on('click', '.tab__link', function(){

		var $this = $(this);

		if ( !$this.hasClass('active') ) {

			var currentTab = $( $this.attr('href') ),
				tabParent = $this.parents('.tab');

			tabParent.find('.tab-inner:visible').addClass('dn');
			currentTab.removeClass('dn');
			tabParent.find('.tab__link.active').removeClass('active');
			$this.addClass('active');
		}
		return false;
	});
	
	if ($('#event-guests-input').length > 0){
		CALENDAR_GUESTS_SLCTZ = $('#event-guests-input').selectize({
			openOnFocus: false,
			valueField: 'email',
			searchField: ['name', 'email'],
			options: emails,
			create: false,
			load: function(query, callback){
				var params = {'data': {q: query}}
				get_adjusted('/user_contact_numbers/', params, function(response) {
					callback(response);
				});
			},
			plugins: ['remove_button'],
			closeAfterSelect: true,
			render: {
				item: function(item, escape){
					if (item.name){
						return '<div class="fs13"><span style = "text-transform:uppercase;">' + 
									item.name + '</span><span style = "font-style: italic"> (' + item.email + ')</span></div>';
					}
					else {
						return '<div class="fs13"><span style = "font-style: italic"> ' + item.email + '</span></div>';
					}
				},
				
				option: function (item, escape) {
					return '<div class="fs13"><img src="' + "/a_get_contact_photo/" + item.photo_name + '"/><span>' + 
								item.name + '</span><span style = "font-style: italic"> ' + item.email + '</span></div>';
				}
			}
		})[0].selectize;
	}

	// -------------------------------------------------------------------------    RRULE     --------------------------------------------------
	// activate datetimepicker
	// $('.form-box--event-datepicker input:text').each(function( index, element ){
	// $(element).datepicker({
	$('#end-on-input').datepicker({
		beforeShow: function(input, inst) {
			$('#ui-datepicker-div').addClass('standard-datepicker');
		},
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		dateFormat: SETTINGS.DATE_FORMAT,
		onSelect: function(value) {
			//dateSelected = Date.parseExact(value, "yyyy-MM-dd");
			var dateSelected = new Date(value.replace(/-/g, "/") + ' 00:00:00'); // REGEX used to please SAFARI browser!
			var untilString = dateSelected.getFullYear() + ('0' + (dateSelected.getMonth()+1)).slice(-2) + ('0' + dateSelected.getDate()).slice(-2);
			
			// Remove the count variable
			RECURRING_RULE.count = '';
			// Set until variable
			RECURRING_RULE.until = untilString + 'T040000z';

			//alert(dateSelected);
			}
	});
	
	$('#end-on-input').datepicker('setDate', SETTINGS.CALENDAR_DEFAULT_DATETIME);
	
	$content_wrapper.on('keyup', '#calendar-search', function(e) {
		var $input = $(this);
		
		delay(function(){
			if (keycode_is_letter_or_symbol(e.which)){
				var search_text = $input.val();
				
				if (search_text !== ''){
					var params = {'show_loader': true,
								  'content': $('#calendar-search-results-wrapper')} //checked_sim_cards};
					get_adjusted('/a_calendar_events_filter/' + search_text + '/', params, function(response){	
						$('#calendar-short-list').addClass('dn');
						$('#calendar-left-tab').addClass('dn');
						
						var $html = $('<div />',{html:response.template});
						$html.find('.accordion-box__title, .accordion-box__description').each(function(){
							highlight_search(search_text, $(this));
						});
						$('#calendar-search-results-wrapper').removeClass('dn').html($html.html());
					});
				}
				else {
					$('#calendar-short-list').removeClass('dn');
					$('#calendar-left-tab').removeClass('dn');
					$('#calendar-search-results-wrapper').addClass('dn').html('');
				}
			}
		}, 1000 );	
	});	
	
	$content_wrapper.on('submit', '.event-large-form', function(e){
		e.preventDefault();
		var $form = $(this);
		var instance_id = $form.data('event-instance-id');
		var is_recurring = $form.data('is-recurring');
		
		var rrule = rruleGenerate();
		if(rrule) {
			// TODO: Bad code
			$form.find('._rrule-value').val(rrule);
		}
		// $('#calendar-event-edit-wrapper').addClass('dn');
		// $('#calendar-dashboard-wrapper').removeClass('dn');
		$('#calendar-dashboard-wrapper').removeClass('dn');
						
		if (instance_id){	
			$('#calendar-event-edit-wrapper').addClass('dn');
			if (is_recurring) {
				if ($form.data('sync-id'))
					var modifyOption = prompt("Choose\n1 - to edit this event only;\n2 - to edit this and subsequent events\n3 - to edit all events");
				else {
					var modifyOption = prompt("Choose\n2 - to edit this and subsequent events\n3 - to edit all events");
				}
				data = $form.serialize() + '&instance_id=' + instance_id;
				var params = {'data': data}	
				if (modifyOption == '1') {
					post_adjusted('/a_calendar_event_update_only_this/', params, function(response){
						$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
						show_notification('Event has been updated', NOTIFICATION_STATUS.STATUS);
					});
				}
				
				else if (modifyOption == '2') {
					alert('Пока тестируется...');
					return;
					post_adjusted('/a_calendar_event_update_this_and_following/', params, function(response){
						$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
					});
				}
				else if (modifyOption == '3') {
					post_adjusted('/a_calendar_event_update_all/', params, function(response){
						$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
						show_notification('Event has been updated', NOTIFICATION_STATUS.STATUS);
					});
				}
			}
			else {
				
				var data = $form.serialize();
				data += '&instance_id=' + instance_id;
				var params = {'data': data}
				post_adjusted('/a_calendar_event_update/', params, function(response){
					$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
					show_notification('Event has been updated', NOTIFICATION_STATUS.STATUS);
					
				});
			}
		}
		
		else {
			$('#calendar-event-create-wrapper').addClass('dn');
			$('#calendar-dashboard-wrapper').removeClass('dn');
			var data = $form.serialize() + '&modifyOption=0';
			var params = {'data': data};
			show_notification('Creating event...', NOTIFICATION_STATUS.IN_PROGRESS);
			post_adjusted('/a_calendar_event_create/', params, function(response){
				var events = response.events;
				var user_tz = response.user_timezone_offset;
				var events = new_events_json(events, user_tz);
				for (var i = 0; i < events.length; i++) {
					$("#calendar-dashboard").fullCalendar('renderEvent', events[i], false);
				};
				BUSY_MAP = response.busy_map;
				update_busy_map();
				show_notification('Event created', NOTIFICATION_STATUS.SUCCESS);
				
			});
		}
		history.pushState({ foo: "bar" }, "page 2", '/calendar/');
	});
	
	$content_wrapper.on('click', '._new_calendar-note', function(e){
		alert('Test');
	});
	
	$content_wrapper.on('click', '.event-large-form input[type="reset"]', function(e){
		e.preventDefault();
		history.pushState({ foo: "bar" }, "page 2", '/calendar/');
		$('#calendar-event-create-wrapper').addClass('dn');
		$('#calendar-event-edit-wrapper').addClass('dn');
		$('#calendar-dashboard-wrapper').removeClass('dn');
		$('#calendar-event-edit-wrapper').html('');
		
		
	});
	
	$content_wrapper.on('click', '#recurring-rule-modal input[type="reset"]', function(e){
		e.preventDefault();
		$('#recurring-rule-modal').modal('hide');
		$('._rrule-select').val('no_repeat');
	});
	
	$content_wrapper.on('click', '#add-calendar-note', function(e) {
		e.preventDefault();
		var $newNoteContainer = $('#new-calendar-note-wrapper');
		var $newNoteHtml = $('<div />',{html: $newNoteContainer.html()});
		var $notesContainer = $('#calendar-note-list-wrapper');
		$newNoteHtml.find('li').removeClass('dn');
		$notesContainer.prepend($newNoteHtml.html());
		$notesContainer.find('li:first ._calendar-note-textarea').dblclick();
		
	});
	
	$content_wrapper.on('submit', '#recurring-rule-modal', function(e){
		e.preventDefault();
		var rrule_str = rruleGenerate();
		var rrule_obj = RRule.fromString(rrule_str);
		
		// Assign text representation of rrule to the select
		var $rrule_select = $('._rrule-select');
		$rrule_select.find('option[value="user-custom"]').remove();
		$rrule_select.append($('<option>', {
				value: 'user-custom',
				text: rrule_obj.toText()
		})).val('user-custom');
		
		$(this).modal('hide');
	});
	
	$content_wrapper.on('change', '._rrule-select', function(e){

		if( $(this).val() === 'no_repeat' ){
			RECURRING_RULE = null;
		} 
		else {
			resetRecurringRule();
			switch ( $(this).val() ) {
				case "weekly-weekdays":
					RECURRING_RULE.freq = 'weekly';
					RECURRING_RULE.bydays = 'MO,TU,WE,TH,FR';
					break;
				
				case "weekly-sa":
					RECURRING_RULE.freq = 'weekly';
					RECURRING_RULE.bydays = 'SA';
					break;
				case "weekly-su":
					RECURRING_RULE.freq = 'weekly';
					RECURRING_RULE.bydays = 'SU';
					break;
				case "weekly-sa-su":
					RECURRING_RULE.freq = 'weekly';
					RECURRING_RULE.bydays = 'SA,SU';
					break;
				
				case "monthly":
					RECURRING_RULE.freq = 'monthly';
					// RECURRING_RULE.bymonthday = ;
					break;
				case "monthly_last_day":
					RECURRING_RULE.freq = 'monthly';
					RECURRING_RULE.bymonthday = '-1';
					
					break;
					
				case "custom":
					$('#recurring-rule-modal').modal();
					break;
				
				default:
					RECURRING_RULE.freq = $(this).val();
					break;
			}
		}
	});
	
	$content_wrapper.on('change','select[name="repeat-frequency"]', function(){

		var $selectedFrequency = $('select[name="repeat-frequency"] option:selected');

		$('#weekday-select-wrapper').addClass('dn');
		
		switch ( $(this).val() ) {
			case "weekly":
				$('#weekday-select-wrapper').removeClass('dn');
				$('#weekday-checkbox-wrapper input[type="checkbox"]:first').change();
				break;
		}
		
		$('div.' + $selectedFrequency.val() +'-choice').show();
		
		RECURRING_RULE.freq = $selectedFrequency.val();
		
		if ($selectedFrequency.val() === 'weekly'){
			$('#weekday-checkbox-wrapper input[type="checkbox"]:first').change();
		}
	});
	
	$content_wrapper.on('change', 'input[name=repeat-ends-radio]', function(){
		$('#end-on-input, #occurrences').prop('disabled', true);
		RECURRING_RULE.count = "";
		RECURRING_RULE.until = "";
		
		switch ( $('input[name=repeat-ends-radio]:checked').attr('id') ) {
			case 'end-never':
				break;
			case 'end-after':
				$('#occurrences').prop('disabled', false).focus();	
				RECURRING_RULE.count = $('#occurrences').val();
				break;
			case 'end-on':
				$('#end-on-input').prop('disabled', false).focus();
				RECURRING_RULE.until = $('#end-on-input').val();
				break;
		}		 
	});
	
	// BYDAY - FREQ: WEEKLY Selection
	$content_wrapper.on('change', '#weekday-checkbox-wrapper input[type="checkbox"]', function(){
		
		var byday = []; // Array to Store 'byday' in. Reset it to '' to store new days in below

		// Store Selected Days in the BYDAY rule
		$('#weekday-checkbox-wrapper input[type="checkbox"]').each(function(){
		  
			// Active class is the selected day, store the ID of active days which contains the short day name for the rrule (ex. MO, TU, WE, etc)
			if ( $(this).is(':checked')) {
				byday.push($(this).val());
			}

		});
		RECURRING_RULE.byday = byday;
	});
	
	$content_wrapper.on('change blur keyup', 'input[name="interval"]', function(){
		RECURRING_RULE.interval = $(this).val();
	});

	$content_wrapper.on('input change', 'input[name="occurrences"]', function() {
		RECURRING_RULE.count = $(this).val();
	});
	
	$content_wrapper.on('click', '._delete-note', function(e){
		var $wrapper = $(this).closest('li');
		var note_id = $wrapper.data('id');
		post_adjusted('/a_calendar_note_delete/' + note_id + '/', function(e) {
			$wrapper.remove();
			
			show_notification(gettext('Note successfully deleted'), NOTIFICATION_STATUS.SUCCESS);
		});
	});
	
	$content_wrapper.on('dblclick', '._open-calendar-event', function(e){
		var event_id = $(this).data('instance-id');
		edit_calendar_event(event_id);
	});
	
	$content_wrapper.on( 'click', '._edit-account-visibility', function(e){
		e.stopPropagation();
		$(this).closest('.calendar__expand-box-item').toggleClass('active');
		
		var $wrapper = $(this).closest('.calendar__expand-box-item');
		var calendar_id = $wrapper.data('calendar-id');
	
		var events = $('#calendar-dashboard').fullCalendar('clientEvents');
		
		var active_dates = getCalendarDateRange();
		var params = {'data': {'calendar_id': calendar_id,
							   'is_visible': $wrapper.hasClass('active') ? 1 : 0,
							   'start': active_dates.start/1000,
							   'end': active_dates.end/1000},
					  'clearCache': false}
		$('#calendar-dashboard').fullCalendar('refetchEvents');
		post_adjusted('/edit_account_visibility/', params);
	});
	
	$(document).on('change', '#id_account_fancy', function(e) {
		$('#id_account').val($(this).val());
	});
	
	$(document).on('submit', '#recurring_items_edit_option_form', function(e){
		e.preventDefault();
		var $form = $(this);
		var event = $form.data('event');
		$form.modal('hide');
		var options = {}
		options.event = event;
		options.edit_method_option = $('input[name=recurring_item_option_radio]:checked', '#recurring_items_edit_option_form').val();
		show_calendar_event_modal(options);
	});
	
	$(document).on('click', '#delete_event', function(){
		var delete_method = null;
		var $form = $(this).closest('form');
		var is_recurring = $form.data('is-recurring');
		var modifyOption = null;
		if (is_recurring) {
			if ($form.data('sync-id')) {
				modifyOption = prompt("Choose\n1 - to delete this event only\n2 - to delete this and subsequent\n3 - to delete all events");
			}
			else {
				modifyOption = prompt("Choose\n3 - to delete all events");
			}
		}
		else {
			modifyOption = '0';
		}
		var $form = $(this).closest('form');
		var event_id = $form.data('event-instance-id');
		var edit_method_option = $form.data('edit_method_option'); 
		var params = {'data': {'instance_id': event_id,
							   'modifyOption': modifyOption}};
	
		$('#calendar-event-edit-wrapper').addClass('dn');
		$('#calendar-dashboard-wrapper').removeClass('dn');
		window.history.back();
		post_adjusted('/a_calendar_event_delete/', params, function() {
			$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
			show_notification('Event has been deleted');	
		});
	});
	
	$(document).on('change', '._all-day', function(e) {
		if ($(this).is(':checked')){
			var $form = $(this).closest('form');
			var start_date = $form.find('[name = start-date]').val();
			start_date = moment(start_date).set({hour:0,minute:0,second:0,millisecond:0}).format(SETTINGS.DATETIME_FORMAT);
			$form.find('[name = start-date]').val(start_date);
		}
	});
	
	$(document).on('click', '#new_event_btn', function(e){
		var url = '/calendar/new/';
		history.pushState({ foo: "bar" }, "page 2", 'new');
		$.get(url, function(response){
			$('#right_column').html(response.object.template);
		});
	});
	
	function resetRecurringRule() {
		// Format the date (http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date)
		var startDate = $('#start-date-input').datetimepicker('getDate');

		$('select[name="repeat-frequency"]').val('weekly');		
		RECURRING_RULE = {
			freq: $('select[name="repeat-frequency"]').val(),
			interval: "1",
			byday: "",
			bysetpos: "",
			bymonthday: "",
			bymonth: "",
			count: "",
			until: ""
		};
		
		// $('#weekday-select-wrapper').hide();
		
		$('input[name="interval"]').val("1");
		$('input[name="occurrences"]').val("10");
		
		// Reset Until / Count radio buttons
		$('input[id="until-select"]').prop('checked', false);
		$('input[id="count-select"]').prop('checked', true).change();
		// $('#count').reset();
	}
	
	function rruleGenerate() {
		// Produce RRULE state to feed to rrule.js
		if (!RECURRING_RULE) {
			return "";
		}	
		var rrule = "";

		 // Check to be sure there is a count value or until date selected
		
		for ( var key in RECURRING_RULE ) {
			if ( RECURRING_RULE.hasOwnProperty(key) ) {
				if ( RECURRING_RULE[key] != '') {
					rrule += key + '=' + RECURRING_RULE[key] + ';';
			    }
			}
		}			
		// Remove the last semicolon from the end of RRULE
		rrule = rrule.replace(/;\s*$/, "");

		// Convert to Uppercase and return
		return rrule.toUpperCase();		
	}
});

function update_busy_map(){
	var dates_old = getCalendarShortListDateRange();
	$('#calendar-short-list').datepicker( "option", "beforeShowDay", busy_map_color );
	var dates_new = getCalendarShortListDateRange(); 
	if (dates_new.end > dates_old.end) {  
		while (dates_old.end != dates_new.end) {
			$('#calendar-short-list').find('.ui-datepicker-next').click();
			dates_new = getCalendarShortListDateRange();
		}
	}
	else if(dates_new.start > dates_old.start) {
		while (dates_old.start != dates_new.start) {
			$('#calendar-short-list').find('.ui-datepicker-prev').click();
			dates_new = getCalendarShortListDateRange();
		}
	}
}

function edit_calendar_event(event_id){
	var url = '/calendar/edit/' + event_id + '/'
	history.pushState({ foo: "bar" }, "page 2", url);
	$('#calendar-event-create-wrapper').addClass('dn');
	get_adjusted(url, function(response){
		$('#calendar-dashboard-wrapper').addClass('dn');
		$('#calendar-event-edit-wrapper').removeClass('dn');
		$('#calendar-event-edit-wrapper').html(response.template);
		var start_date = new Date(response.start_date); 
		var end_date = new Date(response.end_date);
		dateTimepickerFromTo( 'update-event-start-date-input', 'update-event-end-date-input', 'autocomplete-timerpicker', start_date, end_date);
		
		// populate rrule select
		var rrule_str = $('#calendar-event-edit-wrapper').find('._rrule-value').val().replace(/\s/g, '');
		var $rrule_select = $('#calendar-event-edit-wrapper').find('._rrule-select');
		if (rrule_str == '') {
			$rrule_select.val('no_repeat');
		}
		else if (rrule_str.includes('UNTIL') || rrule_str.includes('COUNT') || (rrule_str.includes('INTERVAL') && !rrule_str.includes('INTERVAL=1')) ||
		   (rrule_str.includes('BYDAY') && !rrule_str.includes('BYDAY=SU,SA;') && !rrule_str.endsWith('BYDAY=SU,SA') &&
		    rrule_str.includes('BYDAY=MO,TU,WE,TH,FR;') && rrule_str.endsWith('BYDAY=MO,TU,WE,TH,FR'))) {
			$rrule_select.append($('<option>', {
				value: 'user-custom',
				text: RRule.fromString(rrule_str).toText()
			})).val('user-custom');
		}
		else if (rrule_str.includes('FREQ=DAILY')) {
			$rrule_select.val('daily');
		}
		
		else if (rrule_str.includes('FREQ=WEEKLY') && (rrule_str.includes('BYDAY=SU,SA;') || rrule_str.endsWith('BYDAY=SU,SA'))) {
			$rrule_select.val('weekly-sa-su');
		}
		else if (rrule_str.includes('FREQ=WEEKLY') && (rrule_str.includes('BYDAY=MO,TU,WE,TH,FR;') || rrule_str.endsWith('BYDAY=MO,TU,WE,TH,FR'))) {
			$rrule_select.val('weekly-weekdays');
		}
		else if (rrule_str.includes('FREQ=WEEKLY')) {
			$rrule_select.val('weekly');
		}
		
		else if (rrule_str.includes('FREQ=MONTHLY')) {
			$rrule_select.val('monthly');
		}
		
	});
}		

function rotate( array , times ){
	while( times-- ){
		var temp = array.shift();
		array.push( temp )
	}
	return array;
}

function initializeBusyMap(){
	$('#calendar-short-list').datepicker({
		beforeShowDay: function( date ){
			return busy_map_color(date);
		},
		firstDay: SETTINGS.CALENDAR_WEEK_START,
		changeYear: true,
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		numberOfMonths: 2,
		showOtherMonths: true,
		onSelect: function(dateText) {
			var splitDateArray = dateText.split("/");
			var year = splitDateArray[2];
			var month = splitDateArray[0];
			var day = splitDateArray[1];
			var selectedDate = new Date(year, month - 1, day);
			$("#calendar-dashboard").fullCalendar( 'gotoDate', selectedDate);
			return false;
		}
		// selectOtherMonths: true
	});
	
	$('#calendar-dashboard-year').datepicker({
		beforeShowDay: function( date ){
			return busy_map_color(date);
		},
		showButtonPanel: false,
		firstDay: SETTINGS.CALENDAR_WEEK_START,
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		numberOfMonths: 12,
		stepMonths: 12,
		defaultDate: '01/01/' + (new Date()).getFullYear(),
		showOtherMonths: true,
		onSelect: function(dateText) {
			var splitDateArray = dateText.split("/");
			var year = splitDateArray[2];
			var month = splitDateArray[0];
			var day = splitDateArray[1];
			var selectedDate = new Date(year, month - 1, day);
			var params = {'data': {'date': dateToServerFormat(selectedDate)}};
			get_adjusted('/a_calendar_event_date_schedule/', params, function(response) {
				$(response.template).modal();
			});
			
			return false;
		}
	});
	
}

function busy_map_color(date){
	var parsedDate = ( date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 ) + '-' +
					 ( date.getDate() < 10 ? '0'+date.getDate() : date.getDate() ) + '-' +
					 date.getFullYear(),
		result = [true, ""]; // Default

	for (var i = 0; i < BUSY_MAP.length; i++){
		if ( parsedDate === BUSY_MAP[i][0] ) {
			var measure = 100*(BUSY_MAP[i][1]/1440);
			var tooltip = (BUSY_MAP[i][1]/60).toFixed(2).toString() + ' ' + gettext('hours') + ' (' + parseInt(measure).toString() + '%)'
			switch (true) {
				case (measure < 5):
					result = [true, "busy-map-color-1", tooltip];
					break;
				case (measure >= 5 && measure < 10):
					result = [true, "busy-map-color-2", tooltip];
					break;
				case (measure >= 10 && measure < 20):
					result = [true, "busy-map-color-3", tooltip];
					break;
				case (measure >= 20 && measure < 30):
					result = [true, "busy-map-color-4", tooltip];
					break;
				case (measure >= 30):
					result = [true, "busy-map-color-5", tooltip];
					break;
					
				default:
					break;
			}
			
			return result;
		}
	}
	return result;
}

function initiate_calendar(){
	
	$('#calendar-dashboard').fullCalendar({
		header: {
			left: 'today prev,next',
			center: 'title',
			right: 'agendaDay,agendaWeek,month,listMonth,year,more'
			//right: 'month,agendaWeek,agendaDay,listYear,more'
		},
		defaultView: localStorage.defaultCalendarView,
		views: {
			month: { // name of view
				columnFormat: 'dddd'
				// other view-specific options here
			},
			agendaWeek: {
				columnFormat: 'dddd D'
			},
			year: {
				type: 'agenda',
				buttonText: 'Year',
				titleFormat: 'YYYY'
			}
		},
		
		slotLabelFormat: 'H:mm',
		scrollTime : '13:00',
		firstDay: SETTINGS.CALENDAR_WEEK_START,
		allDaySlot: true, // Determines whether all day events are shown at the top of the calendar
		dayClick: dayClickCallback,
		buttonText: 
			{
				today:    'Today',
				month:    'Month',
				week:     'Week',
				day:      'Day',
				list:     'Schedule',
			},
		
		customButtons: {
			
			more: {
				text: ' ',
				click: function(e) {
					e.stopPropagation();
					$('.calendar__expand-box').toggleClass('dn');
				}
			},
			
		},
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		defaultTimedEventDuration: moment().startOf('day').minutes(SETTINGS.CALENDAR_DEFAULT_DURATION).format('H:mm:ss'),
		eventTextColor: 'white',
		eventRender: function(event, element) {
			 // render the timezone offset below the event title
			if (event.description && event.description.trim()) {
				element.find('.fc-title').after($('<span class="circle" style="float:right"/>'));
			}
	
			element.bind('dblclick', function() {
					
				edit_calendar_event(event.id);
							
				/*
				$(document).on('submit', '#calendar_event_form', function(e){
					e.preventDefault();
					var $form = $(this);
					var edit_method_option = $form.data('edit_method_option');
					var data = $form.serialize();
					if ($form.data('event-instance-id')){
						if (event.r_rule) {
							if (edit_method_option == '1') {
								data += '&parent_id=' + event.id;
								$.post('/a_calendar_event_create/', data, function(response){
									$form.modal('hide');
									$('#calendar').fullCalendar('updateEvent', event);
								});
							}
							
							else if (edit_method_option == '2') {
								data += '&id=' + event.id;
								alert('This function is not available yet');
							}
							
							else if (edit_method_option == '3') {
								data += '&id=' + event.id;
								$.post('/a_calendar_event_update/', data, function(response){
									$form.modal('hide');
									$('#calendar').fullCalendar('updateEvent', event);
									
								});
							}
						}
						else {
							data += '&id=' + event.id;
							$.post('/a_calendar_event_update/', data, function(response){
								for (var key in response.object.calendar_event) {
									if (event.hasOwnProperty(key)) {
										event[key] = response.object.calendar_event[key];
									}
								}
								// $('#calendar').fullCalendar('updateEvent', event);
							});
						}
					}
				});
				*/
			});
		},
		dragRevertDuration: 0,
		eventDragStart: function( event, jsEvent, ui, view ) { 
			console.log(jsEvent.offsetX);
		},
		dragScroll: true,
		events: function(start, end, timezone, callback) {
			var url = '/a_calendar_events/?start=' + start.unix() + '&' + 'end=' + end.unix();
			var fromLocalCache = !(typeof localCache[url] === 'undefined' || !localCache[url]);
			get_adjusted(url, function(response) {
				var events = response.events;
				var user_tz = response.user_timezone_offset;
				var viewName = $('#calendar-dashboard').fullCalendar( 'getView' ).name;
				if (!fromLocalCache){
					events = new_events_json(events, user_tz, viewName);
				}
				
				events = $.grep(events, function($elem) {
					var calendar_id = $elem.calendar_id;
					return $('#accounts-visibility-control-wrapper [data-calendar-id=' + calendar_id + ']').hasClass('active');
				});
				callback(events);
			});
		},
		
		eventDrop: function(event, delta, revertFunc) {
			var data = {'instance_id': event.id,
						'start': event.start.format(),
						'end': event.end.format()};
			if (event.sync_id || !(event.r_rule)) {
				show_notification('Saving...', NOTIFICATION_STATUS.IN_PROGRESS);
				$.post('/a_calendar_event_update_start_date/', data, function(){
					show_notification('Event rescheduled', NOTIFICATION_STATUS.SUCCESS);
				}).fail(function(xhr, status, error) {	
					revertFunc();
				});
			}
			else {
				show_notification('Event cannot be rescheduled. Please refresh your mobile phone and try again', NOTIFICATION_STATUS.FAIL);
				revertFunc();
			}
		},
		
		eventResize: function(event, delta, revertFunc) {
			var data = {'instance_id': event.id,
						'start': event.start.format(),
						'end': event.end.format()};
			$.post('/a_calendar_event_update_start_date/', data).fail(function(xhr, status, error) {	
				revertFunc();
			});
		},
		droppable: true,
		drop: function(date) {
			var start_date = null;
			if ($('#calendar-dashboard').fullCalendar( 'getView' ).name === 'month') {
				start_date = dateStrFromParts(date._d.getFullYear(), date._d.getMonth(), date._d.getDate(), SETTINGS.CALENDAR_DEFAULT_TIME_HOUR, SETTINGS.CALENDAR_DEFAULT_TIME_MINUTE, '0');
			}
			else {
				start_date = dateStrFromParts(date._a[0], date._a[1], date._a[2], date._a[3], date._a[4], date._a[5]);
			}
			var title = getTitleForExternalEvent($(this)),
				objectType = $(this).data('type'),
				start_date = start_date;
			
			params = {'data': {'title': title,
							   'object_type': objectType,
							   'start_date': start_date,
							   'object_id': $(this).data('id')}}		
			if(objectType === 'note'){
				$(this).remove();
			}
			show_notification('Creating event...', NOTIFICATION_STATUS.IN_PROGRESS);
			post_adjusted('/a_save_external_object_as_event/', params, function(response){
				var events = [response.event];
				var user_tz = response.user_timezone_offset;
				var viewName = $('#calendar-dashboard').fullCalendar( 'getView' ).name;
				var result = new_events_json(events, user_tz, viewName);
				$("#calendar-dashboard").fullCalendar('renderEvent', result[0], true);
				show_notification('Event created', NOTIFICATION_STATUS.SUCCESS);
				BUSY_MAP = response.busy_map;
				update_busy_map();
			});
		}
		
	}).on('click', '.fc-agendaDay-button, .fc-listYear-button, .fc-month-button,.fc-agendaWeek-button, .fc-listMonth-button', function() {
		localStorage.defaultCalendarView = $('#calendar-dashboard').fullCalendar( 'getView' ).name;
		$('.fc-header-container, .fc-view-container').show();
		$('#calendar-dashboard-year').hide();
		$('.fc-axis.fc-widget-header').html('<span class="gmt-wrapper">GMT+1</span>');
		
	}).on('click', '.fc-year-button', function() {
		localStorage.defaultCalendarView = $('#calendar-dashboard').fullCalendar( 'getView' ).name;
		$('.fc-header-container, .fc-view-container').hide();
		$('#calendar-dashboard-year').show();
		// $('#calendar-dashboard').fullCalendar( 'prevYear' );
		//$('#calendar-dashboard-year').find('.ui-datepicker-prev').click();
	}).on('click', '.fc-next-button', function() {
		if ($('#calendar-dashboard-year').is(":visible")){
			$('#calendar-dashboard').fullCalendar( 'nextYear' );
			$('#calendar-dashboard-year').find('.ui-datepicker-next').click();
		}
		calendar_short_list_navigate();
	}).on('click', '.fc-prev-button', function() {
		if ($('#calendar-dashboard-year').is(":visible")){
			$('#calendar-dashboard').fullCalendar( 'prevYear' );
			$('#calendar-dashboard-year').find('.ui-datepicker-prev').click();	
		}
		calendar_short_list_navigate();
	}).find('.fc-today-button').click(function(){
		$('#calendar-dashboard-year').datepicker( "setDate", new Date());
	});

	if (localStorage.defaultCalendarView === 'year') {
		$('.fc-year-button').click();
	}
	else if (localStorage.defaultCalendarView === 'listMonth') {
		$('.fc-listMonth-button').click();
	}
	
	$("#calendar-dashboard").dblclick(function() {
		if(slotMoment){
			hide_notification();
			$('#calendar-event-edit-wrapper').addClass('dn').html('');
			$('#calendar-dashboard-wrapper').addClass('dn');
			
			var $wrapper = $('#calendar-event-create-wrapper'); 
			$wrapper.removeClass('dn');
			history.pushState({ foo: "bar" }, "page 2", '/calendar/create_event/');
			
			var start_date = new Date(slotMoment.utc().year(), slotMoment.utc().month(), slotMoment.utc().date(), slotMoment.utc().hour(), slotMoment.utc().minute());
		
			if ($('#calendar-dashboard').fullCalendar( 'getView' ).name === 'month') {
				start_date.setHours(SETTINGS.CALENDAR_DEFAULT_TIME_HOUR);
				start_date.setMinutes(SETTINGS.CALENDAR_DEFAULT_TIME_MINUTE);
			}
			var end_date = new Date((start_date).getTime() + SETTINGS.CALENDAR_DEFAULT_DURATION*60000)
			
			dateTimepickerFromTo( 'create-event-start-date-input', 'create-event-end-date-input', 'autocomplete-timerpicker', start_date, end_date);
		}
	});
	
	RECURRING_RULE = null;
	
	var defaultDatetime = SETTINGS.CALENDAR_DEFAULT_DATETIME;
	var start_date = new Date(defaultDatetime);
	var end_date = new Date(start_date.getTime() + SETTINGS.CALENDAR_DEFAULT_DURATION*60000);
	
	dateTimepickerFromTo( 'create-event-start-date-input', 'create-event-end-date-input', 'autocomplete-timerpicker', start_date, end_date);
	initializeBusyMap();
	var params = null;

	params = {'container': $('#calendar-note-list-wrapper'),
			  'show_loader': true}
	get_adjusted('/a_calendar_notes/', params, function(response){
		
		$('#calendar-note-list-wrapper').append(response.template);
		
		makeCalendarNotesDraggable();
		
		$('#caledar-left-side-wrapper').endlessPaginate({
			paginateOnScroll: true,
			onCompleted:function(){
				makeCalendarNotesDraggable();				
			}
		});
	});
	
	params = {'container': $('#news-feed-wrapper'),
			  'show_loader': true}
	get_adjusted('/a_news_feed/', params, function(response){
		$('#news-feed-wrapper').html(response.template);
		
		makeCommunicationFeedDraggable();
		
		$('#news-feed-wrapper').endlessPaginate({
			paginateOnScroll: true,
			onCompleted:function(){
				makeCalendarNotesDraggable();				
			}
		});
	});
	
	function makeCommunicationFeedDraggable() {
		$('._communication_feed_sms, ._communication_feed_call_log').draggable({
			zIndex: 999,
			appendTo: 'body',
			revert: true,      // immediately snap back to original position
			revertDuration: 0,  //
			helper: function() {
				var $el = $('<div style="padding: 5px;" class="fs14"></div>');
				var text = getHelperForExternalEvent($(this));
				$el.text(text);
				return $el;
			},
			cursor: "pointer",
			cursorAt: {
				top: 5,
				right: 45
			},
			start: function(e, ui) {
				ui.helper.css('background', '#f7f7f7');
				ui.helper.css('border', 'solid');			
				ui.helper.css('border-width', '1px');
				ui.helper.css('border-radius', '3px');
				ui.helper.css('border-color', '#dedede');
				
				//ui.helper.find('._delete-note').addClass('dn');
				//ui.helper.css('list-style-type', 'none');
				$(this).addClass('_highlight-draggable');
			},
			stop: function(){
				$(this).removeClass('_highlight-draggable');
			}
		});
	}	
	
	function getTitleForExternalEvent(obj) {
		var object_type = obj.data('type');
		var rs = '';
		
		switch ( object_type ) {
			case 'note':
				rs = obj.find('._calendar-note-text').text().trim();
				break;
			case 'sms':
				rs = obj.find('._dialog-body-wrapper').text().trim();
				break;
			case "call_log":
				rs = gettext('Call') + ' ' + obj.find('.accordion-box__title').text().trim();
				break;
		}
		
		return rs;	
	}
	
	function getDescriptionForExternalEvent(obj) {
		var object_type = obj.data('type');
		var rs = '';
		
		switch ( object_type ) {
			case 'note':
				rs = obj.find('._calendar-note-textarea').val();
			case 'sms':
				rs = obj.find('.accordion-box__title').val();
			case "call_log":
				rs = obj.find('._calendar-note-textarea').val();
		}
	}
	
	function getHelperForExternalEvent(obj) {
		var object_type = obj.data('type');
		var rs = '';
		
		switch ( object_type ) {
			case 'note':
				rs = obj.find('._calendar-note-textarea').text().trim();
				break;
			case 'sms':
				rs = gettext('Sms from') + ' ' + obj.find('._dialog-number-wrapper').text().trim();
				break;
			case "call_log":
				rs = gettext('Call') + ' ' + obj.find('.accordion-box__title').text().trim();
				break;
		}
		
		return rs;
	}
}

function makeCalendarNotesDraggable() {
	/*
	$('._calendar-note').draggable({
		zIndex: 999,
		appendTo: 'body',
		revert: true,      // immediately snap back to original position
		revertDuration: 0,  //
		//helper: 'clone',
		helper: function() {
			var $el = $('<div style="padding: 5px;" class="fs14"></div>');
			$el.text($(this).find('._calendar-note-text').text());
			return $el;
		},
		cursor: "pointer",
		cursorAt: {
			top: 5,
			right: 45
		},
		start: function(e, ui) {
			// $(this).closest('.scroller-block').css('overflow', 'visible');
			//var classList = $(this).attr('class').split(/\s+/);
			//$.each(classList, function(index, item) {
			//	ui.helper.addClass(item);	
			//});
			
			
			// ui.helper.width($(this).width());
			ui.helper.css('background', '#f7f7f7');
			ui.helper.css('border', 'solid');			
			ui.helper.css('border-width', '1px');
-			ui.helper.css('border-radius', '3px');
			ui.helper.css('border-color', '#dedede');
			
			//ui.helper.find('._delete-note').addClass('dn');
			//ui.helper.css('list-style-type', 'none');
			$(this).css('visibility', 'hidden');
		},
		stop: function() {
			// $(this).closest('.scroller-block').css('overflow', '');
			$(this).css('visibility', '');
		}
	}); */
	$('#calendar-note-list-wrapper').sortable({
		zIndex: 999,
		appendTo: 'body', // this solved the overflow div issue
		opacity: 0.8,
		cursorAt: {
			left: -5,
			top: 5
		},
		helper: function(e, draggedItem) {
			var $el = $('<div style="padding: 5px; width: 170px; height: auto;" class="fs14"></div>');
			var text = draggedItem.find('._calendar-note-text').text();
			if (text.length > 25) {
				var text = text.substring(0,25) + '...'; 
			}
			$el.text(text);
			return $el;
		},
		placeholder: 'sortable-placeholder',
		start: function(e, ui){
			ui.helper.css('background', '#f7f7f7');
			ui.helper.css('border', 'solid');			
			ui.helper.css('border-width', '1px');
			ui.helper.css('border-radius', '3px');
			ui.helper.css('border-color', '#dedede');
			//$(ui.item).css('visibility', 'hidden');
			//$(ui.item).addClass('_highlight-draggable');
		},
		stop: function(e, ui) {
			//$(ui.item).css('visibility', '');
			//$(ui.item).removeClass('_highlight-draggable');
		},
		update: function(event, ui) {
			var $neightbor = $('._calendar-note').eq(ui.item.index() + 1);
			var params = {'data': {'id': ui.item.data('id'), 
								   'put_before_id': $neightbor.length ? $neightbor.data('id') : undefined}};
			post_adjusted('/a_calendar_note_reorder/', params);
		}
	});
	$('._calendar-note').droppable();
}

function calendar_short_list_navigate(){
	var dashboard_active_dates = getCalendarDateRange();
	var short_list_active_dates = getCalendarShortListDateRange();
		
	while(short_list_active_dates.start > dashboard_active_dates.start || dashboard_active_dates.end > short_list_active_dates.end){
			
			if (short_list_active_dates.end < dashboard_active_dates.end) {
				$('#calendar-short-list').find('.ui-datepicker-next').click();
			}
			else {
				$('#calendar-short-list').find('.ui-datepicker-prev').click();
			}
		short_list_active_dates = getCalendarShortListDateRange();
	}
	
	var active_month = new Date(dashboard_active_dates.start);
	$('calendar-short-list').find('.ui-datepicker-group .ui-datepicker-month').removeClass('short-list-active-month');
	$('calendar-short-list').find('.ui-datepicker-group').each(function(){
		if ($(this).find('table tbody tr:nth-child(2) td:first').data('month') === active_month){
			$(this).find('.ui-datepicker-group ui-datepicker-month').addClass('short-list-active-month');
		}
	});		
}

function getCalendarDateRange() {
	var calendar = $('#calendar-dashboard').fullCalendar('getCalendar');
	var view = calendar.view;
	var start = new Date(view.intervalStart._d);
	var end = view.intervalEnd._d;
	end = new Date(end.setDate(end.getDate()-1));
	var dates = { start: start.setHours(0,0,0,0), end: end.setHours(0,0,0,0) };
	return dates;
}
	
function getCalendarShortListDateRange() {

	// Determine start date
	
	var month = $('#calendar-short-list').find('.ui-datepicker-group:first tbody tr:first td:last').data('month');
	var year = $('#calendar-short-list').find('.ui-datepicker-group:first tbody tr:first td:last').data('year');
	
	if ($('#calendar-short-list').find('.ui-datepicker-group:first td:first > a').length){
		date = $('#calendar-short-list').find('.ui-datepicker-group:first td:first > a').text();		
	}
	else {
		date = $('#calendar-short-list').find('.ui-datepicker-group:first td:first > span').text();
		month -= 1;
		if (month == 0) {
			month = 12;
			year -= 1;
		}
	}
	
	var start = new Date(year, month, date);
	// Determine end date
	month = $('#calendar-short-list').find('.ui-datepicker-group:last tbody tr:last td:first').data('month'); 
	if (month) {
		year = $('#calendar-short-list').find('.ui-datepicker-group:last tbody tr:last td:first').data('year');
	}
	else {
		month = $('#calendar-short-list').find('.ui-datepicker-group:last tbody tr:last').prev().find('td:first').data('month'); 
		year = $('#calendar-short-list').find('.ui-datepicker-group:last tbody tr:last').prev().find('td:first').data('year');
	}
	
	if ($('#calendar-short-list').find('.ui-datepicker-group:last td:last > a').length){
		date = $('#calendar-short-list').find('.ui-datepicker-group:last td:last > a').text();		
	}
	else {
		date = $('#calendar-short-list').find('.ui-datepicker-group:last td:last > span').text();
		month += 1;
		if (month == 13) {
			month = 1;
			year += 1;
		}
	}
	
	var end = new Date(year, month, date);
	var dates = { start: start.setHours(0,0,0,0), end: end.setHours(0,0,0,0) };
	return dates;
}

var lighterColor = function(hex, percent) {
	// strip the leading # if it's there
	hex = hex.replace(/^\s*#|\s*$/g, '');

	// convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	if (hex.length == 3) {
	  hex = hex.replace(/(.)/g, '$1$1');
	}

	var r = parseInt(hex.substr(0, 2), 16),
	  g = parseInt(hex.substr(2, 2), 16),
	  b = parseInt(hex.substr(4, 2), 16);

	return '#' +
	  ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
	  ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
	  ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

var darkenColor = function(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if(hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;
	
	// convert to decimal and change luminosity
	var rgb = '#', c, i;
	for(i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ('00' + c).substr(c.length);
	}
	//console.log(rgb);
	return rgb;
}
	
function new_events_json(events, user_tz, viewName) {
	// user_tz - mobile timezone offset in minutes
	var color = null;
	var tz_offset = parseInt(user_tz);
	for (var i =0; i < events.length; i++){
		if (viewName !== 'listMonth') {
			color = events[i].color;
			events[i].color = lighterColor(color, 70);
			events[i].textColor = darkenColor(color, -0.5);
		}
		events[i].start = toTimeZone(events[i].start, tz_offset);
		events[i].end = toTimeZone(events[i].end, tz_offset);
		events[i].id = events[i].server_id;
	}
	return events;
}

function dayClickCallback(date){
	slotMoment = date;
	$("#calendar-dashboard").on("mousemove", forgetSlot);
}

function forgetSlot(){
	slotMoment = null;
	$("#calendar-dashboard").off("mousemove", forgetSlot);
}
