$(function(){
	"use strict"
	
	scroll_to_the_selected_element();
	var content_wrapper = $('#content-wrapper');
	
	content_wrapper.on('keyup', '#contact-search', function(e){	
		var $input = $(this);
		
		delay(function(){
			if (keycode_is_letter_or_symbol(e.which)){
				if ($input.val() !== '') {
					// $('#dialog-list-header').addClass('dn');
					filter_contact_list($input);
				}
				else {
					/* Replace this code. Results should be cached somehow */
					// $('#dialog-list-header').removeClass('dn');
					get_adjusted('/contacts/', function(response){
						var contacts_list_html = $(response.template).find('#contact-list-container').html();
						$('#contact-list-container').html(contacts_list_html);
					});
				}
			}
			if ($input.val() === ''){
				FILTER_DATA = null;
			}
		}, 1000 );
	});

	content_wrapper.on('click', '._send-sms', function(e){
		e.preventDefault();
		var form = $('#sms-modal');
		clear_standard_fields(form);
		// NEW_EMAIL_TO_SLCTZ.clear();
		// var email = $(this).prev().text();
		var number = $(this).parent().find('.number').text();
		var details_wrapper = $('#_contact-details-wrapper');
		var name = details_wrapper.find('.call-log-person-box__title').text();
		NEW_SMS_SLCTZ.addOption({number: number, name: name});
		NEW_SMS_SLCTZ.setValue(number);
		form.modal('show');
	});
	
	content_wrapper.on('click', '._send-email', function(e){
		e.preventDefault();
		if (email_accounts.length){
			var $form = $('#_new-message-popup-large');
			clear_standard_fields($form);
			NEW_EMAIL_TO_SLCTZ.clear();
			var email = $(this).prev().text();
	
			var details_wrapper = $('#_contact-details-wrapper');
			var name = details_wrapper.find('.call-log-person-box__title').text();
			NEW_EMAIL_TO_SLCTZ.addOption({email: email, name: name});
			NEW_EMAIL_TO_SLCTZ.setValue(email);
			
			$form.modal('show');
		}
		else {
			dialog_info('You have no mailbox associated with your account.');
		}
	});
	
	content_wrapper.on('click', '._is-main', function(e) {
		var $star = $(this);
		var contact_phone_id = $(this).closest('._phone-numbers-wrapper').data('contact-phone-id');
		var params = {'data': {'contact_phone_id': contact_phone_id}};
		post_adjusted('/contact_phone_main_number/', params, function(){
			$star.closest('._contact-phone-item-wrapper').find('._is-main').removeClass('active');
			$star.addClass('active');
		});
	});
	
	$(document).on('click', '._open-contact > .checkbox-form input', function(e){
		e.stopPropagation();
		if ($('#contact-list-container .checkbox-form input:checked').length > 0) {
			$('#contact-list-toolbar').removeClass('dn');	
		}
		else {
			$('#contact-list-toolbar').addClass('dn');
		}
	});
	
	$(document).on('click', '._open-contact', function(e){
		if ($(e.target).is('.checkbox-form input, .checkbox-form label')){
			e.stopPropagation();
			return;
		}
		var sel = getSelection().toString();
		// if no text is highlighted
		if(!sel){ 
			open_contact($(this));
		}
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-send-sms', function(e){
		var form = $('#sms-modal');
		clear_standard_fields(form);
		// NEW_EMAIL_TO_SLCTZ.clear();
		// var email = $(this).prev().text();
		var phone_list = []
		var contacts_without_number = '';
		$('#contact-list-container .checkbox-form input:checked').each(function(){
			var $wrapper = $(this).closest('._open-contact');
			var number = $wrapper.data('main-phone');
			if (!number) {
				contacts_without_number += $wrapper.find('.name').text() + '\n';
			}
			else {
				phone_list.push(number);
			}
		});
		if (!contacts_without_number) {
			NEW_SMS_SLCTZ.setValue(phone_list);
			form.modal('show');
		}
		else {
			contacts_without_number = gettext('The following contacts do not have a phone number:') + '\n' + contacts_without_number;
			alert(contacts_without_number);
		}
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-print', function(e){
		var list = $('#contact-list-container .checkbox-form input:checked').map(function(){
						return $(this).closest('._open-contact').data("contact-id");}).get();
		print_contacts(list);
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-copy', function(e){
		alert('Not ready yet');
		return false;
		var $selected_contacts = $('#contact-list-container .checkbox-form input:checked').closest('._open-contact');
		var list = $selected_contacts.map(function(){return $(this).data("contact-id");}).get();
		var params = {'data': {'contact_ids': JSON.stringify(list)}}
		var $temp = $('<textarea></textarea>');
		$("body").append($temp);
		get_adjusted('/contact_copy_to_clipboard/', params, function(response) {	
			$temp.val(response.result);
			$temp.select();
			document.execCommand("Copy");
			$temp.remove();
			show_notification('<span>' + gettext('Contacts') + '<b> ' + name + '</b> ' + gettext('have been copied to the clipboard') + '</span>', NOTIFICATION_STATUS.SUCCESS);
		});
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-send-email', function(e){
		alert('Not ready yet');
		return false;
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-share', function(e){
		alert('Not ready yet');
		return false;
	});
	
	content_wrapper.on('click', '#contact-list-toolbar-delete', function(e){
		alert('Функция работает, но так как верстальщик не сделал диалоговые окна для предупреждения ("Вы уверены, что хотите удалить...?"), я временно скрыл функцию');
		return false;
		var $selected_contacts = $('#contact-list-container .checkbox-form input:checked').closest('._open-contact');
		var list = $selected_contacts.map(function(){return $(this).data("contact-id");}).get();
		var params = {'data': {'contact_ids': JSON.stringify(list)}}
		post_adjusted('/contact_delete/', params, function() {
			$selected_contacts.remove();
			var counter = $selected_contacts.length;
			show_notification(counter + ' ' + gettext('contacts has been deleted'));
		});
	});
	
	content_wrapper.on('click', '#select-contact-mode', function(e){
		e.preventDefault();
		$('#contact-list-header').children().not('#contact-list-toolbar').toggleClass('dn');

		// Checkboxes for contacts
		$('#contact-list-container').children().addClass('accordion-box__title-box--for-checkbox');
		$('#contact-list-container').find('.checkbox-form').removeClass('dn');
		$(this).closest('aside').find('.endless_page_template').addClass('_select-mode');
	});
	
	content_wrapper.on('click', '#contact-cancel-mode', function(e){
		e.preventDefault();
		$('#contact-list-header').children().not('#contact-list-toolbar').toggleClass('dn');
		$('#contact-list-toolbar').addClass('dn');
		// Checkboxes for contacts
		$('#contact-list-container').children().toggleClass('accordion-box__title-box--for-checkbox');
		$('#contact-list-container').find('.checkbox-form').toggleClass('dn');
		$(this).closest('aside').find('.endless_page_template').toggleClass('_select-mode');
	});
	
	content_wrapper.on('click', '#contact-select-all', function(e){
		if ($(this).is(':checked')) {
			$('#contact-list-container').find('.checkbox-form input[type="checkbox"]').prop('checked', true);
			$('#contact-list-container').addClass('_all-selected');
			$('#contact-list-toolbar').removeClass('dn');
		}
		else {
			$('#contact-list-container').find('.checkbox-form input[type="checkbox"]').prop('checked', false);
			$('#contact-list-toolbar').addClass('dn');
		}
	});
	
	content_wrapper.on('click', '._contact-edit-btn', function(){
		var details_wrapper = $('#_contact-details-wrapper');
		var contact_id = details_wrapper.data('contact-id');
		get_adjusted('/contact_update/' + contact_id + '/', function(response){
			details_wrapper.find('._contact-empty-wrapper').addClass('dn');
			details_wrapper.find('._contact-view-wrapper').addClass('dn');
			details_wrapper.find('._contact-edit-wrapper').removeClass('dn').html(response.template);
			details_wrapper.data('contact-id', contact_id);
			
		});
	});
	
	/*
	$("#contact-list-container").bind("DOMNodeInserted",function(){
		var first_child = $('#contact-list-container').children().first();
		if (first_child.length === 1){ 
			var is_select_mode = (!$('#contact-list-container div:first-child .checkbox-form').hasClass('dn'));
			if (is_select_mode) {
				$(this).find('.checkbox-form').removeClass('dn');
				$(this).addClass('accordion-box__title-box--for-checkbox');
			}
		}
	});
	*/
	
	content_wrapper.on('click', '#_toolbar-delete', function(e){
		var details_wrapper = $('#_contact-details-wrapper');
		var contact_id = details_wrapper.data('contact-id');
		var params = {'data': {'contact_ids': JSON.stringify([contact_id])}};
		post_adjusted('/contact_delete/', params, function(response){
			// $('#contact_list_container li.selected').remove();
			show_notification(gettext('Contact has been deleted.'), NOTIFICATION_STATUS.SUCCESS);
			details_wrapper.find('._contact-empty-wrapper').removeClass('dn');
			details_wrapper.find('._contact-view-wrapper').addClass('dn');
			details_wrapper.find('._contact-edit-wrapper').addClass('dn');
			$('._open-contact[data-contact-id=' + contact_id + ']').remove();
			var contact_counter = parseInt($('#contact-counter').text());
			contact_counter -= 1;
			$('#contact-counter').text(contact_counter);
		});
		/*
		BootstrapDialog.confirm({
			message: $('<div>' + gettext('Are you sure you want to delete the contact?') + '</div>'),
			title: gettext('Delete contact'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes'),
			callback: function(result){				
				if(result){
					// ... 
				}
			}
		});
		*/
	});
	
	content_wrapper.on('click', '._edit_contact_phone', function(){
		var $previous_input = $('#contact_phone');
		$previous_input.closest('li').find('.value').html($previous_input.val())
													.toggle(true);
		$previous_input.remove();
		
		var $value_div = $(this).closest('li').find('.value');
		var value = $value_div.html();
		var $input = $("<input id = 'contact_phone' class = 'form-control input-sm plain' />");
		$input.val(value);
		$value_div.toggle(false);
		$('#edit_contact_phone_nav_form').css('display', 'block');
		$value_div.after($input);
		$input.focus();
	});
	
	content_wrapper.on('click', '._remove_contact_email', function(){
		var $li = $(this).closest('li');
		var contact_email_id = $li.data('contact-email-id'); 
		var data = {'contact_email_id': contact_email_id}
		$.post('/ajax_delete_contact_email/', data, function(response){
			$li.remove();
		});
	});
	
	content_wrapper.on('click', '#toolbar-print', function(e){
		var contact_id = $('#_contact-details-wrapper').data('contact-id');
		// 
		var list = [contact_id];
		print_contacts(list);
	});
	
	content_wrapper.on('click', '#toolbar-share', function(e){
		var details_wrapper = $('#_contact-details-wrapper');
		var result = '';
		var name = details_wrapper.find('.call-log-person-box__title').text() 
		result += name + '\n';
		
		var phone_counts = details_wrapper.find('._phone-numbers-wrapper').length;
		if (phone_counts){
			result += gettext('Phone numbers: ');
			$('._phone-numbers-wrapper').each(function(i, el){
				result +=  $(this).find('._phone-number-value').text() + ' (' + $(this).find('._phone-number-type').text() + ')'; 
				if (i < phone_counts - 1) {
					result += ', ';
				}
			});
			result += '\n';
		}
		
		var email_counts = details_wrapper.find('._email-addresses-wrapper').length;
		if (email_counts){
			result += gettext('Emails: ');
			$('._email-addresses-wrapper').each(function(i, el){
				result += $(this).find('._email-address-value').text() + ' (' + $(this).find('._email-address-type').text()  + ')'; 
				if (i < email_counts - 1) {
					result += ', ';
				}
			});
			result += '\n';
		}
		
		var $form = $('#sms-modal');
		clear_standard_fields($form);
		// NEW_EMAIL_TO_SLCTZ.clear();
		// var email = $(this).prev().text();
		$form.find('#sms-text').val(result);
		$form.modal('show');
	});
	
	content_wrapper.on('click', '#toolbar-copy', function(e){
		var details_wrapper = $('#_contact-details-wrapper');
		var result = '';
		var name = details_wrapper.find('.call-log-person-box__title').text() 
		result += name + '\n';
		
		if (details_wrapper.find('.call-log-person-box__description').length) {
			result += gettext('Company: ') + details_wrapper.find('.call-log-person-box__description').text() + '\n';
		}
		
		if (details_wrapper.find('.call-log-person-box__position').length) {
			result += gettext('Position: ') + details_wrapper.find('.call-log-person-box__position').text() + '\n';
		}
		
		var phone_counts = details_wrapper.find('._phone-numbers-wrapper').length;
		if (phone_counts){
			result += gettext('Phone numbers: ');
			$('._phone-numbers-wrapper').each(function(i, el){
				result +=  $(this).find('._phone-number-value').text() + ' (' + $(this).find('._phone-number-type').text() + ')'; 
				if (i < phone_counts - 1) {
					result += ', ';
				}
			});
			result += '\n';
		}
		
		var email_counts = details_wrapper.find('._email-addresses-wrapper').length;
		if (email_counts){
			result += gettext('Emails: ');
			$('._email-addresses-wrapper').each(function(i, el){
				result += $(this).find('._email-address-value').text() + ' (' + $(this).find('._email-address-type').text()  + ')'; 
				if (i < email_counts - 1) {
					result += ', ';
				}
			});
			result += '\n';
		}
		
		if (details_wrapper.find('._address').length) {
			result += gettext('Address: ') + details_wrapper.find('._address').text() + '\n';
		}
		
		if (details_wrapper.find('._notes').length) {
			result += gettext('Notes: ') + details_wrapper.find('._notes').html() + '\n';
		}
		
		var $temp = $('<textarea></textarea>');
		$("body").append($temp);
		$temp.val(result);
		$temp.select();
		document.execCommand("Copy");
		$temp.remove();
		show_notification('<span>' + gettext('Contact') + '<b> ' + name + '</b> ' + gettext('has been copied to the clipboard') + '</span>', NOTIFICATION_STATUS.SUCCESS);
	});
	
	content_wrapper.on('submit', '#_contact-update-form', function(e){
		e.preventDefault();
		var form = $(this);
		var details_wrapper = $('#_contact-details-wrapper');
		var contact_id = details_wrapper.data('contact-id');
		var url = form.attr('action') + contact_id + '/';  
		var params = {'data': form.serialize(),
					  'form': form};
		post_adjusted(url, params, function(response){
			details_wrapper.find('._contact-empty-wrapper').addClass('dn');
			details_wrapper.find('._contact-edit-wrapper').addClass('dn');
			details_wrapper.find('._contact-view-wrapper').removeClass('dn').html(response.template1);			
			var updated_element = $('#contact-list-container').find('[data-contact-id = ' + contact_id + ']');
			var is_still_selected = updated_element.hasClass('active');
			updated_element.replaceWith(response.template2);
			if (is_still_selected) {
				updated_element.addClass('active');
			}
			show_notification(gettext('Changes to the contact have been saved.'), NOTIFICATION_STATUS.SUCCESS);
		});
	});
	
	content_wrapper.on('click', '#_contact-update-form .cancel-btn', function(e){
		content_wrapper.find('._contact-edit-wrapper').addClass('dn');
		content_wrapper.find('._contact-view-wrapper').removeClass('dn');
	});
	
	content_wrapper.on('click', '#add-contact-btn', function(e){
		var form = $('#add-contact-modal');
		clear_standard_fields(form);
		clear_formsets(form);
		form.modal('show');
	});
	
	$('#new_contact').on('click', function(e) {
		e.preventDefault();
		var $triggered_elem = $(this);
		var modal_id = $triggered_elem.data('target');
		var target = '/static/new_contact_form.html';
		
		$(modal_id).on('show.bs.modal', function(event) {
			var head = $triggered_elem.data('head') // Extract info from data-* attribute
			var modal = $(this);
			modal.find('.modal-title').text(head);
		}).modal({backdrop:'static',keyboard:false}).find(".modal-body").load('/a_contact_new_form/');
	});

	
	$(document).on('keydown', function(e) {
		if (get_active_sidebar_tab() == '_contacts'){
			var $wrapper = $('#contact-list-container'); 
			var $selected = $wrapper.find('.active');
			
			if (e.which === 40 || e.which === 38){
				if (e.which === 40){
					e.preventDefault();
					if ($selected.length === 0){
						var $selected = $wrap.find('._open-contact:first');
						open_contact($selected);
					}
					else if ($selected.next().length){
						$selected = $selected.next(); 
						var selected_index = $selected.index();
						open_contact($selected);
					}
				}
				
				else if (e.which === 38){
					e.preventDefault();			
					if($selected.length){					
						if ($selected.prev().length !== 0){
							$selected = $selected.prev();
							var selected_index = $selected.index();
							open_contact($selected);
						}
					}
				}
				
				var item_height = $selected[0].offsetHeight;
				$wrapper[0].scrollTop = $selected[0].offsetTop - item_height*2;
			}
		}
	});
	
	function open_contact($contact){
		
		var contact_id = $contact.data('contact-id');
		$contact.siblings().removeClass('active');
		$contact.addClass('active');
		var details_wrapper = $('#_contact-details-wrapper');
		get_adjusted('/contact_details/'+ contact_id + '/', function(response){
			details_wrapper.find('._contact-empty-wrapper').addClass('dn');
			details_wrapper.find('._contact-edit-wrapper').addClass('dn');
			details_wrapper.find('._contact-view-wrapper').removeClass('dn').html(response.template);
			details_wrapper.data('contact-id', contact_id);
		
			var search_text = $('#_contact-search').val();
			if (search_text) {
				highlight_search(search_text);
			}
		});
	}

	function filter_contact_list(input){
		var search_text = input.val();
		var checked_sim_cards = [];
		/*
		$('#contact_list_search_filter_content').find('#sim_cards_form input:checked').each(function () {
			checked_sim_cards.push($(this).val());
		});
		*/
		var params = {'container': $('#contact-list-container'),
					  'show_loader': true} //checked_sim_cards};
		get_adjusted('/contacts/' + search_text + '/', params, function(response){	
			var $html = $('<div />',{html:response.template});
			$html.find('.accordion-box__title, .accordion-box__description').each(function(){
				highlight_search(search_text, $(this));
			});
			$('#contact-list-container').html($html.html());
		});
	}

	function scroll_to_the_selected_element() {
		var $ul = $('#contact_list_container');
		var $selected = $ul.find('li.selected');
		if ($selected.length > 0){
			var item_height = $selected[0].offsetHeight;
			$ul[0].scrollTop = $selected[0].offsetTop - item_height*2;
		}
	}

	function increment_contact_counter(){
		var contact_counter = parseInt($('#contact-counter').text());
		contact_counter += 1;
		$('#contact-counter').text(contact_counter);
	}
	
	function print_contacts(list){
		var url = '/contact_print/';
		url += '?ids=' + JSON.stringify(list);
		window.open(url,'_blank').print();
	}
});
