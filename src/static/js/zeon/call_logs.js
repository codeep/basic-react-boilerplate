$(function(){
	"use strict"
	var content_wrapper = $('#content-wrapper');
	
	$(document).on('contextmenu', '#call_log_list_container li', function (e) {
		e.preventDefault();
		
		var $li = $(this);
		var $wrap = $('#call_log_list_container');
		$wrap.find('li').removeClass('selected');
		$li.addClass('selected');
		
		var $context_menu = $('#call_log_context_menu');
		$context_menu.html('');
		
		$context_menu.append('<li onclick = "cm_call_log_add_contact()"><a href="#"><i class="fa fa-user-plus"></i>&nbsp; ' + gettext("Add to contacts") + '</a></li>')
				     .append('<li onclick = "cm_call_log_send_message()"><a href="#"><i class="fa fa-envelope fa"></i>&nbsp; ' + gettext("Send message") + '</a></li>')
					 .append('<li class="divider"></li>')
					 .append('<li onclick = "cm_call_log_delete()"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext("Delete") + '</a></li>');
		$context_menu.css({ display:'block', top: e.pageY + "px", left: e.pageX + "px" });
		return;
	});
	
	content_wrapper.on('click', '._open-call-log', function(e) {
		
		var sel = getSelection().toString();
		// if no text is highlighted
		if(!sel){ 
			open_call_log($(this));
		}
	});
	
	content_wrapper.on('click', '._send-sms', function(e){
		e.preventDefault();
		var form = $('#sms-modal');
		clear_standard_fields(form);
		// NEW_EMAIL_TO_SLCTZ.clear();
		// var email = $(this).prev().text();
		var number = $(this).parent().find('.number').text();
		var details_wrapper = $('#_contact-details-wrapper');
		var name = 'SOS' // details_wrapper.find('.call-log-person-box__title').text();
		NEW_SMS_SLCTZ.addOption({number: number, name: name});
		NEW_SMS_SLCTZ.setValue(number);
		form.modal('show');
	});
	
	content_wrapper.on('keyup', '#call-log-search', function(e){
		if (keycode_is_letter_or_symbol(e.which)){
			filter_call_list();
		}
		if ($(this).val() === ''){
			FILTER_DATA = null;
		}
	});
	
	content_wrapper.on('change', '#call-log-filter-form input', function(e){
		filter_call_list();
	});
	
	$(document).on('keydown', function(e) {
		var details_wrapper = $('#call-log-details-wrapper');
		var $selected = $('#_contact-list-container').find('.active');
		if (details_wrapper.length > 0){
			if (e.which === 40 || e.which === 38){
				if (e.which === 40)
				{
					e.preventDefault();
					if ($selected.length === 0){
						var $selected = $details_wrapper.find('._open-contact:first');
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
				
				details_wrapper[0].scrollTop = $selected[0].offsetTop - item_height*2;
			}
		}
	});
	
	function open_call_log($item) {
		$('._open-call-log').removeClass('active');
		$item.addClass('active');
		
		var call_log_id = $item.data('call-log-id');
		var details_wrapper = $('#call-log-details-wrapper');
		get_adjusted('/a_call_log_details/'+ call_log_id + '/', function(response){
			$('#call-log-empty-wrapper').addClass('dn');
			details_wrapper.removeClass('dn').html(response.template);
			details_wrapper.data('call-log-id', call_log_id);
		
			var search_text = $('#_contact-search').val();
			if (search_text) {
				highlight_search(search_text);
			}
		});
	}
	
	function filter_call_list(){
		var $input = $('#call-log-search');
		var $filter_form = $('#call-log-filter-form');
		var checked_types = [];
		$filter_form.find('input:checked').each(function () {
			checked_types.push($(this).val());
		});
		
		if (checked_types.length === 0) {
			checked_types.push([-1]);
		}
		var search_text = $input.val();
		var $wrapper = $('#call-log-list-wrapper');
		FILTER_DATA = {'search_text': search_text,
					   'checked_types[]': checked_types}
		
		var params = {'data': FILTER_DATA};
		
		var url = $filter_form.attr('action');
		get_adjusted(url, params, function(response){	
			$wrapper.html(response.template);
		});
	
		$("#dialog_list_search_filter_content").hide();
	}
});

function cm_call_log_add_contact(){
	var $selected = $('#call_log_list_wrap').find('li.selected');
	var $modal = $('#new_contact_form'); 
	$modal.on('show.bs.modal', function(event) {
		var head = gettext('New contact');
		$(this).find('.modal-title').text(head);
	}).modal({backdrop:'static',keyboard:false}).find(".modal-body").load('/a_contact_new_form/', function(){
		var name = $selected.find('.name a').text();
		$modal.find('#id_name').val(name);
		var phone_number = $selected.find('.contact_value').text();
		$modal.find('#id_phone-0-id').val(phone_number);
	});
	
}

function cm_call_log_delete(){
	var $selected = $('#call_log_list_container').find('.selected');
	var data = {'id': $selected.data('id')};
	zeon_post('/a_call_logs_delete/', data, undefined, undefined, function(response){
		$selected.remove();
	});
}

function cm_call_log_send_message(){
	var $li = $('#call_log_list_container').find('.selected');
	var modal_id = '#new_message_form';
	$(modal_id).on('show.bs.modal', function(event) {
		var head = gettext('New sms');
		var modal = $(this);
		modal.find('.modal-title').text(head);
		var caller_type = 'call_log';
		modal.find('[type=submit]').attr('data-caller-type', caller_type);
		// $('#new_message_text').text('');
		var $new_message_recipients = $('#new_message_recipient_wrap #recipients')[0].selectize;
		if ($li.find('.name').length == 0) {
			$new_message_recipients.addOption({counterparty_number: $li.find('.contact_value').text()});
		}
		$new_message_recipients.setValue($li.find('.contact_value').text());
	}).modal({backdrop:'static',keyboard:false});
	// selectize_elements();
}