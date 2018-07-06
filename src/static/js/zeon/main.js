
var CTRL_IS_PRESSED = false;
const NEW_NOTIFICATION_AUDIO = '/static/media/audio/new_message_notification';
const REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
				  
EventTypes = {
    SEND_MESSAGE : 1,
    DELETE_MESSAGE : 2,
    UPDATE_CONTACT : 3,
    UPDATE_CONTACT_PHONE : 4,
    DELETE_CONTACT : 5,
    DELETE_CONTACT_PHONE : 6,
    CREATE_CONTACT : 7,
    CREATE_CONTACT_PHONE : 8,
    DELETE_CONTACT_EMAIL : 9,
    UPDATE_CONTACT_EMAIL : 10,
    CREATE_CONTACT_EMAIL : 11,
    DELETE_CALL_LOG : 12,
    CALL_REJECT : 13,
    DECLARE_SMS_AS_READ : 14,
    NEW_MESSAGE : 15,
    CALL_START : 16,
    CALL_ANSWER : 17,
    CALL_END : 18,
    CALL_MUTE : 19,
    CALL_UNMUTE : 20,
	CALENDAR_EVENT_CREATE: 21,
	CALENDAR_EVENT_DELETE: 27,
	LOG_OUT: 1000,
	CREATE_UPDATE_CONTACT: 1002
}

var TODAY = new Date();

CalendarEventStatus = {
	TENTATIVE: 0,
    CONFIRMED: 1,
    CANCELLED: 2
}

var FILTER_DATA = null;
var NEW_EMAIL_TO_SLCTZ,
	NEW_SMS_SLCTZ,
	CALENDAR_GUESTS_SLCTZ;
var RECURRING_RULE = null;

$(function(){
	
	"use strict"
	
	var config = {
			apiKey: "AIzaSyCvt-sddXFg7Kjrttu42O6nagQIbo58bbY",
			authDomain: "android-blend-4b456.firebaseapp.com",
			databaseURL: "https://android-blend-4b456.firebaseio.com",
			projectId: "android-blend-4b456",
			storageBucket: "android-blend-4b456.appspot.com",
			messagingSenderId: "1024370094646"
		};
	firebase.initializeApp(config);
	
	const messaging = firebase.messaging();
	
	messaging.requestPermission().then(function() {
		console.log('Notification permission granted.');
		return messaging.getToken();
	}).then(function(token){
		$.post('/a_send_web_notification_token/', {'fcm_token_web': token});
		
	}).catch(function(err){
		console.log(err);
	});
	
	messaging.onMessage(function(payload) {
		process_notification(payload);
	});
	// hide elements on outside click
	$(window).click(function() {
		$('._autoclose').addClass('dn');
	});
	
	// $('.endless_page_template').endlessPaginate({paginateOnScroll: true}); // needed for the case of plain-vanilla (non-Ajax) load
	
	// Adjust default date time
	// SETTINGS.CALENDAR.DEFAULT_DATETIME.setHours(9);
	// SETTINGS.CALENDAR.DEFAULT_DATETIME.setMinutes(0);
	// SETTINGS.CALENDAR.DEFAULT_DATETIME.setSeconds(0);
	
	// get_login_status();
	// $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
	window.onpopstate = function(e){
		if(e.state){
			document.getElementById("content").innerHTML = e.state.html;
			document.title = e.state.pageTitle;
		}
	};

	var $content_wrapper = $('#content-wrapper');
	load_ajax_content();
	
	var modal_wrapper = $('#modals-wrapper');
	
	formset_listeners($content_wrapper);
	standard_listeners($content_wrapper);
	
	formset_listeners(modal_wrapper);
	standard_listeners(modal_wrapper);
	
	CTRL_IS_PRESSED = false;
	
	if ($('#id_to').length){
	// It might happen that the user does not have any email account
		NEW_EMAIL_TO_SLCTZ = $('#id_to').selectize({
			create: true,
			openOnFocus: false,
			valueField: 'email',
			searchField: ['name', 'email'],
			options: emails,
			plugins: ['remove_button'],
			closeAfterSelect: true,
			render: {
				item: function(item, escape){
						return '<div style = "font-size: 100%"><span style = "text-transform:uppercase;">' + item.name + '</span><span style = "font-style: italic"> (' + item.email + ')</span></div>';
				},
				
				option: function (item, escape) {
					return '<div style = "font-size: 100%"><span>' + item.name + '</span><span style = "font-style: italic"> ' + item.email + '</span></div>';
				}
			}
		})[0].selectize;
	}
	
	NEW_SMS_SLCTZ = $('#sms-to').selectize({
		
		openOnFocus: false,
		valueField: 'number',
		searchField: ['name', 'number'],
		options: user_contact_numbers,
		create: true,
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
								item.name + '</span><span style = "font-style: italic"> (' + item.number + ')</span></div>';
				}
				else {
					return '<div class="fs13"><span style = "font-style: italic"> ' + item.number + '</span></div>';
				}
			},
			
			option: function (item, escape) {
				if (item.photo_name) {
					return '<div class="fs13"><img src="' + "/a_get_contact_photo/" + item.photo_name + '/"><span>' + 
							item.name + '</span><span style = "font-style: italic"> ' + item.number + '</span></div>';
				}
				else {
					return '<div class="fs13"><span>' + 
							item.name + '</span><span style = "font-style: italic"> ' + item.number + '</span></div>';
				}
			}
		}
	})[0].selectize;
	
	$('#sidebar li a').on('click', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		history.pushState({ foo: "bar" }, "page 2", url);
		var $li = $(this).closest('li');
		$('.nav__item a').removeClass('active');
		$(this).addClass('active');
		get_adjusted(url, function(response){	
			FILTER_DATA = null;
			
			$content_wrapper.html(response.template);	
			
			if (get_active_sidebar_tab() == '_calendar'){
				initiate_calendar();
			}
			else if (get_active_sidebar_tab() == '_home'){
				initiate_hub();
			}
			else{
				endlessPaginate();
			}
			
		});
	});
	
	$("#new-email-popup-large-form").submit(function(e){
		e.preventDefault();
		send_quick_email($(this));
	});
	
	// $('.scrollbar-inner').scrollbar();
	// show_default_page();
    $(document).on('click', '#add-to-contacts-btn', function(e){
		var $form = $('#add-contact-modal');
		$form.find('#new-phone-number').click();
		$form.data('caller', $(this).data('caller'));
		var phone_number = $(this).data('number');
		$form.find('#id_phone-create-0-number').val(phone_number);
		$form.modal('show');
		$form.find('#id_name').focus();
	});
	
	$(document).on('change', '.upload_form .upload_source', function(){
		$(this).closest('form').submit();
	});
	
	$(document).on('click', '#add_email_account', function(){
		$('#add_email_account_form').modal('show');
	});
	
	$(document).on('click', '._send_message', function(){
		var $triggered_elem = $(this);
		var caller_type = $triggered_elem.data('caller-type');
		var $li = $(this).closest('li');
		var modal_id = $triggered_elem.data('target');
		$(modal_id).on('show.bs.modal', function(event) {
			var head = $triggered_elem.data('head') // Extract info from data-* attributes
			var modal = $(this);
			modal.find('.modal-title').text(head);
			modal.find('[type=submit]').attr('data-caller-type', d);
			// $('#new_message_text').text('');
			var $new_message_recipients = $('#new_message_recipient_wrap #recipients')[0].selectize;
			if(caller_type === 'contact'){	
				$new_message_recipients.setValue($li.find('.contact_value').text());
			}
			if(caller_type === 'send_contact'){
				var contact_info = get_contact_info();
				modal.find('#new_message_text').text('Edgar');
			}
		}).modal({backdrop:'static',keyboard:false});
	});
	
	$(document).on('submit', '#add_email_account_form', function(e){
		e.preventDefault();
		var $form = $(this);
		var params = {'data': $(this).serialize(),
					  'form': $form}
					  
		post_adjusted('/a_email_add_account/', params, function(response){
			$('#bound_emails_list').append(response.template);
			// $form.modal('hide');
		});
	});	
	
	endlessPaginate();

	$( "#rest_requests_container" ).scroll(function() {
		var margin = 20
		if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
			$("a.endless_more").click();
		}
	});

	$('#settings').on('click', function(e){
		e.preventDefault();
		
		var url = $(this).attr('href');
		history.pushState({ foo: "bar" }, "page 2", url);
		$('#sidebar li').removeClass('selected');
		$wrap.html('');
		$wrap.find('div.ajax_loader').css('display', 'block');
		zeon_get(url, undefined, undefined, function(response){
			$content_wrapper.html(response.template);
			
		});
	});
	
	$(document).on('keydown', '#new_message_text', function(){
		var $form = $(this).closest('form');
		var $button = $form.find('[type = submit]');
		var $recipients = $form.find('#recipients');
		var $new_message_text = $form.find('#new_message_text');
		if ($recipients.val() && $new_message_text.text() !== ''){
			$button.removeClass('disabled');
		}
		else{
			$button.addClass('disabled');
		}
	});
	
	$(document).on('change', '#recipients', function(){
		control_submit_button_state();
	});
	
	$(document).on('keyup', '#new_message_text', function(e) {
		control_submit_button_state();
	});
	
	$("#_delete_user_account").click(function(e) {
		var url = '/delete_account/';
		$.post(url, function(response){
			window.location.href = response;
		});
	});
	
	$("#_delete_user_account").click(function(e) {
		var url = '/delete_account/';
		$.post(url, function(response){
			window.location.href = response;
		});
	});
	
	// --------------------------------------------------  REGISTRATION AND AUTHORIZATION -----------------------------------------------
	
	$('#main_page_registration_btn').click(function(){
		$('#main_page_registration_form').modal({backdrop: 'static', keyboard: false});
	});
	
	$('#main_page_registration_confirm_btn').click(function(){
		var $user_form = $('#user_form');
		var $button = $(this);

		var data = $user_form.serialize();
		var url = '/prepare_account_activation_key/';
		zeon_post(url, data, $user_form, $button, function(response){
			$('#user_activation_key_form').fadeIn();
			$user_form.find('input').prop('readonly', true);
			$button.closest('.form-group').css('display', 'none');
			$.post('/send_account_confirmation_letter/', data);
		});
	});
	
	$('#main_page_confirm_activation_key_btn').click(function(){
		var $user_form = $('#user_form');
		var $user_activation_key_form = $('#user_activation_key_form');
		var $button = $(this);
		var data =  $user_form.serialize()  + '&' + $user_activation_key_form.serialize();
		
		zeon_post('/activate_user/', data, $user_form, $button, function(response){
			$('#main_page_registration_form').modal('hide');
			 window.location.href = response;
		});
	});
	
	$('#register_change_user_info').click(function(){
		$('#user_activation_key_form').css('display', 'none');
		$('#user_form').find('input, button').prop('readonly', false);
		$('#main_page_registration_confirm_btn').closest('.form-group').css('display', 'block');
	});
	
	// --------------------------------------------------  REGISTRATION AND AUTHORIZATION -----------------------------------------------
	
	$('#send-sms-form').submit(function(e){
		e.preventDefault();
		e.stopPropagation();
		var $form = $(this);
		
		
		var numbers = NEW_SMS_SLCTZ.getValue();
		if (numbers === '') {
			alert(gettext('Please specify at least one recipient'));
			return;
		}
		var data = {'numbers': numbers,
				    'text': $form.find('#sms-text').val()}
		if($('input[name="new-sms-sim-card-option"]').length){ // && $contenteditable.data('android-version') >= 22
			data['sim_card_id'] = $('input[name="new-sms-sim-card-option"]:checked').val();
		}
		$('#sms-modal').modal('hide');
		var timeout_id;
		var timeout_expired = 0;
		var timeout_seconds = 3*timeout_expired;	
		var timer = function(){
			if (timeout_seconds > 0){
				timeout_seconds--;
				var delay_message = gettext('Message will be sent in') + ' ' + timeout_seconds.toString() + ' ' + gettext('seconds');
				show_notification(delay_message, NOTIFICATION_STATUS.SUCCESS, gettext('Cancel'), function(e) { 
									clearTimeout(timeout_id);
									hide_notification();
									$('#sms-modal').modal();
								});
				
				timeout_id = setTimeout(function(){
					timer();
				}, 1000);
			}
			else {
				show_notification(gettext('Sending the sms...'), NOTIFICATION_STATUS.IN_PROCESS);
				var params = {'data': data};
				post_adjusted('/send_sms/', params, function(response){
					var envelopes_html = response.envelopes;
					show_notification(gettext('Sms has been sent.'), NOTIFICATION_STATUS.SUCCESS, gettext('View message'), function(e) { alert('Функция пока не готова')});
					append_new_dialogs(envelopes_html);
					
					var active_dialog_id = $('#dialog-list-container').find('.active').data('dialog-id');
					if (active_dialog_id){
						$(envelopes_html).each(function() {
							if ($(this).data('dialog-id') == active_dialog_id){
								$('#dialog-history-wrapper .scroller-block').append(response.message);
							}
						});
					}
				});
			}
		}
		timer();
	});
	
	$(document).on('click', '#current_call_reject_by_sms', function(e){
		var $wrap = $(this).closest('#current-call-wrap');
		var data = {'id': $wrap.data('id')}
		
		zeon_post('/a_call_reject/', data , undefined, undefined, function(e){
			$wrap.css('display', 'none');
			var mobile_call_audio = $('#mobile_call_audio')[0];
			mobile_call_audio.pause();
			mobile_call_audio.currentTime = 0;
		});
		
		var modal_id = '#new_message_form';
		$(modal_id).on('show.bs.modal', function(event) {
			var head = gettext('New sms');
			var modal = $(this);
			modal.find('.modal-title').text(head);
			var $new_message_recipients = $('#new_message_recipient_wrap #recipients')[0].selectize;
			if ($wrap.find('.name').length == 0) {
				$new_message_recipients.addOption({counterparty_number: $wrap.find('.contact_value').text()});
			}
			// $new_message_recipients.setValue($wrap.find('.contact_value').text());
		}).modal({backdrop:'static',keyboard:false});
	});
	
	$(document).on('click', '#current_call_reject', function(e){
		var $wrap = $('#current-call-wrap');
		var data = {'id': $wrap.data('id')}
		
		zeon_post('/a_call_reject/', data , undefined, undefined, function(e){
			$wrap.css('display', 'none');
			var mobile_call_audio = $('#mobile_call_audio')[0];
			mobile_call_audio.pause();
			mobile_call_audio.currentTime = 0;
		});
	});
	
	$(document).on('click', '#current_call_mute', function(e){
		var $wrap = $('#current-call-wrap');
		var mute = $('#current-call-wrap').data('mute');
		var data = {'id': $wrap.data('id'),
		            'mute': mute}
		zeon_post('/a_call_mute/', data , undefined, undefined, function(e){
			var mobile_call_audio = $('#mobile_call_audio')[0];
			mobile_call_audio.pause();
			mobile_call_audio.currentTime = 0;
		});
	});
	
	$('#_contact-create-form').submit(function(e) {
		e.preventDefault();
		var $form = $('#add-contact-modal');
		var params = {'data': $(this).serialize(),
					  'form': $form};
		var url = $(this).attr('action');
		show_notification(gettext('Creating contact...'), NOTIFICATION_STATUS.IN_PROCESS);
		
		var caller = $form.data('caller');
		var targetNumbers = $form.find('.phone-number:not(.dn) input[type="text"]');
		var contactName = $form.find('#id_name').val();
		post_adjusted(url, params, function(response){
			show_notification(gettext('Contact created'), NOTIFICATION_STATUS.SUCCESS);
			switch(caller) {
				case 'dialogs':
					updateSmsPageForContactChanges(targetNumbers, contactName);
					break;
				case 'contacts':
					createContactFromContactPage();
					break;
				case 'call_logs':
					createContactFromCallLogPage();
				default:
					alert('Contact saved from unknown page');
			}
			$form.modal('hide');
		});
	});
	
	function createContactFromContactPage(){
		show_notification(gettext('Contact has been created'), NOTIFICATION_STATUS.SUCCESS);
		$('#contact-list-container ._open-contact').each(function() {
			if ($(this).find('.name').text().toUpperCase() > $(response.template).find('.name').text().toUpperCase()) {
				var $element = $(response.template);
				if (!$('#contact-list-container .open-contact.active').length){
					$element.addClass('active');
				}
				$element.insertBefore($(this));
				return false;
			}
		});
		increment_contact_counter();
	}

	function updateSmsPageForContactChanges(targetNumbers, contactName){
		$('._open-dialog-history').each(function(){
			var $dialog = $(this);
			var targetNumber = null;
			targetNumbers.each(function(){			
				targetNumber = $(this).val();
				updateDialogCounterparties($dialog, targetNumber, contactName);
			});
		});
	}

	function createContactFromCallLogPage(){
		alert('Creating contact from call logs');
	}

	function get_login_status(){
		get_adjusted('/check_login_status/', function(response){
			if (response == false) {
				window.location = '/';
			}
			else {
				setTimeout( get_login_status, 3000 );
			}
		});
	}
	
	function load_ajax_content(){
		var current_url = window.location.pathname;
		if (current_url == '/calendar/'){ 
			get_adjusted(current_url, function(response){
				$content_wrapper.html(response.template);
				initiate_calendar();
				
			});
			
		}
		else if (current_url == '/home/') {
			get_adjusted(current_url, function(response){
				$content_wrapper.html(response.template);
				endlessPaginate({'paginateOnScroll': false});
				initiate_hub();
			});
		}
		else {
			get_adjusted(current_url, function(response){
				$content_wrapper.html(response.template);
				endlessPaginate();
			});
		}
	}
	
	/*
	window.setInterval(function(){
		var sidebar_tab = get_active_sidebar_tab();
		$.get('/a_get_unsatisfied_events/', function(response){		
			if (response.object.length !== 0)
				$.each(response.object, function(){
					if (this.event_type_id == 16){
						if ($('.current-call-wrap[data-id = ' +  this.temp__call_id + ']').length == 0){
							new_call(this.data);
						}
					}
					else if (this.event_type_id == 17){
						$('#corner_message').html(this.data);
						var mobile_call_audio = $('#mobile_call_audio')[0];
						mobile_call_audio.pause();
						mobile_call_audio.currentTime = 0;
					}
					else if (this.event_type_id == 18){
						if ($('.current-call-wrap[data-id = ' +  this.temp__call_id + ']').length != 0){
							// $('.current-call-wrap[data-id = ' +  this.temp__call_id + ']').remove();
							$('#corner_message').css('display', 'none');
							var mobile_call_audio = $('#mobile_call_audio')[0];
							mobile_call_audio.pause();
							mobile_call_audio.currentTime = 0;
						}
					}
				});
			else {
				$('#corner_message').css('display', 'none');
				var mobile_call_audio = $('#mobile_call_audio')[0];
				mobile_call_audio.pause();
				mobile_call_audio.currentTime = 0;
			}
		});			
	}, 1000);
	*/
	
	function initiate_hub(){
		endlessPaginate();
		get_adjusted('/call_logs_for_home/', function(response){
			$('#call-logs-list-wrapper').html(response.template).endlessPaginate();
		});
	}
});

function endlessPaginate(options) {
	var defaults = {
		paginateOnScroll: true
	}
			
	var settings = $.extend(defaults, options);
	
	$('.endless_page_template').endlessPaginate({paginateOnScroll: settings.paginateOnScroll}); // needed for Ajax load
	var margin = 20;
	$(".endless_page_template").on( 'scroll', function(){
		if ($(this).height() - $(window).height() - $(window).scrollTop() <= margin) {
			$("a.endless_more").click();
		}
	});
}
	
function send_quick_email($form) {
	var $url = $form.attr("action"); 
	var params = {'data': $form.serialize()};
	$form.modal('hide');
	('Sending the message...', NOTIFICATION_STATUS.IN_PROCESS);
	
	post_adjusted($url, params, function(response) {
		show_notification('Message has been sent.', NOTIFICATION_STATUS.SUCCESS, 'View message', function(e) { alert('Функция пока не готова')});
	});
	
	var timeout_expired;
	var timeout_seconds;
	if (get_user_setting_value('SEND_MESSAGE_WITH_DELAY') === '1'){
		timeout_expired = 0
		timeout_seconds = 10
	}
	else {
		timeout_expired = 1
		timeout_seconds = 0
	}
		
	var params = {'data': {'numbers': '091413544',
						   'text': $form.find('#sms-text'),
				           'timeout_expired': timeout_expired}}
	/*
	if($contenteditable.data('sim-count') > 1 && $contenteditable.data('android-version') >= 22){
		data['user_sim_card_id'] = $('input[name="optradio"]:checked').val();
	}
	else {
		data['user_sim_card_id'] = 1;
	}
	*/
			
	zeon_post('/a_dialog_send/', params, function(response){
		$form.modal('hide');
		
		var timeout_id;
		var caller_type = $button.data('caller-type'); 		
		var timer = function(){
		
			if (timeout_seconds > 0){
				timeout_seconds--;
				set_fixed_middle_note(response.delayed_message_fixed_template);
				$('#fixed-middle-note').attr('data-message_sms_id_list', response.message_sms_id_list);
				$('#fixed-middle-note').find('#delayed_message_seconds').text(timeout_seconds);
				timeout_id = setTimeout(function(){
					timer();
				}, 1000);
			}
			else {
				hide_fixed_middle_note();
				set_message_timeout_expired(response.template, response.message_sms_id_list);
			}
		}
		timer();
		$(document).on('click', '#fixed-middle-note .undo', function(e){
			e.preventDefault();
			hide_fixed_middle_note();	
			clearTimeout(timeout_id);
		});
		
		$(document).on('click', '#fixed-middle-note .send_now', function(e){
			hide_fixed_middle_note();
			set_message_timeout_expired(response.template, response.message_sms_id_list, caller_type);
			clearTimeout(timeout_id);
		});
	});
}

function get_contact_pdf_format(){
	var name = $('#contact_view_name').text();
	
	
	var rs = name + '\n';
			 
}

function new_tasks(){
	$.post('/a_task_unrendered/', function(response){
		if (response.object.hasOwnProperty('title')) {
			if (sidebar_tab === 'l_tasks'){
				$('#own_tasks_list').prepend(response.object.tasks);
				$('#tasks_all_list').prepend(response.object.tasks);
				refresh_task_counters()
			}
			else {
				desktop_notification(response.object.title, response.object.body, undefined, NEW_MESSAGE_NOTIFICATION);
			}
			edit_sidebar_counter('l_tasks', response.object.count);
		}
	});
}

function new_call(data){
	var template = data.template_page;
	var incoming_outcoming = data.incoming_outcoming;
	$('#corner_message').html(template)
						.css('display', 'block');
	if (incoming_outcoming == 'I') {
		var mobile_call_audio = $('#mobile_call_audio')[0];
		mobile_call_audio.play();
	}
	else {
		return;
	}
}

function edit_sidebar_counter(tab_id, number){
	var $counter_wrap = $('#' + tab_id + ' .news_counter');
	var new_cnt = parseInt($counter_wrap.html());
	new_cnt = new_cnt + number;
	$counter_wrap.html(new_cnt);
	if (new_cnt > 0){ 
		$counter_wrap.css('display', 'block');
	}
	else {
		$counter_wrap.css('display', 'none');
	}		
}

function show_default_page(){
	var url = $('#sidebar').find('.selected a').attr('href');
	$content_wrapper.find('div.ajax_loader').css('display', 'block');
	zeon_get(url, undefined, undefined, function(response){
		$content_wrapper.html(response.template);
	});
}

function get_active_sidebar_tab(){
	return $('#sidebar').find('.active').parent().attr('id');
}

function control_submit_button_state(){
	var $text_div = $('#new_message_text');
	var modal = $text_div.closest('form.modal');
	var $new_message_recipients = $('#new_message_recipient_wrap #recipients')[0].selectize;
	if ($text_div.text() !== '' && $new_message_recipients.getValue() !== '') {
		modal.find('[type = submit]').removeClass('disabled');
	}
	else {
		modal.find('[type = submit]').addClass('disabled');
	}
}

function set_fixed_middle_note(text){	
	var $fixed_middle_note = $('#fixed-middle-note');
	$fixed_middle_note.html(text);
	$fixed_middle_note.css('visibility', 'visible');					
}

function hide_fixed_middle_note(){
	var $fixed_middle_note = $('#fixed-middle-note');
	$fixed_middle_note.css('visibility', 'hidden');
}

$.fn.get_attr = function(attr){
	var $attr_host;
	$attr_host = this.find('[' + attr + ']');
	if ($attr_host.length > 0){
		return $attr_host.attr(attr);
	}
	
	$attr_host = this.closest('[' + attr + ']');
	
	return $attr_host.attr(attr);
}

function get_user_setting_value (setting){
	for (i = 0; i < user_settings.length; i++) {
		if (user_settings[i].id === setting){
			return user_settings[i].value
		}			
	}
}

function desktop_notification(title, body, icon, audio) {
	icon = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Clock_simple.svg/120px-Clock_simple.svg.png"
	$.playSound(audio);
	Notification.requestPermission(function (perm) {
		if (perm == "granted") {
			var notification = new Notification(title, {
				dir: "auto",
				lang: "hi",
				tag: "Edgar",
				icon: icon,
				iconUrl: icon, 
				body: body
			});
			notification.onshow = function(){
				setTimeout(function(){
					// self.close();
				}, 2000);
			}
		}
	});
}

function upload(e) {
	e.preventDefault();
	var data = new FormData($('form').get(0));

	$.ajax({
		url: $(this).attr('action'),
		type: $(this).attr('method'),
		data: data,
		cache: false,
		processData: false,
		contentType: false,
		success: function(data) {
			alert('Files uploaded');
		}
	});
	return false;
}

function process_notification(payload) {
    var data = payload.data;
	localCache = [];
	
	switch (parseInt(data.event_id)){
		case EventTypes.CALL_START:
			new_call(data);
			break;
		case EventTypes.CALL_ANSWER:
			$('#corner_message').html(payload.data.template_page);
			var mobile_call_audio = $('#mobile_call_audio')[0];
			mobile_call_audio.pause();
			mobile_call_audio.currentTime = 0;
			break;
			
		case EventTypes.CALL_END:
			$('#corner_message').css('display', 'none');
			var mobile_call_audio = $('#mobile_call_audio')[0];
			mobile_call_audio.pause();
			mobile_call_audio.currentTime = 0;
			break;
		
		case EventTypes.NEW_MESSAGE:
			if (get_active_sidebar_tab() == '_dialogs') {
				append_new_dialogs(payload.data.template_page);
			}
			
			else {
				localCache = [];// $("ul.chat_box").append(payload.data.template_chat);
			}
			var newSmsCount = parseInt($(payload.data.template_page).length);
			changeUnreadSmsCounterBy(newSmsCount);
			$.playSound(NEW_NOTIFICATION_AUDIO);
			break;
		
		case EventTypes.CALENDAR_EVENT_CREATE:
			if ($('#calendar-dashboard').length === 1) {
				$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
				/*
				var events = JSON.parse(data.events);
				var events_with_original_id = JSON.parse(data.events_with_original_id);
				for (var i = 0; i < events.length; i++) {
					$("#calendar-dashboard").fullCalendar('removeEvents', [events[i].id.toString()]);
				};
				var calendar = $('#calendar-dashboard').fullCalendar('getCalendar');
				var view = calendar.view;
				var start = view.start._d;
				var end = view.end._d;
				var events = new_events_json(events, events_with_original_id, start, end);
				
				for (var i = 0; i < events.length; i++) {
					$("#calendar-dashboard").fullCalendar('renderEvent', events[i], false);
				};
				*/
			}
			break;
		
		case EventTypes.CALENDAR_EVENT_DELETE: 
			if ($('#calendar-dashboard').length === 1) {
				$('#calendar-dashboard').fullCalendar( 'refetchEvents' );
				break;
				/*
				var event_ids = JSON.parse(data.event_ids);
				for (var i = 0; i < event_ids.length; i++) {
					$("#calendar-dashboard").fullCalendar('removeEvents', [event_ids[i].toString()]);
				}
				*/
			}
			break;
		
		case EventTypes.LOG_OUT:
			$('#log-out-btn').click();
			break;
		
		case EventTypes.UPDATE_CONTACT:
			if (get_active_sidebar_tab() === '_contacts') {
				
				var editable_contact_id = $('#_contact-details-wrapper').data('contact-id');	
				$(JSON.parse(data.data)).each(function(){
					var contact_id = this.server_id;
					var $wrapper = $('#contact-list-container [data-contact-id = ' + contact_id +']');
					if ($wrapper.length){
						$wrapper.find('._name').text(this.name);
						$wrapper.find('._company').text(this.company);
						$wrapper.find('._position').text(this.position);
						
						if (editable_contact_id && editable_contact_id == contact_id) {
							if ($('._contact-view-wrapper').is(":visible")) {
								$wrapper.click();
							}
							else {
								show_notification(gettext('This contact has been updated. Please refresh the page...'), NOTIFICATION_STATUS.INFO );
							}
						}
					}
				});
			}
			else if (get_active_sidebar_tab() === '_dialogs') {
				
				$(JSON.parse(data.data)).each(function(){
					var contact_id = this.server_id;
					
					var $contactWrappers = $('#dialog-list-container ._dialog-number [data-contact-id = ' + contact_id +']');
					var contactName = this.name;
					$contactWrappers.each(function(){
						$(this).text(contactName);
					});
					
					$activeDialogContactWrapper = $('#dialog-history-wrapper').find('._name[data-contact-id = ' + contact_id + ']'); 
					if ($activeDialogContactWrapper.length){
						$activeDialogContactWrapper.text(contactName);
					}
					
				});
			}
			
			break;
		
		case EventTypes.DELETE_CONTACT:
			if (get_active_sidebar_tab() == '_contacts') {
				var contactIds = JSON.parse(data.data);
				for (var i = 0; i < contactIds.length; i++){
					var $wrapper = $('#contact-list-container [data-contact-id = ' + contactIds[i] +']');
					$wrapper.remove();
					var editable_contact_id = $('#_contact-details-wrapper').data('contact-id');
					if (editable_contact_id && editable_contact_id == this.server_id) {
						
					}
				}
			}
			break;
			
		default:
			break;
	}
}

function new_events_json(events, events_with_original_id, start, end) {
	var result = [];
	$(events).each(function(i, calendar_event) {
		calendar_event.allDay = calendar_event.all_day;
		
		if (calendar_event.r_rule){
			var options = RRule.parseString(calendar_event.r_rule);
			options.dtstart = new Date(calendar_event.start_date);
			var rule = new RRule(options);
			recurring_dates = rule.between(new Date(start), new Date(end));
			$(recurring_dates).each(function(){
				// exclude event from family that has been edited
				
				var is_out_of_family = false;
				for (i = 0; i < events_with_original_id.length; i++) { 
					var start = new Date(events_with_original_id[i].start);
					var original_instance_time;
					if (events_with_original_id[i].original_instance_time) {
						var original_instance_time = new Date(events_with_original_id[i].original_instance_time)
						original_instance_time = original_instance_time.getTime();
					}
					
					if (events_with_original_id[i].original_id == calendar_event.external_id.toString() && 
						(start.getTime() == this.getTime() || original_instance_time == this.getTime())){
						is_out_of_family = true;
						break;
					}
				}
				
				if (!is_out_of_family) {
					// https://stackoverflow.com/questions/47090648/pushing-elements-into-array-leads-to-modification-of-the-previous-elements/47090730#47090730
					var instance = jQuery.extend(true,{},calendar_event);
					instance.start = this;
					instance.end = this;
					result.push(instance);
				}
			});
		}
		else {
			//if (calendar_event.status != CalendarEventStatus.CANCELLED) {
				result.push(calendar_event);
			//}
		}
	});
	return result;
}

function dialog_info(msg) {
	alert(gettext(msg));
}

$.fn.extend({
	select_date: function() {
		return this.each(function() {
			this.datetimepicker({      
				beforeShow: function(input, inst) {
					$('#ui-datepicker-div').addClass(className);
				},
				dayNamesMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
				altRedirectFocus: false,
				timeInput: true,
				altField: "#" + startDateId + "-time",
				dateFormat: SETTINGS.DATE_FORMAT,
				timeFormat: SETTINGS.TIME_FORMAT,
				showOtherMonths: true,
				onClose: function(dateText, inst) {
					return false;
				},
				onSelect: function(dateText) {
					return false;
				}
			});
		});
	}
});

function toTimeZone(time, minutesZoneOffset) {
 
	var t = new Date(time)
	var t_offset = new Date(t.getTime() + (minutesZoneOffset*60*1000)); 
	var year = t_offset.getUTCFullYear();
	var month = t_offset.getUTCMonth();
	var date = t_offset.getUTCDate();
	var hour = t_offset.getUTCHours();
	var minutes = t_offset.getUTCMinutes();
	var seconds = t_offset.getUTCSeconds();
	var utcDateStr = dateStrFromParts(year, month, date, hour, minutes, seconds);
	return utcDateStr;
}

function dateStrFromParts(year, month, date, hour, minutes, seconds) {
	month +=1;
	return year + '-' + 
		  (month < 10 ? '0' + month : month) + '-' + 
		  (date < 10 ? '0' + date : date) + ' ' + 
		  (hour < 10 ? '0' + hour : hour)+ ':' + 
		  (minutes < 10 ? '0' + minutes : minutes) + ':' +
		  (seconds < 10 ? '0' + seconds : seconds);
}

function hideEmptyWrapper($wrapper) {
	$wrapper.find('._empty-content-wrapper').addClass('dn');
}

function showEmptyWrapper($wrapper) {
	$wrapper.find('._empty-content-wrapper').removeClass('dn');
}

function dateToServerFormat(dateObj) {
	var year = dateObj.getFullYear();
	var date = ('0' + dateObj.getDate()).slice(-2);
	var month = ('0' + (dateObj.getMonth()+1).toString()).slice(-2); //Months are zero based
    var hour = ('0' + dateObj.getHours().toString()).slice(-2);
	var minute = ('0' + dateObj.getMinutes().toString()).slice(-2);
	var second = ('0' + dateObj.getSeconds().toString()).slice(-2);
	return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

function dateToUnixFormat(dateObj) {
	var year = dateObj.getFullYear();
	var date = ('0' + dateObj.getDate()).slice(-2);
	var month = ('0' + dateObj.getMonth()+1).slice(-2); //Months are zero based
    return year + month + date + 'T040000z';
}


// ---------------------------------    RRULE     --------------------------------------------------
function dateTimepickerFromTo( startDateId, endDateId, className, startDateInitial, endDateInitial){
	var $startDateInput = $('#' + startDateId),
		$startTimeInput = $('#' + startDateId + '-time'),
		$endDateInput = $('#' + endDateId),
		$endTimeInput = $('#' + endDateId + '-time');
		
	// Date time picker from-to call
	
	$startTimeInput.timepicker({
		timeFormat: SETTINGS.TIME_FORMAT
	});
	$endTimeInput.timepicker({
		timeFormat: SETTINGS.TIME_FORMAT
	});
	
	$startDateInput.datetimepicker({
		beforeShow: function(input, inst) {
			$('#ui-datepicker-div').addClass(className);
		},
		firstDay: SETTINGS.CALENDAR_WEEK_START,
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		altField: "#" + startDateId + "-time",
		dateFormat: SETTINGS.DATE_FORMAT,
		timeFormat: SETTINGS.TIME_FORMAT,
		showOtherMonths: true,
		timeInput: true,
		altRedirectFocus: false,
		onClose: function(dateText, inst) {
			return false;
		},
		onSelect: function(dateText) {
			return false;
		}
		
	});
	
	$endDateInput.datetimepicker({
		beforeShow: function(input, inst) {
			$('#ui-datepicker-div').addClass(className);
		},
		firstDay: SETTINGS.CALENDAR_WEEK_START,
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		altField: "#" + endDateId + "-time",
		dateFormat: SETTINGS.DATE_FORMAT,
		timeFormat: SETTINGS.TIME_FORMAT,
		showOtherMonths: true,
		timeInput: true,
		altRedirectFocus: false,
		onClose: function(dateText, inst) {
			return false;
		},
		onSelect: function(dateText) {
			return false;
		}
		
	});
	
	$startDateInput.on('change', function(e){
		var startDate = $startDateInput.datetimepicker('getDate');
		var endDate = $endDateInput.datetimepicker('getDate');
		
		// $endDateInput.datetimepicker('option', 'minDate', startDate ); //
		if (!endDate || startDate > endDate) {
			endDate = new Date(startDate.getTime() + SETTINGS.CALENDAR_DEFAULT_DURATION*60000);
			$endDateInput.val($.datepicker.formatDate( SETTINGS.DATE_FORMAT, endDate));
			var hour = endDate.getHours();
			var minute = endDate.getMinutes();
			// var timezone = -(endDate.getTimezoneOffset()/60)
			$endTimeInput.val($.datepicker.formatTime( SETTINGS.TIME_FORMAT, {hour: hour, minute: minute}));
		}
		
		// Bullshit code
		$('#id_create-event-start_date').val(dateToServerFormat(startDate));
		$('#id_create-event-end_date').val(dateToServerFormat(endDate));
		$('#id_update-event-start_date').val(dateToServerFormat(startDate));
		$('#id_update-event-end_date').val(dateToServerFormat(endDate));
		
		if (RECURRING_RULE) {
			RECURRING_RULE.dtstart = dateToUnixFormat(startDate); 
		}
	});
	
	$startTimeInput.on('change', function(e){
		var startDate = $startDateInput.datetimepicker('getDate');
		var endDate = $endDateInput.datetimepicker('getDate');
		
		// $endDateInput.datetimepicker('option', 'minDate', startDate ); //
		if (!endDate || startDate > endDate) {
			endDate = new Date(startDate.getTime() + SETTINGS.CALENDAR_DEFAULT_DURATION*60000);
			$endDateInput.val($.datepicker.formatDate( SETTINGS.DATE_FORMAT, endDate));
			var hour = endDate.getHours();
			var minute = endDate.getMinutes();
			// var timezone = -(endDate.getTimezoneOffset()/60)
			$endTimeInput.val($.datepicker.formatTime( SETTINGS.TIME_FORMAT, {hour: hour, minute: minute}));
		}
		// Bullshit code
		$('#id_create-event-start_date').val(dateToServerFormat(startDate));
		$('#id_create-event-end_date').val(dateToServerFormat(endDate));
		$('#id_update-event-start_date').val(dateToServerFormat(startDate));
		$('#id_update-event-end_date').val(dateToServerFormat(endDate));
	});
	
	$endDateInput.on('change', function(e){
		var startDate = $startDateInput.datetimepicker('getDate');
		var endDate = $endDateInput.datetimepicker('getDate');
		
		// $endDateInput.datetimepicker('option', 'minDate', startDate ); //
		if (!endDate || startDate > endDate) {
			startDate = new Date(endDate.getTime() - SETTINGS.CALENDAR_DEFAULT_DURATION*60000);
			$startDateInput.val($.datepicker.formatDate( SETTINGS.DATE_FORMAT, startDate));
			var hour = startDate.getHours();
			var minute = startDate.getMinutes();
			$startTimeInput.val($.datepicker.formatTime( SETTINGS.TIME_FORMAT, {hour: hour, minute: minute}));
		}
		// Bullshit code
		$('#id_create-event-start_date').val(dateToServerFormat(startDate));
		$('#id_create-event-end_date').val(dateToServerFormat(endDate));
		$('#id_update-event-start_date').val(dateToServerFormat(startDate));
		$('#id_update-event-end_date').val(dateToServerFormat(endDate));
	});
	
	$endTimeInput.on('change', function(e){
		var startDate = $startDateInput.datetimepicker('getDate');
		var endDate = $endDateInput.datetimepicker('getDate');
		
		// $endDateInput.datetimepicker('option', 'minDate', startDate ); //
		if (!endDate || startDate > endDate) {
			startDate = new Date(endDate.getTime() - SETTINGS.CALENDAR_DEFAULT_DURATION*60000);
			$startDateInput.val($.datepicker.formatDate( SETTINGS.DATE_FORMAT, startDate));
			var hour = startDate.getHours();
			var minute = startDate.getMinutes();
			$startTimeInput.val($.datepicker.formatTime( SETTINGS.TIME_FORMAT, {hour: hour, minute: minute}));
		}
		// Bullshit code
		$('#id_create-event-start_date').val(dateToServerFormat(startDate));
		$('#id_create-event-end_date').val(dateToServerFormat(endDate));
		$('#id_update-event-start_date').val(dateToServerFormat(startDate));
		$('#id_update-event-end_date').val(dateToServerFormat(endDate));
	});

	$startDateInput.datetimepicker('setDate', startDateInitial);
	$endDateInput.datetimepicker('setDate', endDateInitial);
	
	if ($('input[name="all_day"]').is(':checked')) {
		$startTimeInput.addClass('dn');
		$endTimeInput.addClass('dn');
	}
	
	$('input[name="all_day"]').on('change', function(e){
		if ($(this).is(':checked')) {
			$startTimeInput.addClass('dn');
			$endTimeInput.addClass('dn');
		}
		else {
			$startTimeInput.removeClass('dn');
			$endTimeInput.removeClass('dn');
		}
	});
}