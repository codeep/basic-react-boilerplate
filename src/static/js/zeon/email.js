$(function(){
	
	var REPLY_TO_SLCTZ = null;
	// $("._show-message-thread").draggable();
	
	
	$(document).on('keydown', function(e) {
		// Arrows down and up
		if (e.which === 40 || e.which === 38) {
			// Check if message is selected
			// To do ...

			// Check if dialog is selected
			var $envelopes_list = $('#_mail-envelopes-list');
			var $selected_dialog = $envelopes_list.find('.active');
			if ($selected_dialog.length > 0){
				if (e.which === 40){
					e.preventDefault();
					if ($selected_dialog.length === 0){
						var $selected_dialog = $selected_dialog.find('li:first');
						show_email_body($selected_dialog);
					}
					else if ($selected_dialog.next().length){
						$selected_dialog = $selected_dialog.next(); 
						show_email_body($selected_dialog);
					}
				}
					
				else if (e.which === 38){
					e.preventDefault();			
					if ($selected_dialog.prev().length !== 0){
						$selected_dialog = $selected_dialog.prev();
						show_email_body($selected_dialog);
					}
				}
				
				// var item_height = $selected_dialog[0].offsetHeight;
				// $ul[0].scrollTop = $selected_dialog[0].offsetTop - item_height*2;
			}
		}
	});
	
	$(document).on('keyup', '#_id-email-search', function(e){
		if (keycode_is_letter_or_symbol(e.which)){
			var $form = $('#_id_filter-form');
			FILTER_DATA = $form.serialize() + '&is_filtered=1&search_text=' + $(this).val();
			var url = $form.attr('action');
			var $container = $('#_mail-envelopes-list');
			var params = {'data': FILTER_DATA,
						  'container': $container,
						  'show_loader': true}
			get_adjusted(url, params, function(response) {
				$container.html(response.template)
			});
		};
		if ($(this).val() === ''){
			FILTER_DATA = null;
		}
	});
	
	var new_message_filter_to_slctz, 
		new_message_filter_sender_slctz,
		new_message_filter_body_slctz,
		new_message_filter_accounts_slctz = null;
	
	if (get_active_sidebar_tab() == '_email-page-icon' && email_accounts.length){
		new_message_filter_to_slctz = $('#id_filter-to').selectize({
			create: false,
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
		
		new_message_filter_sender_slctz = $('#id_filter-sender').selectize({
			create: false,
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
		
		new_message_filter_accounts_slctz = $('#id_filter-accounts').selectize({
			create: false,
			openOnFocus: false,
			valueField: 'id',
			searchField: ['login'],
			options: email_accounts,
			plugins: ['remove_button'],
			render: {
				item: function(item, escape){
						return '<div style = "font-size: 100%"><span>' + item.display_name + '</span></div>';
				},
				
				option: function (item, escape) {
					return '<div style = "font-size: 100%"><span style = "text-transform:uppercase;">' + item.display_name + '</span><span style = "font-style: italic"> (' + item.login + ')</span></div>';
				}
			}
		})[0].selectize;
		
		new_message_filter_body_slctz = $('#id_filter-body').selectize({
			persist: false,
			plugins: ['remove_button'],
			create: function(input) {
				return {
					value: input,
					text: input
				}
			}
		})[0].selectize;
		
		new_message_filter_subject_slctz = $('#id_filter-subject').selectize({
			persist: false,
			plugins: ['remove_button'],
			create: function(input) {
				return {
					value: input,
					text: input
				}
			}
		})[0].selectize;
	}
	
	sync_mailboxes();
	
	get_default_folder_letters();
	
	/*
	$(document).on('contextmenu', '#mailbox_list li', function (e) {
		e.preventDefault();
		$('#mailbox_list li').removeClass('selected');
		$(this).addClass('selected');
		var $context_menu = $('#label_list_context_menu');
		$context_menu.html('');
		$context_menu.append('<li onclick = "cm_label_edit()"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + gettext("Edit") + '</a></li>')
					 .append('<li onclick = "cm_label_delete()"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext("Delete") + '</a></li>');
		$context_menu.css({ display:'block', top: e.pageY + "px", left: e.pageX + "px" });
		return;
	});
	*/
	
	$(document).on('click', '._show-folder-content', function(e){
		$("._show-folder-content.active").removeClass("active");
		$(this).addClass('active');
		var $email_envelopes_container = $('#_mail-envelopes-list'); 
		var params = {'data': {'folder_id': $(this).data('folder-id')},
					  'container': $email_envelopes_container,
					  'show_loader': true}
		get_adjusted('/a_email_envelopes/', params, function(response) {
			$email_envelopes_container.html(response.template);
		});
	});
	
	$(document).on('click', '#_id-filter-reset', function(e){
		alert("Пока не тестировать");
		// var $form = $(this).closest('form');
		// $form.find('input[type=text]').val('');
	});
	
	$(document).on('click', '._create-label-link', function(e){
		// $('#new-label-modal').modal();
		alert('Budet dostupno sovsem skoro');
	});
	
	$(document).on('click', '#_filter_icon', function(e) {
        $('#_filter_dropdown').fadeToggle('quick');
    });
	
	$(document).on('click', '#_labels_filter_icon', function(e) {
        $('#_labels_dropdown').fadeToggle('quick');
    });
	
	$(document).on('click', 'li.mail-folder', function(e) {	
		e.stopPropagation();
		$('.mail-folder').removeClass('selected');
		$(this).addClass('selected');
					
	});
	
	$(document).on('click', '._envelop-flag-important-icon', function(e) {
		e.stopPropagation();
		var $icon = $(this);
		var params = {'data': {'message_id': $icon.closest('._show-message-thread').data('message-id'),
							   'is_important': $icon.hasClass('active') ? 0 : 1}}
		post_adjusted('/a_email_set_is_important/', params, function(e) {
			$icon.toggleClass('active');
		});
	});
		
	$(document).on('click', '._envelop-flag-starred-icon', function(e) {
		e.stopPropagation();
		var $icon = $(this);
		var params = {'data': {'message_id': $icon.closest('._show-message-thread').data('message-id'),
							   'is_starred': $icon.hasClass('active') ? 0 : 1}}
		post_adjusted('/a_email_set_is_starred/', params, function(e) {
			$icon.toggleClass('active');
		});
	});
	
	$(document).on('click', '._show-message-thread', function (e) {
		// $('._show-message-thread').removeClass('selected');
		show_email_body($(this));
	});
	
	$(document).on('click', '#_new-email-btn', function(e) {
		e.preventDefault();
		var $form = $('#_new-message-popup-large');
		clear_standard_fields($form);
		NEW_EMAIL_TO_SLCTZ.clear();
		$form.modal('show');
	});
	
	$(document).on('click', '#_send_email_response', function(e) {
		alert('Hello');
	});
	
	$(document).on('click', '#_add_mailbox', function(e) {
		show_notification('Эта фунция пока доступна только из Настроек', NOTIFICATION_STATUS.IN_PROCESS, 'Перейти на "Настойки"', function(e){
			window.location = '/settings/';
		});
	});
	
	$('.expand-btn').on('click', function(e) {
		e.preventDefault();
		$('#_new-message-popup').modal('hide');
		$('.message-dialog').removeClass('dn');
	});
	
	$(document).on('click', '#create_email_label', function(e) {
		e.preventDefault();
		var $triggered_elem = $(this);
		var modal_id = $triggered_elem.data('target');
		var account_id = $(this).data('account-id');
		$(modal_id).on('show.bs.modal', function(event) {
			var head = $triggered_elem.data('head') // Extract info from data-* attribute
			var modal = $(this);
			modal.find('.modal-title').text(head);
			modal.attr('data-account-id', account_id);
		}).modal({backdrop:'static',keyboard:false});
	});
	
	$(document).on('submit', '#email_label_form', function(e) {
		e.preventDefault();
		var $form = $(this);
		var account_id = $form.attr('data-account-id')
		var data = $form.serialize() + "&account_id=" + account_id;
		zeon_post('/a_imap_label_create/', data, $form, undefined, function(response){
			$form.modal('hide');
		});
	});
	
	$(document).on('submit', '.email-write-form', function(e) {
		e.preventDefault();
		var $form = $(this);  
		var url = $form.attr('action');
		var data = $form.serialize();
		data += '&id=' + $(this).closest('.email-info-box-group').data('id');
		var params = {'data': data}
		show_notification(gettext('Sending the message...'), NOTIFICATION_STATUS.IN_PROCESS);
		$form.find('.email-write-form__textarea').val('');
		$form.closest(".email-write-container").removeClass("email-write-container--expanded");
		post_adjusted(url, params, function(response){
			show_notification(gettext('Message has been sent.'), NOTIFICATION_STATUS.SUCCESS, 'View message', function(e) { alert('Функция пока не готова')});
			// $form.closest('._email-thread-element').after(response.object.template);
		});
	});
	
	$('.modal').on('hidden.bs.modal', function () {
		$(this).find('input[type=text]').val('');
		$(this).find('input[type=email]').val('');
		$(this).find('input[type=password]').val('');
	});

	$(document).on('click', '.remove_email_account', function(e) {
		var $container = $(this).closest('.email_account_item')
		var account_name = $container.find('.email_account_name').text().trim();
		var id = $container.data('id');
		BootstrapDialog.confirm({
			message: $('<div>' + gettext('Are you sure you want to remove account <strong>' + account_name + '</strong> from your mailbox list?') + '</div>'),
			title: gettext('Remove'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes'),
			callback: function(result){		
				if(result){
					var data = {'id': id}
					$.post('/a_imap_delete_account/', data, function(response){
						$container.remove();
					});
				}
			}
		});
	});
	
	$(document).on('submit', '#new_email_form', function(e) {
		e.preventDefault();
		var $form = $(this);
		var data = $form.serialize();
		$.post('/a_send_email_smtp/', data, function(response){
			$form.modal('hide');
			$('#bound_emails_list').append(response.template)
		});
	});
	
	$(document).on('click', '#mailbox_list li', function(e) {
		e.preventDefault();
		return;
		var $form = $(this);
		var label_name = $(this).text();
		get_adjusted('/email/' + label_name + '/', function(response){
			$('#mailbox_list').html(response.template);
		});
	});
	
	$(document).on('click', '._message-actions-mark_unread', function (e) {
		e.stopPropagation();
		alert('Фунцкия будет готова вскоре');
		return;
		$(this).closest('._message-actions-list').toggleClass('dn');	
		var $message = $(this).closest('._email-thread-element');
		var message_id = $message.data('id');
		var params = {'data': {'message_ids': [message_id],
						       'flag': 'unread'}}
		post_adjusted('/a_email_set_flag/', params, function(){
			$().addClass('')
		});
	});
	
	$(document).on('click', '._message-actions-delete', function (e) {
		e.stopPropagation();
		$(this).closest('._message-actions-list').toggleClass('dn');	
		var $message = $(this).closest('._email-thread-element');
		var message_id = $message.data('id');
		var params = {'data': {'message_ids': [message_id],
						       'flag': 'trash'}}
		post_adjusted('/a_email_set_flag/', params, function(){
			$message.remove();
			show_notification(gettext('The message has been moved to Trash.'), NOTIFICATION_STATUS.SUCCESS, gettext('Undo'), function(e) { alert('Функция пока не готова')});
		});
	});
	
	$(document).on('click', '._message-actions-print', function (e) {
		e.stopPropagation();
		alert('Фунцкия будет готова вскоре');
		return;
	});
	
	$(document).on('click', '._message-actions-forward', function (e) {
		e.stopPropagation();
		alert('Фунцкия будет готова вскоре');
		return;
	});
	
	$(document).on('click', '._message-actions-add-to-calendar', function (e) {
		e.stopPropagation();
		alert('Фунцкия будет готова вскоре');
		return;
	});
	
    $(document).on('click', '.tree li.parent_li .collapser', function (e) {
		e.stopPropagation();
		var children = $(this).closest('li.parent_li').find(' > ul');
        if (children.is(":visible")) {
            children.hide('fast');
		} else {
            children.show('fast');
        }
		$(this).toggleClass('fa-caret-right fa-caret-down');
	});
	
	$(document).on('click', '#response_option', function(e) {
		var $form = $('#response_form');
		$form.attr('data-id', 8656);
		$form.attr('data', 'response');
		$form.modal('show');
	});
	
	$(document).on('submit', '#response_form', function(e) {
		e.preventDefault();
		var $form = $(this);
		var data = $form.serialize();
		data += '&id=' + $('#email_body_container').find('.email_instance').data('id');
		$.post('/email_reply/', data, function(e) {
			// $form.modal('hide');
			alert('success');
		});
	});
	
	$(document).on('submit', '#_id_filter-form', function(e) {
		e.preventDefault();
		var $form = $(this);
		FILTER_DATA = $form.serialize() + '&is_filtered=1';
		$('#_filter_dropdown').toggle();
		url = $(this).attr('action');
		var data = FILTER_DATA;
		var $container = $('#_mail-envelopes-list');
		var params = {'data': data,
					  'ajax_loader': $container}
		get_adjusted(url, params, function(response) {
			$container.html(response.object.template)
		});
	});
	
	$(document).on('click', '.email-write-form__tools-remove-icon', function(e) {
		$(this).closest(".email-write-container").removeClass("email-write-container--expanded");
	});
	
	$('#reply-top-icon').on('click', function(e) {
		var active_envelope = $('._show-message-thread.active');
		var dialog_id = active_envelope.data('dialog-id');
		var $wrap = $('#_message-thread-container').find('[data-dialog-id='+ dialog_id + ']').
												    find('._email-thread-element').last();
		$wrap.find('.email-write-container').addClass('email-write-container--expanded');
		
		var sender_email = $wrap.find('._sender-list').data('email');
		REPLY_TO_SLCTZ.setValue(sender_email);	
		var $scroller = $wrap.closest('.email-list-main-box');
		$scroller.animate({
			scrollTop: $scroller.prop('scrollHeight')
		}, 'slow');		
		$wrap.find('.email-write-form__textarea').focus();
		
	});
	
	$('#reply-all-top-icon').on('click', function(e) {
			var active_envelope = $('._show-message-thread.active');
			var dialog_id = active_envelope.data('dialog-id');
			var $wrap = $('#_message-thread-container').find('[data-dialog-id='+ dialog_id + ']').
														find('._email-thread-element').last();
			$wrap.find('.email-write-container').addClass('email-write-container--expanded');
		
			$wrap.find('.email-write-container').addClass('email-write-container--expanded');
			var sender_email = $wrap.find('._sender-list').data('email');
			var recipients_list = [sender_email];
			
			$wrap.find('._recipient-list-item').each(function(){ 
				var email = $(this).data('email'); 
				if (email !== sender_email) {
					recipients_list.push(email);
				}
			});
			REPLY_TO_SLCTZ.setValue(recipients_list);
			var $scroller = $wrap.closest('.email-list-main-box');
			$scroller.animate({
				scrollTop: $scroller.prop('scrollHeight')
			}, 'slow');		
			$wrap.find('.email-write-form__textarea').focus();
		});
		
	function sync_mailboxes() {
		var $active_folder = get_active_folder();
		var active_folder_id = $active_folder.data('folder-id'); 
		if (active_folder_id) {
			var params = {'data': {'active_folder_id': active_folder_id}} // active_folder_id}
			get_adjusted('/a_email_get_new_messages/', params, function(response){
				// refresh counters for all folders
				var folder_counters = response.folder_counters; 
				for (var i = 0; i < folder_counters.length; i++) {
					var $folder = $('._show-folder-content[data-folder-id=' + folder_counters[i].folder_id + ']');
					update_folder_counter($folder, folder_counters[i].count);
				}
				
				var total_counter = 0;
				var account_counters = response.account_counters; 
				for (var i = 0; i < account_counters.length; i++) {
					var $account = $('._email-account[data-account-id=' + account_counters[i].account_id + ']');
					total_counter += account_counters[i].count;
					update_account_counter($account, account_counters[i].count);
				}
				
				update_sidebar_counter('_email-page-icon', total_counter);
				
				new_messages_template = response.new_messages_template;
				if (new_messages_template && !FILTER_DATA) {
					$('#_mail-envelopes-list').prepend(new_messages_template);
				}
				setTimeout( sync_mailboxes, 4000 );
			});	
		}
	}	
	
	function folder_unread_msg_counter($folder) {
		var text = $folder.find('> ._unread-messages-counter').text();
		if (text !== ''){
			text = text.replace('(','');
			text = text.replace(')','');
			return parseInt(text);	
		}
		else {
			return 0;
		}
	}

	function set_folder_counter($folder, count){
		if (count > 0) {
			$folder.find('> ._unread-messages-counter').text('(' + count + ')');
		}
		else {
			$folder.find('> ._unread-messages-counter').text('');
		}
	}

	function get_default_folder_letters(){
		var active_folder_id = get_active_folder().id;
		
	}

	function get_selected_message() {
		return $('#email_list_container li.selected');
	}

	function get_active_folder(){
		var obj = $('.accordion-box__second-list-title.active');
		return obj;
	}

	function get_selected_account(){
		var selected_folder = get_active_folder();
		var selected_account = selected_folder.obj.closest('.mailbox');
		return {id : selected_account.data('id'), 
				obj  	   : selected_account}
	}

	function cm_label_edit(){
		
	}

	function cm_label_delete(){
		BootstrapDialog.confirm({
			message: $('<div>' + gettext('Are you sure you want to delete the label?') + '</div>'),
			title: gettext('Delete label'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes'),
			callback: function(result){				
				if(result){
					var label = get_selected_label();
					var data = {'name': label.name_original,
								'account_id': label.id}
					$.post('/a_imap_label_delete/', data, function(response){
						label.obj.remove();
					});
				}
			}
		});
	}
	
	function show_email_body($envelope){
		$envelope.addClass('active').siblings().removeClass('active');
		var $container = $('#_message-thread-container'); 
		var dialog_id = $envelope.data('dialog-id');
		get_adjusted('/a_email_thread/' + dialog_id + '/', function(response){
			$container.html(response.template);
		
		
			REPLY_TO_SLCTZ = $container.find('._email-to:last-child').selectize({
				create: function(input) {
					if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
						return {email: input};
					}
					var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
					if (match) {
						return {email: match[2]}
					}
					invalid_input_alert('Invalid email address');
					return false;
				},
				persist: false,
				openOnFocus: false,
				valueField: 'email',
				searchField: ['name', 'email'],
				options: emails,
				plugins: ['remove_button'],
				closeAfterSelect: true,
				render: {
					item: function(item, escape){
						if (item.name){
							return '<div class="fs13"><span style = "text-transform:uppercase;">' + 
										item.name + '</span><span style = "font-style: italic"> (' + 
										item.email.substr(item.email.indexOf('@') + 1, item.email.length) + ')</span></div>';
						}
						else {
							return '<div class="fs13"><span style = "font-style: italic"> ' + item.email + '</span></div>';
						}
					},

					option: function (item, escape) {
						return '<div class="fs13"><img src="' + "/static/img/user_profile/Vladimir_Putin_12023.png" + '" /><span>' + item.name + '</span><span style = "font-style: italic"> ' + item.email + '</span></div>';
					}
				}
			})[0].selectize;
			
			control_unread_status($envelope, 'read');
			
			$('._reply-link').on('click', function(e) {
				$(this).closest('.email-write-container').addClass('email-write-container--expanded');
				
				var $wrap = $(this).closest('._email-thread-element');
				var sender_email = $wrap.find('._sender-list').data('email');
				REPLY_TO_SLCTZ.setValue(sender_email);
				var $scroller = $wrap.find('.email-list-main-box');
				$scroller.scrollTop($scroller.prop('scrollHeight'));		
				$wrap.find('.email-write-form__textarea').focus();
			});
			
			$('._reply-all-link').on('click', function(e) {
				$(this).closest('.email-write-container').addClass('email-write-container--expanded');
				var $wrap = $(this).closest('._email-thread-element');
				var recipients_list = [$wrap.find('._sender-list').data('email')];
				$(this).closest('.email-info-box-group').find('._recipient-list ._recipient-list-item').each(function(){
					recipients_list.push($(this).data('email'));
				});
				REPLY_TO_SLCTZ.setValue(recipients_list);
				var $scroller = $wrap.find('.email-list-main-box');
				$scroller.scrollTop($scroller.prop('scrollHeight'));		
				$wrap.find('.email-write-form__textarea').focus();
			});
			
			$container.find('.download-icon').on('click', function(e) {
				var attachment_id = $(this).closest('.attachments-list__item').data('attachment-id');
				// var data = {'attachment_id': attachment_id}
				var url = '/a_imap_attachment_download/' + attachment_id + '/';
				window.location = url;	
			});
			
			$container.find('.drive-icon').on('click', function(e) {
				var attachment_id = $(this).closest('.attachments-list__item').data('attachment-id');
				var data = {'attachment_id': attachment_id}
				var url = '/a_imap_attachment_save_to_drive/';
				$.post(url, data, function(e) {
					alert("Success");
				});	
			});
				
			$('#forward-top-icon').on('click', function(e) {
				alert('Will be available soon');
			});
			
			$container.find('._forward-link').on('click', function(e) {
				alert('Will be available soon');
			});
			
			$container.find('._heading-flag-starred-icon').on('click', function(e){
				e.stopPropagation();
				var $icon = $(this);
				var message_id = $icon.closest('._email-thread-element').data('id');
				data = {'message_id': message_id,
						'is_starred': $icon.hasClass('active') ? 0 : 1}
				$.post('/a_email_set_is_starred/', data, function(e) {
					$icon.toggleClass('active');
					$('._show-message-thread[data-message-id = ' + message_id + ']').find('._envelop-flag-starred-icon').toggleClass('active');
				});
			});
			
			$container.find('._heading-flag-important-icon').on('click', function(e){
				alert('Будет готово в следующих версиях');
			});
			
			$container.find('._message-actions-reply-btn').on('click', function(e){
				e.stopPropagation();
				$('._message-actions-list').toggleClass('dn');		
			});
			
			$container.find('._message-actions-reply').on('click', function(e){
				e.stopPropagation();
				$(this).closest('ul').addClass('dn');
				var $wrap = $(this).closest('._email-thread-element');
				$wrap.find('.email-write-container').addClass('email-write-container--expanded');
				var sender_email = $wrap.find('._sender-list').data('email');
				REPLY_TO_SLCTZ.setValue(sender_email);
				var $scroller = $wrap.closest('.email-list-main-box');
				$scroller.scrollTop($scroller.prop('scrollHeight'));	
				$wrap.find('.email-write-form__textarea').focus();
			});
			
			$container.find('._message-actions-reply-all').on('click', function(e){
				e.stopPropagation();
				$(this).closest('ul').addClass('dn');
				var $message = $(this).closest('._email-thread-element');
				$message.find('.email-write-container').addClass('email-write-container--expanded');
				
				var sender_email = $message.find('._sender-list').data('email');
				var recipients_list = [sender_email];
				
				$message.find('._recipient-list-item').each(function(){ 
					var email = $(this).data('email'); 
					if (email !== sender_email) {
						recipients_list.push(email);
					}
				});
				REPLY_TO_SLCTZ.setValue(recipients_list);
				var $wrap = $(this).closest('._email-thread-element');
				var $scroller = $wrap.closest('.scroller-block');
				$scroller.scrollTop($scroller.prop('scrollHeight'));		
				$wrap.find('.email-write-form__textarea').focus();
			});
			
		});
	}
	
	function control_unread_status($envelope, status) {
		if (status == 'read'){
			if ($envelope.find('.person-info-box__name').hasClass('font-bold')){
				
				var delta = -1;
				
				// Decrementing folder counter
				var $selected_folder = get_active_folder();
				
				update_folder_counter($selected_folder, delta);
				
				var $account = $selected_folder.closest('.accordion-box__content-box').prev();
				update_account_counter($account, delta);
				
				update_sidebar_counter('_email-page-icon', delta);
				$envelope.find('.person-info-box__name').removeClass('font-bold');
				$envelope.find('.person-info-box__subject').removeClass('font-bold');
			}
		}
	}
	
	function update_folder_counter($folder, delta){
		var unread_counter = folder_unread_msg_counter($folder);
		unread_counter += delta;
				
		if (unread_counter > 0) {
			$folder.find('> ._unread-messages-counter').text(' (' + unread_counter + ')');
		}
		else {
			$folder.find('> ._unread-messages-counter').text('');
		}
	}
	
	function update_account_counter($account, delta){
		// var unread_counter += delta;
		var $notification_ring = $account.find('._account-news-counter');
	
		var unread_counter = 0;
		if ($notification_ring.text() !== "") {
			unread_counter = parseInt($notification_ring.text());
		}
		unread_counter += delta;
		if (unread_counter > 0) {
			$notification_ring.removeClass('dn').addClass('db').text(unread_counter);
		}
		else {
			$notification_ring.removeClass('db').addClass('dn').text('');
		}
	}
	
	function update_sidebar_counter(icon_id, delta) {
		
		if (delta !== 0) {
			var $notification_ring = $('#' + icon_id + ' .notification-ring');
			
			if ($notification_ring.length == 0) {
				$('#' + icon_id).find('.nav__icon').html('<span class="notification-ring font-bold roboto-medium tc">' + delta + '</span>');
			}
			else {
				var unread_counter = parseInt($notification_ring.text()) + delta;
				if ($notification_ring.length) {
					if (unread_counter > 0){
						$notification_ring.text(unread_counter);
					}
					else {
						$notification_ring.remove();
					}
				}
			}
		}
	}

});