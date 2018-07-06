$(function(){
	"use strict"
	/*
	$("#test").endlessPaginate({
								paginateOnScroll: true,
								paginateOnScrollMargin: 100
							   });
	*/
	
	var $content_wrapper = $('#content-wrapper');
	var details_wrapper = $('#_contact-details-wrapper');
	
	$content_wrapper.on('click', '._open-dialog-history', function(e){
		if ($(e.target).is('.checkbox-form input, .checkbox-form label')){
			e.stopPropagation();
			return;
		}
		
		var $selected_dialog = $(this);
		if (CTRL_IS_PRESSED) {
			$selected_dialog.toggleClass('active');
		}
		else {
			open_dialog($selected_dialog);
		}
		
	});
	
	$content_wrapper.on('keyup', '#dialog-search', function(e){
		var $input = $(this);
		
		delay(function(){
			if (keycode_is_letter_or_symbol(e.which)){
				if ($input.val() !== '') {
					// $('#dialog-list-header').addClass('dn');
					filter_dialog_list($input);
				}
				else {
					/* Replace this code. Results should be cached somehow */
					// $('#dialog-list-header').removeClass('dn');
					get_adjusted('/dialogs/', function(response){
						var dialogs_list_html = $(response.template).find('#dialog-list-container').html();
						$('#dialog-list-container').html(dialogs_list_html);
					});
				}
			}
			if ($input.val() === ''){
				FILTER_DATA = null;
			}
		}, 1000 );

	});

	$content_wrapper.on('click', '#new-sms-btn', function(e){
		e.preventDefault();
		var form = $('#sms-modal');
		clear_standard_fields(form);
		NEW_SMS_SLCTZ.clear();
		form.modal('show');
	});
	
	$content_wrapper.on('click', '#select-dialog-mode', function(e){
		e.preventDefault();
		$('#dialog-list-header').children().not('#dialog-list-toolbar').toggleClass('dn');
		var $container = $('#dialog-list-container');
		$container.find('._open-dialog-history').addClass('accordion-box__title-box--for-checkbox');
		$container.find('.checkbox-form').removeClass('dn');
		$container.addClass('_select-mode');
		var $activeDialog = getActiveDialogEnvelope();
		unselectAllDialogs();
		if ($activeDialog) {
			$activeDialog.find('input[type="checkbox"]').prop('checked', true);
		}
		$('#dialog-list-toolbar').removeClass('dn');
	});
	
	$content_wrapper.on('click', '._open-dialog-history > .checkbox-form input', function(e){
		e.stopPropagation();
		
		if ($('#dialog-list-container .checkbox-form input:checked').length > 0) {
			$('#dialog-list-toolbar').removeClass('dn');	
		}
		else {
			$('#dialog-list-toolbar').addClass('dn');
		}
		dialogs_selection_info();
	});
	
	$content_wrapper.on('click', '#dialog-cancel-mode', function(e){
		e.preventDefault();
		$('#dialog-list-header').children().not('#dialog-list-toolbar').toggleClass('dn');
		$('#dialog-list-toolbar').addClass('dn');
		var $dialogListWrapper = $('#dialog-list-container');
		
		$dialogListWrapper.find('._open-dialog-history').toggleClass('accordion-box__title-box--for-checkbox');
		$dialogListWrapper.find('.checkbox-form').toggleClass('dn');
		$(this).closest('aside').find('.endless_page_template').toggleClass('_select-mode');
		unselectAllDialogs();
	});
	
	$content_wrapper.on('click', '#dialog-select-all', function(e){
		if ($(this).is(':checked')) {
			$('#dialog-list-container').find('.checkbox-form input[type="checkbox"]').prop('checked', true);
			$('#dialog-list-container').addClass('_all-selected');
			$('#dialog-list-toolbar').removeClass('dn');
		}
		else {
			unselectAllDialogs();
		}
		dialogs_selection_info();
	});
	
	$content_wrapper.on('click', '#_sms-history-toolbar .forward-icon', function(e){
		var forwared_message = '';
		var contact_number = get_active_dialog_number();
		var last_counterparty = '';
		
		get_selected_messages().each(function(){
			if ($(this).hasClass('_inbox')) {
				if (last_counterparty !== contact_number){ 
					forwared_message += contact_number + ':\n'; 
				}
				last_counterparty = contact_number;
			}
			else {
				if (last_counterparty !== 'Me'){ 
					forwared_message += gettext('Me') + ':\n'; 
				}
				last_counterparty = gettext('Me');
			}
			forwared_message += $(this).find('._message-text').text().trim() + ' (' + $(this).data('time') + ')\n\n';
		});
		forwared_message.trim();
		
		showForwardModal(forwared_message);
	});
	
	$content_wrapper.on('click', '#_sms-history-toolbar .remove-icon', function(e){
		var list = [];
		var $selected_messages = get_selected_messages(); 
		var selectedMessagesCounter = $selected_messages.length; 
		
		if (selectedMessagesCounter){
			$selected_messages.each(function() {
				list.push($(this).data('message-id'));
			});
			$selected_messages.remove();
			var dialogMessages = getDialogMessages();
			if (dialogMessages.length == 0) {
				getActiveDialogEnvelope().remove();
				var $wrapper = $('#dialog-history-wrapper');
				noActiveDialogState('on');
			}	
			var params = {'data': {'message_id_list':JSON.stringify(list)}};
			show_notification(gettext('Deleting messages'), NOTIFICATION_STATUS.IN_PROGRESS);
			changeDialogNumberBy(-1);
			post_adjusted('/delete_messages/', params, function(response){
				show_notification(selectedMessagesCounter.toString() + gettext(' message(s) have been deleted'), NOTIFICATION_STATUS.SUCCESS);
				hideMessagesSelectionInfo();
								
			});
		}
	});
	
	$content_wrapper.on('click', '#dialog-sms-list-toolbar-print', function(e){
		var list = $('#dialog-list-container .checkbox-form input:checked').map(function(){
						return $(this).closest('._open-dialog-history').data("dialog-id");}).get();
		print_dialogs(list);
	});
	
	$content_wrapper.on('click', '#sms-list-toolbar-share', function(e){
		var list = [];
		var $selectedDialogs = getSelectedDialogs();
		$selectedDialogs.each(function(){
			list.push($(this).data('dialog-id'));
		});
		var params = {'data': {'ids_list':JSON.stringify(list)}};
		show_notification(gettext('Retreiving data'), NOTIFICATION_STATUS.IN_PROGRESS);
		get_adjusted('/dialog_sms_json/' + '?ids=' + JSON.stringify(list), params, function(response){
			var forwared_message = '';
			$(response).each(function() {
				var recipients = '';
				$(this.recipients).each(function(){
					recipients += this.number + ',';
				});
				recipients = recipients.slice(0, -1) + '\n\n';
				forwared_message += gettext('Dialog with ') + recipients;
				var last_counterparty = '';
				$(this.messages).each(function(){
					if (this.type === 1) {
						if (last_counterparty !== this.number){ 
							forwared_message += this.number + ':\n'; 
						}
						last_counterparty = this.number;
					}
					else {
						if (last_counterparty !== 'Me'){ 
							forwared_message += gettext('Me') + ':\n'; 
						}
						last_counterparty = gettext('Me');
					}
					forwared_message += this.body + ' (' + this.timestamp + ')\n\n';
				});
			});			
			showForwardModal(forwared_message);
		});
	});
	
	$content_wrapper.on('click', '#sms-list-toolbar-copy', function(e){
		alert('Копирование нескольких диалогов пока проблематично');
		return;
		
		var list = [];
		var $selectedDialogs = getSelectedDialogs();
		$selectedDialogs.each(function(){
			list.push($(this).data('dialog-id'));
		});
		var params = {'data': {'ids_list':JSON.stringify(list)}};
		show_notification(gettext('Retreiving data'), NOTIFICATION_STATUS.IN_PROGRESS);
		
		get_adjusted('/dialog_sms_json/' + '?ids=' + JSON.stringify(list), params, function(response){
			$(response).each(function() {
				var recipients = '';
				$(this.recipients).each(function(){
					recipients += this.number + ',';
				});
				recipients = recipients.slice(0, -1) + '\n\n';
				rs += gettext('Dialog with ') + recipients;
				var last_counterparty = '';
				$(this.messages).each(function(){
					if (this.type === 1) {
						if (last_counterparty !== this.number){ 
							rs += this.number + ':\n'; 
						}
						last_counterparty = this.number;
					}
					else {
						if (last_counterparty !== 'Me'){ 
							rs += gettext('Me') + ':\n'; 
						}
						last_counterparty = gettext('Me');
					}
					rs += this.body + ' (' + this.timestamp + ')\n\n';
				});
			});
			var $temp = $('<textarea></textarea>');
			$("body").append($temp);
			$temp.val(rs);
			$temp.select();
			document.execCommand("Copy");
			$temp.remove();
			show_notification('<span>Messages have been copied to the clipboard</span>', NOTIFICATION_STATUS.SUCCESS);
		});
	
	});
	
	$content_wrapper.on('click', '#sms-history-toolbar-copy', function(e){
		var $selectedMessages = get_selected_messages();
		var rs = '';
		var last_counterparty = '';
		var contact_number = get_active_dialog_number();
		$selectedMessages.each(function(){
			if ($(this).hasClass('_inbox')) {
				if (last_counterparty !== contact_number){ 
					rs += contact_number + ':\n'; 
				}
				last_counterparty = contact_number;
			}
			else {
				if (last_counterparty !== 'Me'){ 
					rs += gettext('Me') + ':\n'; 
				}
				last_counterparty = gettext('Me');
			}
			rs += $(this).find('._message-text').text().trim() + ' (' + $(this).data('time') + ')\n\n';
			
		});
		rs.trim();
		var $temp = $('<textarea></textarea>');
		$("body").append($temp);
		$temp.val(rs);
		$temp.select();
		document.execCommand("Copy");
		$temp.remove();
		show_notification('<span>Messages have been copied to the clipboard</span>', NOTIFICATION_STATUS.SUCCESS);
	});
	
	$content_wrapper.on('click', '#dialog-sms-list-toolbar-delete', function(e){
		var $selectedDialogs = getSelectedDialogs();
		/*BootstrapDialog.confirm({
			message: $('<p style = "font-style: italic">' + 
						gettext('Note that the messages will be deleted only from the web site, and not from the mobile device itself') + '.</p>' + 
						'<p>' + gettext('Continue?') + '</p>'),
			title: gettext('Delete messages'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes, delete the messages'),
			callback: function(result){				
				if(result){
					// do something...
				}
			}
		});*/
		var list = [];
		$selectedDialogs.each(function(){
			list.push($(this).data('dialog-id'));
		});
		var $activeDialog = getActiveDialogEnvelope();
		if (list.indexOf($activeDialog.data('dialog-id')) > -1){
			noActiveDialogState('on');
		}
		$selectedDialogs.remove();
		var params = {'data': {'ids':JSON.stringify(list)}};
		show_notification(gettext('Deleting dialogs'), NOTIFICATION_STATUS.IN_PROGRESS);
		changeDialogNumberBy(-list.length);
		hideDialogsSelectionInfo();
		post_adjusted('/delete_dialogs/', params, function(response){
			show_notification(gettext('Dialog(s) have been successfully deleted'), NOTIFICATION_STATUS.SUCCESS);
		});
	});
	
	/* populate dialogs list */
	
	// var $container = $('#dialog_list_container');
	// $container.closest('form').find('div.ajax_loader').css('display', 'block');
	
	//zeon_post('/dialog_sms_list_paginator/', {}, undefined, function(response){	
	//	$container.html(response);
	//	$container.closest('form').find('div.ajax_loader').css('display', 'none');
	//	manage_empty_content_message(response, $container.closest('form'));
	//});
	// $(document).keypress("C",function(e) {
	$content_wrapper.on('click', '#sms-list-toolbar-send-sms', function(e){
		
		var form = $('#sms-modal');
		clear_standard_fields(form);
		// NEW_EMAIL_TO_SLCTZ.clear();
		// var email = $(this).prev().text();
		var list = []
		var $selectedDialogs = getSelectedDialogs();
		$selectedDialogs.each(function(){	
			var recipients = getDialogNumbers($(this));
			list = $.merge(list, recipients);
			$(list).each(function(){
				NEW_SMS_SLCTZ.addOption({number: this});
			});		
		});
		NEW_SMS_SLCTZ.setValue(list);
		form.modal('show');
	});
	
	/*
	$(document).on('contextmenu', '#dialog-list-container ._open-dialog-history', function (e) {
		e.preventDefault();
		buildDialogContextMenu(e);
	});
	
	$(document).on('contextmenu', '#dialog_list_container li', function (e) {
		e.preventDefault();
		var $li = $(this).closest('li');
		if ($('#dialog_list_container > li.selected').length == 1) {
			$li.parent().find('li').removeClass('selected');
		}
		$li.addClass('selected');
		build_dialogs_context_menu(e);
	});
	*/
	$(document).on('keydown', '#new_message_input', function(e){
		if (e.which == 13 && e.shiftKey == false && $('#send_sms_by_enter').is(':checked')) {
			e.preventDefault();
			e.stopPropagation();
			send_response();
		}
	});
	
	$(document).on('click', '.user_setting_checkbox', function(e){
		var data = {}
		data[$(this).data('setting-id')] = $(this).zeon_val();
		zeon_post('/a_user_settings_edit/', data, undefined, undefined, undefined);
	});
	
	$(document).on('click', '#dialog_search_up', function(){
		var search_text = $('#_dialog_list_search').val();
		if (search_text !== ''){
			var $wrap = $('#dialog_history_wrap');
			var $body = $wrap.find('.body')[0];
			var $elem = $wrap.find('.body li:nth-child(11)');
			scrollToElem($elem, $body);
		}
	});
	
	$(document).on('click', '._delete_selected_messages', function(e){
		delete_selected_messages();
	});
	
	$(document).on('click', '#dialog_list_search_settings_apply_btn', function(){
		filter_dialog_list();
	});
	
	$(document).on('mouseover', '.dialog_instance', function(){
		$(this).find('.time').css('display','none');
		$(this).find('.delete_cross_icon').css('display','flex');
	});
	
	$(document).on('mouseout', '.dialog_instance', function(){
		$(this).find('.time').css('display','flex');
		$(this).find('.delete_cross_icon').css('display','none');
	});
	
	$(document).on('mouseover', '.inbox, .outbox', function(){
		$(this).find('.delete_cross_icon').css('display','flex');
	});
	
	$(document).on('mouseout', '.inbox, .outbox', function(){
		$(this).find('.delete_cross_icon').css('display','none');
	});
	
	$(document).on('click', '.cancel_send_new_message', function(){
		clearTimeout(SEND_MESSAGE_TIMEOUT_ID);
	});
	
	$content_wrapper.on('submit', '#sms-response-form', function(e) {
		e.preventDefault();
			
		var $input = $('#sms-response-input');
		var dialog_id = $('#dialog-history-wrapper').data('dialog-id');
		
		var message_text = $input.val();
		if (message_text === ''){
			alert_error(gettext('You cannot send an empty message from web.'))
			return;
		}
		
		if (!message_text.replace(/\s/g, '').length) {
			alert_error(gettext('You cannot send message composed only from blank spaces from web.'))
			return;
		}
		
		var delay_sending = true;
		var timeout_seconds = 10*(delay_sending == true);
		
		$input.val('');
		var $new_sms_html = $('<div />',{html: $('#new_sms_template').html()});
		$new_sms_html.find('._message-text').text(message_text);
		$new_sms_html.removeClass('dn');
		var $scroller = $('#dialog-history-wrapper').find('.scroller-block');
		$scroller.append($new_sms_html.html());
		// send_message(message_text, dialog_id, $scroller);
		if (timeout_seconds > 0){	
			var timeout_id;		
			var timer = function(){
				if (timeout_seconds > 0){
					timeout_seconds--;
					$scroller.find('._message:last-child').find('._timer').text(timeout_seconds);
					timeout_id = setTimeout(function(){
						timer();
				}, 1000);
				}
				else {
					send_message(message_text, dialog_id, $scroller);
				}
			}
			timer();
			
			$scroller.find('._message:last-child').find('._undo-sending').click(function(){
				clearTimeout(timeout_id);
				$scroller.find('._message:last-child').remove();
				$input.val(message_text);
				$input.focus();
			});
		
			$scroller.find('._message:last-child').find('._send-now').click(function(){
				clearTimeout(timeout_id);
				send_message(message_text, dialog_id, $scroller);
			});
		}
		$scroller.scrollTop($scroller.prop('scrollHeight'));
	});
	
	$content_wrapper.on('click', '.chat-message-list__inner-right-box', function(e) {
		if (message_is_selected($(this))) {
			unselect_message($(this));
		}
		else {
			select_message($(this));
		}
		messages_selection_info();
	});
	
	$(document).on('click', '._delete_dialog', function(e) {
		var $this = $(this);
		var json_obj = [$this.get_attr('data-dialog-id')];
		var data = {'dialog_id_list': JSON.stringify(json_obj)}
		$.post('/delete_dialogs/', data, function(response){
				$this.closest('li').remove();
				$('.details').html('');
			}).fail(function(response){ 
				alert(response.responseJSON.detail);
			});
	});
	
	$(document).on('click', '._delete_message', function(e) {
		e.stopPropagation();
		var $this = $(this);
		/*
		BootstrapDialog.confirm({
			message: $('<p style = "font-style: italic">' + 
						gettext('Note that the message will be deleted only from the web site, and not from the mobile device itself') + '.</p>' + 
						'<p>' + gettext('Continue?') + '</p>'),
			title: gettext('Delete messages'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes, delete the messages'),
			callback: function(result){				
				if(result){
					var json_obj = [$this.get_attr('data-message-id')];
					var data = {'message_id_list': JSON.stringify(json_obj)}
					zeon_post('/delete_messages/', data, undefined, undefined, function(response){
						$this.closest('li').remove();
					});
				}
			}
		});
		*/
		var json_obj = [$this.get_attr('data-message-id')];
		
		var params = {'data': {'message_id_list': JSON.stringify(json_obj)}}
		zeon_post('/delete_messages/', params, function(response){
			$this.closest('li').remove();
		});
	});
	
	$(document).on('scroll', '#dialog_history_wrap .body', function(){alert('Hello')});
	
	$(document).on('keydown', function(e) {
		if (get_active_sidebar_tab() == '_dialogs') {
			
			// Ctrl + ...
			if(e.ctrlKey) {
				// Ctrl + A
				if (e.keyCode == 65 || e.keyCode == 97){
					e.preventDefault();
					var $selected_messages = get_selected_messages();
					
					if ($('#dialog-list-container').hasClass('_select-mode')){
						$('#dialog-select-all').click();
					}
					else {
						var $dialogMessages = getDialogMessages();
						if ($selected_messages.length < $dialogMessages.length) {
							select_all_messages();
						}
						else {
							unselect_all_messages();
						}
					}
				}
			}
			
			// Arrows down and up
			if (e.which === 40 || e.which === 38) {
				
				// Check if message is selected
				/*
				var $wrapper = $('#dialog-list-container');
				var $selected_message = $wrapper.find('.active');
				if ($selected_message.length > 0){
					
					if (e.which === 40){
						e.preventDefault();
						
						if ($selected_message.next().length){
							$selected_message.removeClass('selected');
							$selected_message.next().addClass('selected');
						}
					}
						
					else if (e.which === 38){
						e.preventDefault();			
						if ($selected_message.prev().length !== 0){
							$selected_message.removeClass('selected');
							$selected_message.prev().addClass('selected');
						}
					}
					
					var item_height = $selected_message[0].offsetHeight;
					$wrapper[0].scrollTop = $selected_message[0].offsetTop - item_height*2;
					return;
				}
				*/
				// Check if dialog is selected
				
				var $wrapper = $('#dialog-list-container');
				var $selected_dialog = $wrapper.find('.active');
			
				if ($selected_dialog.length > 0){
					if (e.which === 40){
						e.preventDefault();
						if ($selected_dialog.length === 0){
							var $selected_dialog = $wrapper.children().first();
							open_dialog($selected_dialog);
						}
						else if ($selected_dialog.next().length){
							$selected_dialog = $selected_dialog.next(); 
							open_dialog($selected_dialog);
						}
						
					}
						
					else if (e.which === 38){
						e.preventDefault();			
						if ($selected_dialog.prev().length !== 0){
							$selected_dialog = $selected_dialog.prev();
							open_dialog($selected_dialog);
						}
					}
					
					var item_height = $selected_dialog[0].offsetHeight;
					$wrapper[0].scrollTop = $selected_dialog[0].offsetTop - item_height*2;
				}
			}
		}
	});
	
	$(document).on('keyup', function(e) {
		CTRL_IS_PRESSED = false;
	});
	
	function open_dialog(selected_dialog){
		
		$('._open-dialog-history').removeClass('active');
		selected_dialog.addClass('active');
		/*
		var has_new_message = ($selected_dialog.find('.unread').length > 0);
		$selected_dialog.addClass('selected');
		if (has_new_message){
			// $selected_dialog.find('.fa-envelope').toggle(false);
			$selected_dialog.find('.dialog_instance').removeClass('unread');
			var new_sms_cnt = $('#l_sms .news_counter').html();
			new_sms_cnt = new_sms_cnt - 1;
			$('.l_sms .news_counter').html(new_sms_cnt);
		}
		*/
		var dialog_id = selected_dialog.data('dialog-id');
		
			
		get_adjusted('/get_dialog_details/'+ dialog_id + '/', function(response){
			open_dialog_listener(response, selected_dialog);
		});
		
	}

	function send_message(message_text, dialog_id, $scroller){
		var params = {'data': {'dialog_id': dialog_id,
							   'text': message_text}}
	    var $message = $scroller.find('._message:last-child');
		$message.find('._controls-wrapper').remove();
		show_notification('Sending sms...', NOTIFICATION_STATUS.IN_PROGRESS);
		post_adjusted('/send_sms/', params, function(response){
			show_notification('Sms has been sent...', NOTIFICATION_STATUS.SUCCESS);
			$scroller.find('._message:last-child').remove();
			$scroller.append(response.message);
			append_new_dialogs(response.envelopes);
		});
	}
	
	function showForwardModal(str) {
		var $form = $('#sms-modal');
		clear_standard_fields($form);
		$form.find('#sms-text').val(str);
		$form.modal('show');
	}
	
	function print_dialogs(list) {
		var url = '/dialog_sms_print/';
		url += '?ids=' + JSON.stringify(list);
		
		window.open(url,'_blank').print();
		
	}
	
	function get_active_dialog_number() {
		if ($('.counterparty-wrapper i').length){
			return $('.counterparty-wrapper i').text().trim();
		}
		else {
			return $('.counterparty-wrapper').text().trim();
		}
	}
	
	function getSelectedDialogs() {
		return $('#dialog-list-container').find('.checkbox-form input[type="checkbox"]:checked').closest('._open-dialog-history');
	}
	
	function get_selected_messages() {
		return $('.chat-message-list__box.selected');
	};
	
	function buildDialogContextMenu(e){
		var $context_menu = $('#sms-context-menu');
		$context_menu.html('');
		/*
		var item_counter_total = $('# > li').length;
		
		var item_counter_selected = $('#dialog_history_list > li.selected').length;
		if (item_counter_total === item_counter_selected){
			$context_menu.append('<li onclick = "cm_messages_unselect_all()"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + gettext("Unselect all") + '</a></li>');
		}
		else{
			$context_menu.append('<li onclick = "cm_messages_select_all()"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + gettext("Select all") + '</a></li>');
		}
		*/
		$context_menu.append('<li class="divider"></li>')
					 .append('<li onclick = "cm_messages_copy()"><a style = "color: #dadada;" href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + gettext("Copy") + '</a></li>')
					 .append('<li onclick = "cm_messages_forward()"><a href="#"><i class="fa fa-share"></i>&nbsp; ' + gettext("Forward") + '</a></li>')
					 .append('<li class="divider"></li>')
					 .append('<li onclick = "cm_messages_print()"><a style = "color: #dadada;" href="#"><i class="fa fa-print"></i>&nbsp; ' + gettext("Print") + '</a></li>')
					 .append('<li onclick = "cm_messages_delete()"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext("Delete") + '</a></li>');
		$context_menu.css({top: e.pageY + "px", left: e.pageX + "px" });
		return;
	}
	
	function open_dialog_listener(data, $selected_dialog) {
		var unreadCounter = getDialogUnreadCounter($selected_dialog);
		if (unreadCounter > 0) {
			changeDialogUnreadCounterBy($selected_dialog, -unreadCounter);
		}
		noActiveDialogState('off');
		var $wrap = $('#dialog-history-wrapper');	
		$wrap.html(data.template);
		$wrap.data('dialog-id', $selected_dialog.data('dialog-id'));
		$wrap.find('._message-text').linkify({
			target: "_blank"
		});
		var $scroller = $wrap.find('.scroller-block');
		if ($selected_dialog.hasClass('_search-result')){
			var search_text = $('#dialog-search').val(); 
			var $target = $('._message[data-message-id = ' + $selected_dialog.data('message-id') + ']');
			scrollToElem($target, $scroller);
			var initialColor = $target.find('.chat-message-list__inner-right-box').css('background');
			if ($target.hasClass('_inbox')) {
				var highlightColor = '#b0b0b0';
			}
			else {
				var highlightColor = '#245297';
			}
			$target.find('.chat-message-list__inner-right-box').animate({backgroundColor: highlightColor}, "slow")
															   .delay(200)
															   .animate({backgroundColor: initialColor}, "slow");
		}
		else {
			$scroller.stop().animate({
				scrollTop: $scroller.prop('scrollHeight')
			}, 0);
		}
		$('#sms-response-input').focus();
	}
	
	function select_message($message) {
		$message.parent().addClass('selected');
		var selectedMessagesCount = $('.chat-message-list__box.selected').length;
		if (selectedMessagesCount > 0) {
			$('#_sms-history-header').addClass('dn');
			$('#_sms-history-toolbar').removeClass('dn');
		}
		else {
			$('#_sms-history-header').removeClass('dn');
			$('#_sms-history-toolbar').addClass('dn');
		}
	}
	
	function message_is_selected($message) {
		return $message.parent().hasClass('selected'); 
	}
	
	function unselectAllDialogs(){
		$('#dialog-list-container').find('.checkbox-form input[type="checkbox"]').prop('checked', false);
		$('#dialog-select-all').prop('checked', false);
		$('#dialog-list-toolbar').addClass('dn');
		hideDialogsSelectionInfo();
	}
	
	function unselect_message($message) {
		$message.parent().removeClass('selected');
		var selectedMessagesCount = $('.chat-message-list__box.selected').length;
		if (selectedMessagesCount > 0) {
			$('#_sms-history-header').addClass('dn');
			$('#_sms-history-toolbar').removeClass('dn');
		}
		else {
			$('#_sms-history-header').removeClass('dn');
			$('#_sms-history-toolbar').addClass('dn');
		}
	}
	
	function select_all_messages() {
		$('.chat-message-list__inner-right-box').each(function() {
			select_message($(this));
		});
		messages_selection_info();
	}
	
	function unselect_all_messages() {
		$('.chat-message-list__inner-right-box').each(function() {
			unselect_message($(this));
		});
		messages_selection_info();
	}
	
	function messages_selection_info() {
		var $notification_line = $('#dialog-history-wrapper').find('.notification-line');
		var count = numberOfSelectedMessages();
		if (count > 0) {
			$notification_line.text(count.toString() + gettext(' message(s) selected'));
			$('#sms-response-form').addClass('dn');
			$notification_line.removeClass('dn');
		}
		else {
			$('#sms-response-form').removeClass('dn');
			$notification_line.addClass('dn');
		}
	}
	
	function hideMessagesSelectionInfo() {
		var $notification_line = $('#dialog-history-wrapper').find('.notification-line');
		$notification_line.addClass('dn');
	}
	
	function dialogs_selection_info(){
		var $notification = $('#dialog-list-notification');
		var count = numberOfSelectedDialogs();
		if (count > 0) {
			$notification.text(count.toString() + gettext(' dialog(s) selected') + gettext(' (ЭТО ДОЛЖНО БЫТЬ В ЛЕВОМ СТОЛБЦЕ )'));
			$notification.removeClass('dn');
		}
		else {
			$notification.addClass('dn');
		}
	}
	
	function hideDialogsSelectionInfo () {
		var $notification = $('#dialog-list-notification');
		$notification.addClass('dn');
	}
	
	function numberOfSelectedMessages() {
		var $selected_messages = get_selected_messages();
		var selectedMessagesCount = $selected_messages.length;
		return selectedMessagesCount;
	}
	
	function getDialogMessages() {
		return $('#dialog-history-wrapper .chat-message-list__box');
	}
	
	function numberOfSelectedDialogs(){
		var $selectedDialogs = getSelectedDialogs();
		var selectedDialogsCount = $selectedDialogs.length;
		return selectedDialogsCount;
	}

	function noActiveDialogState(mode) {
		mode = mode || 'on';
		if (mode == 'on') {
			$('#dialog-empty-history-wrapper').removeClass('dn');
			$('#dialog-history-wrapper').addClass('dn');
			$('#dialog-history-wrapper').html(''); // just in case
		}
		else {
			$('#dialog-empty-history-wrapper').addClass('dn');
			$('#dialog-history-wrapper').removeClass('dn');
		}
	}

	function changeDialogNumberBy(delta) {
		var $counterWrapper = $('#sms-dialog-counter');
		var counter = parseInt($counterWrapper.text()) + delta;
		$counterWrapper.text(counter);
	}

	function getDialogUnreadCounter($dialog) {
		return parseInt($dialog.find('.unread-counter-wrapper').text().replace('(', '').replace(')', ''));
	}
	
	function changeDialogUnreadCounterBy($dialog, delta) {
		var $counterWrapper = $dialog.find('.unread-counter-wrapper');
		var counter = parseInt($counterWrapper.text().replace('(', '').replace(')', ''));
		counter += delta;
		counter = '(' + counter.toString() + ')';
		if (counter > 0) {
			$counterWrapper.text(counter);
			$counterWrapper.removeClass('dn');
		}
		else {
			$counterWrapper.addClass('dn');
			$counterWrapper.text(counter);
			declareDialogRead($dialog);
		}
		changeUnreadSmsCounterBy(delta);
	}
	
	function declareDialogRead($dialog) {
		$dialog.find('._dialog-number-wrapper').removeClass('font-bold')
	}

});

function getDialogNumbers($dialog) {
	return $dialog.data('recipients');
}
	
function getActiveDialogEnvelope() {
	return $('._open-dialog-history.active');
}
	
function getDialogEnvelopeById(id) {
	return $('._open-dialog-history[data-id="' + id + '"]');
}

function updateDialogCounterparties($dialog, targetNumber, contactName) {
	var dialogNumbers = getDialogNumbers($dialog);
	for (var i = 0; i < dialogNumbers.length; i++) {
		
		// if (dialogNumbers.indexOf(targetNumber) > -1){
		// If someday you decide to explicitly display more than one number in group dialogs, 
		// you can replace by dialogNumbers.indexOf(targetNumber) > -1
		if ($dialog.find('._dialog-number').text() == targetNumber){ 
			$dialog.find('._dialog-number').text(contactName);
		}
	}
}
	
function changeUnreadSmsCounterBy(delta) {
	var $counterWrapper = $('#_dialogs .notification-ring');
	var counter = $counterWrapper.text();
	if (!counter) {
		counter = 0;
	}
	counter = parseInt(counter) + delta;
	$counterWrapper.text(counter);
	if (counter > 0) {
		$counterWrapper.removeClass('dn');
	}
	else {
		$counterWrapper.addClass('dn');
	}
}



function append_new_dialogs(envelopes_html){
	
	$('#dialog_list_container .empty_content_indicator').remove();
	var $new_nodes = $(envelopes_html);
	var $node;
	var active_dialog_id = $('#dialog-list-container').find('.active').data('dialog-id');
	
	$new_nodes.each(function() {
		$node = $('#dialog-list-container').find('[data-dialog-id=' + $(this).data('dialog-id') +']');
		if ($node.length){
			$node.remove();
		}
	});
	
	$('#dialog-list-container').prepend(envelopes_html);
	
	$('#dialog-list-container').find('[data-dialog-id=' + active_dialog_id +']').addClass('active');	
}

function filter_dialog_list(input){
	
	var search_text = input.val();
	
	var url = '/dialogs_search/' + input.val() + '/';
	var params = {'container': $('#dialog-list-container'),
				  'show_loader': true} //checked_sim_cards};
	get_adjusted(url, params, function(response){	
		var $html = $('<div />',{html:response.template});
		
		if ($html.find('#search-result-dialogs-wrapper').length || $html.find('#search-result-messages-wrapper').length) {
			$html.find('#search-result-dialogs-wrapper ._dialog-number-wrapper').each(function(){
				highlight_search(search_text, $(this));
			});
			
			$html.find('#search-result-messages-wrapper ._dialog-body-wrapper').each(function(){
				highlight_search(search_text, $(this));
			});
		}
		else {
			$html.find('._dialog-number-wrapper, ._dialog-body-wrapper').each(function(){
				highlight_search(search_text, $(this));
			});
		}
		
		$('#dialog-list-container').html($html.html());
	});
}









































