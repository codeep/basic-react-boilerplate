$(function(){
	$('.datepicker').datetimepicker({
		inline: true,
		sideBySide: false,
		useCurrent: false,
		locale: 'ru',
		format: 'DD MMM YYYY'
	});
	
	$('#test1').click(function(e){
		e.preventDefault();
		focusAndPlaceCaretAtEnd(document.getElementById("aaaaaaaaa"));
	});
	$(".datepicker").on("dp.change", function (e) {
		$(this).closest('.task_wrap, .new_task_wrap').find('.due_date').attr('data-due-date', e.date);
		$(this).closest('.task_wrap, .new_task_wrap').find('.due_date').text(customized_date(e.date));
		
		var $task_wrap = $(this).closest('.task_wrap, .new_task_wrap');
		// If this is existing task
		if ($task_wrap.hasClass('task_wrap')){
			var data = {'id': $task_wrap.closest('.wrap').data('task-id'),
						'date_due': e.date.valueOf()}
			zeon_post('/a_task/', data, undefined, undefined, undefined);
		}
	});
	
	$(document).on('click', '.task_list .wrap', function(e){
		var sel = getSelection().toString();
		// if no text is highlighted
		if(!sel){ 
			$('.task_list li.wrap').removeClass('selected');
			$wrap = $(this);
			open_task_description($wrap);
		}
	});
	
	$(document).on('change', '[id^=id_task_implementers-][id$=-role]', function(){
		var task_id = $('.task_list li.wrap.selected').data('task-id');
		var data = $('#task_details_implementers_wrap').serialize();
		zeon_post('/a_task_implementers/' + task_id + '/', data, undefined, undefined, function(response){
			$('#task_details_implementers_wrap').html(response.object);
			zeon_get('/a_task/' + task_id + '/', undefined, undefined, function(response){
				$('.task_list li.wrap[data-task-id = ' + task_id + ']').html(response.template);
			});
		});
	});

	$(document).on('change', '.send_notification input[type="checkbox"]', function(event){
		var $contact_values = $(this).closest('.dropdown-content').find('.contact_values');
		$contact_values.toggle();
	});
  
	$(document).on('keydown', '._create_task', function(e) {
		var $this = $(this);
		var text = $this.prop('innerText');
		if (e.which == 13 && e.shiftKey == false) {
			e.preventDefault();
			if (text !== ''){
				var $task_wrap = $this.closest('.new_task_wrap'); 
				
				var implementers_count = get_task_implementers_count();
				var is_assignment;
				var tab = get_active_tab_id();
				if (tab === 'assigned_to_others') {
					is_assignment = 1;
				}				
				else {
					is_assignment = 0;
				}
				
				var $form = $('#implementer_form'); 
				var data = $form.serialize() + '&' + 
						   'description' + '=' + text + '&' +	
						   'is_assignment' + '=' + is_assignment;
				if ($this.closest('.new_task_wrap').find('.due_date').data('due-date') !== '')
				{
					data = data + '&' + 'date_due' + '=' + $this.closest('.new_task_wrap').find('.due_date').data('due-date');
				}
				create_task(data, function(response){
					$this.html('');
					$this.closest('.new_task_wrap').find('.due_date').data('due-date', '');
					$this.closest('.new_task_wrap').find('.due_date').text('');
					$('#tasks_all_list').prepend(response.template);
					if (tab == 'all') {
						if (implementers_count == 0){
							$('#own_tasks_list').prepend(response.template);
							// set_fixed_middle_note(gettext('Task has been moved to "Unassigned" section'));
						}
						else{
							$('#assignments_list').prepend(response.template);
						}
					}				
					else if (tab == 'own') {
						if (implementers_count > 0){
							$('#assignments_list').prepend(response.template);
							set_fixed_middle_note(gettext('Task has been moved to "Assignments" section'));
						}
						else{
							$('#own_tasks_list').prepend(response.template);
						}
					}
					else if (tab == 'assigned_to_others') {
						if (implementers_count > 0){
							$('#assignments_list').prepend(response.template);
							var data = {'task_id': response.task_id}
							}
						else{
							$('#unassigned_list').prepend(response.template);
							set_fixed_middle_note(gettext('Task has been moved to "Unassigned" section'));
						}
					}
					else if (tab == 'unassigned') {
						if (implementers_count > 0){
							$('#assignments_list').prepend(response.template);
							set_fixed_middle_note(gettext('Task has been moved to "Assigments" section'));
						}
						else {
							$('#unassigned_list').prepend(response.template);
						}
					}
					if (is_assignment == 1 && implementers_count > 0) {	
						var data = {'task_id': response.task_id}
						zeon_post('/a_task_send_assignment_letter/', data, undefined, undefined, undefined);
					}
					refresh_task_counters();
				});
			}
		}
	});
		
	$(document).on('click', '._create_subtask', function(e) {
		var task_id = get_selected_task_id();
		var $list = $('.task_list');
	
		var data = {'description': '',
					'parent': task_id,
					'is_assignment': 0}
		create_task(data, function(response){
			var last_child = $list.find('[data-parent-id = ' + task_id + ']:last');
			if (last_child.length == 0)
				$list.find('[data-task-id = ' + task_id + ']:last').after(response.template);
			else
				last_child.after(response.template);
			focusAndPlaceCaretAtEnd($list.find('[data-task-id = ' + response.task_id + ']:last .description')[0]);
			show_children_container(task_id, 'show');
		});
	});
	
	$(document).on('keydown', '.first_row > .description', function(e) {
		/*
		var inputs = $('.description_wrap > .description');
		var idx = inputs.index(this);
		switch(e.which)
		{
			// key down
			case 40: 
				e.preventDefault();
				if (idx !== inputs.length - 1) 
				{
					focusAndPlaceCaretAtEnd(inputs[idx + 1]);
					// inputs[idx + 1].focus();
				}
				break;
			// key up
			case 38:
				e.preventDefault();
				if (idx > 0)
				{
					focusAndPlaceCaretAtEnd(inputs[idx - 1]);
					// inputs[idx - 1].focus();
				}
				break;
			default: break; // exit this handler for other keys
		}
		*/
		
		var $ol = $(this).closest('ol');
		var $selected = $ol.find('.selected');
		if ($ol.length > 0 && $selected.length > 0){
			if (e.which === 40 || e.which === 38 || e.which === 13){
				if (e.which === 40 || e.which === 13) // Enter or Key Down
				{
					e.preventDefault();			
					if ($selected.next().length){
						var task_id = 
						$selected.removeClass('selected');
						$selected = $selected.next(':visible'); 
						focusAndPlaceCaretAtEnd($selected.find('.description')[0]);
						// var selected_index = $selected.index();
						open_task_description($selected);
					}
				}
				else if (e.which === 38)
				{
					e.preventDefault();			
					$selected.removeClass('selected');
					if ($selected.prev().length !== 0){
						$selected = $selected.prev();
						focusAndPlaceCaretAtEnd($selected.find('.description')[0]);
						open_task_description($selected);
					}
					else {
						tab = 1;
						// $('#_create_task').
					}
				}
				var item_height = $selected[0].offsetHeight;
				$ol[0].scrollTop = $selected[0].offsetTop - item_height*2;
			}
		}
		return;
	});

	$(document).on('keyup', '._edit_task', function(e){
		var $contenteditable = $(this);
		var data = {'id': $contenteditable.closest('.wrap').data('task-id'),
					'description': $contenteditable.prop('innerText')}; 
		zeon_post('/a_task/', data, undefined, undefined, undefined);
	});
	
	$(document).on('click', '._hide_approved_task', function(e){
		e.stopPropagation();
		var $wrap = $(this).closest('.wrap');
		var data = {'id': $wrap.data('task-id'),
					'is_visible': 0};
		zeon_post('/a_task/', data, undefined, undefined, function(){
			$wrap.remove();
		});
	});
	
	$(document).on('click', '._show_children', function(e){
		e.stopPropagation();
		$(this).toggleClass('fa-ellipsis-h fa-ellipsis-v');
		var $this = $(this);
		var $wrap = $this.closest('.wrap');
		var lft = $wrap.data('lft');
		var rgt = $wrap.data('rgt');
		
		
		var task_id = $(this).closest('.wrap').data('task-id');
		// If the clicked node has children
		if ($wrap.next().data('parent-id') === $wrap.data('task-id')) {	
			// if children are visible	
			
			if ($wrap.next().is(':visible'))
			{
				zeon_get('/a_task_get_children/' + task_id +'/', undefined, undefined, function (response){ 
					$('.task_list .wrap').filter(function() {
						return (response.values.indexOf($(this).data('task-id')) !== -1);
					}).toggle(false);
				});
			}
			else
			{
				// show only direct children
				$wrap.nextAll('[data-parent-id = ' + task_id + ']').toggle(true);
			}
		}
		else{	
			var data = {'parent': task_id}
			var $this = $(this);
			zeon_post('/tasks/', data, undefined, undefined, function(response){
				$this.closest('.wrap').after(response.template);
			});
		}
	});
	
	$(document).on('click', '._delete_task', function(e){
		var json_obj = []
		var task_id = get_selected_task_id();
		json_obj.push(task_id);
		var data = {'tasks':JSON.stringify(json_obj)};	
		zeon_post('/delete_tasks/', data, undefined, undefined, function(template){
			var $li = $('.task_list').find('[data-task-id = ' + task_id + ']:last');
			remove_task($li);
		});
	});
	
	$(document).on('contextmenu', '.task_wrap .box', function (e) {
		e.preventDefault();
		var $context_menu = $('#task_list_context_menu');
		$context_menu.html('');
		
		var selected_task_id = $(this).closest('.wrap').data('task-id')
		var $li = $('.task_list').find('[data-task-id = ' + selected_task_id + ']:last');
		var task_is_editable = $li.hasClass('editable');
		
		if (task_is_editable){
			$context_menu.append('<li class = "_create_subtask"><a href="#"><i class="fa fa-sitemap"></i>&nbsp; ' + gettext('Add subtask') + '</a></li>')
			$context_menu.append('<li class="divider"></li>')
			$context_menu.append('<li class = "_delete_task"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext('Delete task') + '</a></li>');
		}
		$context_menu.append('<li onclick = "cm_tasks_print()"><a style = "color: #dadada;" href="#"><i class="fa fa-print"></i>&nbsp; ' + gettext("Print") + '</a></li>')
		
		$context_menu.css({ display:'block', top: e.pageY + "px", left: e.pageX + "px" });
		$('#tasks_list_wrap').data('clicked-task-id', selected_task_id);
        $('.task_list li.wrap').removeClass('selected');
		$li.addClass('selected');
		return;
	});
	
	$(document).on('contextmenu', '#task-group-list li.project', function (e) {
		e.preventDefault();
		e.stopPropagation();
		var $context_menu = $('#task_group_wrap_context_menu');
		$context_menu.html('');
		$context_menu.css({ display:'block', top: e.pageY + "px", left: e.pageX + "px" });
		$context_menu.append('<li class = "_edit_task_folder"><a href="#"><i class="fa fa-pencil"></i>&nbsp; ' + gettext('Rename') + '</a></li>');
		$context_menu.append('<li class = "_delete_task_folder"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext('Delete folder') + '</a></li>');
		return;
	});
	
	$(document).on('click', '._set_task_status_awaiting_approval', function(e){
		var $wrap = $(this).closest('.wrap');
		
		var data = {'id': $wrap.data('task-id'),
					'status_id': 'AWAITING_APPROVAL'};
		zeon_post('/a_task/', data, undefined, undefined, function(){
			me_and_children($wrap).remove();
			zeon_post('/a_task_status_email/', data, undefined, undefined, undefined);
		});
	});
	
	$(document).on('click', '._set_task_status_approved', function(e){
		var $wrap = $(this).closest('.wrap');
		
		var data = {'id': $wrap.data('task-id'),
					'status_id': 'APPROVED'};
		var $content = $('<div class="form-group">' + 
							'<label for="comment">' + gettext('Comments') + ':</label>' +
							'<textarea class="form-control" rows="5" id="comment"></textarea>' +
						 '</div>');
		BootstrapDialog.confirm({
			message: $content,
			title: gettext('Reject task'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('Cancel'),
			btnOKLabel: gettext('Send'),
			callback: function(result){				
				if(result){
					data['approval_comment'] = $content.find('#comment').val();
					zeon_post('/a_task/', data, undefined, undefined, function(){
						me_and_children($wrap).remove();
						zeon_post('/a_task_status_email/', data, undefined, undefined, undefined);
					});
				}
			}
		});
	});
	
	$(document).on('click', '._set_task_status_reject', function(e){
		var $wrap = $(this).closest('.wrap');
		var data = {'id': $wrap.data('task-id'),
					'status_id': 'REJECTED'};
		var $content = $('<div class="form-group">' + 
							'<label for="comment">' + gettext('Comments') + ':</label>' +
							'<textarea class="form-control" rows="5" id="comment"></textarea>' +
						 '</div>');
		BootstrapDialog.confirm({
			message: $content,
			title: gettext('Reject task'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('Cancel'),
			btnOKLabel: gettext('Send'),
			callback: function(result){				
				if(result){
					data['rejection_comment'] = $content.find('#comment').val();
					zeon_post('/a_task/', data, undefined, undefined, function(){
						me_and_children($wrap).remove();
						zeon_post('/a_task_status_email/', data, undefined, undefined, undefined);
					});
				}
			}
		});
	});

	$(document).on('keydown', '._task_comments_create', function(e) {
		if (e.which == 13 && e.shiftKey == false) {
			e.preventDefault();
			var $contenteditable = $(this);
			var task_id = $('.task_list li.wrap.selected').data('task-id');
			var data = {'text': $contenteditable.prop('innerText'),
						'task_id': task_id}
			zeon_post('/a_task_comments_create/', data, undefined, undefined, function(response){
				$('#task_comments_list').append(response.template);
				$contenteditable.html('');
			});
		}
	});
	
	$(document).on('click', '._task_comments_delete', function(e) {
		var $li = $(this).closest('li');
		var task_comment_id = $li.data('id'); 
		var data = {'id': task_comment_id}
		BootstrapDialog.confirm({
			message: $('<div>' + gettext('Do you want to delete this comment?') + '</div>'),
			title: gettext('Delete comment'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes'),
			callback: function(result){				
				if(result){
					
					zeon_post('/a_task_comments_delete/', data, undefined, undefined, function(response){
						$li.remove();
					});
				}
			}
		});
	});
	
	$(document).on('click', '._task_imeplementer_delete', function(e){
		var $implementer = $(this).closest('.implementer, .onlooker');
		var data = {'task_implementer_id': $implementer.data('task-implementer-id')}
					
		BootstrapDialog.confirm({
			message: gettext('Delete the assignee?'),
			title: gettext('Delete assignee'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('Cancel'),
			btnOKLabel: gettext('Delete'),
			callback: function(result){				
				if(result){
					zeon_post('/a_task_delete_implementer/', data, undefined, undefined, function(response){
						$implementer.remove();
						refresh_task_implementers();
					});
				}
			}
		});
	});
	
	$(document).on('click', '._add-implementers-list', function(e) {
		var $li = $(this).closest('li').addClass('selected');
		var $triggered_elem = $(this);
		var modal_id = $triggered_elem.data('target');
		var $modal = $(modal_id);
		var head = $triggered_elem.data('head') // Extract info from data-* attributes
		$modal.find('.modal-title').text(head);
		
		if ($modal.data('new-task') == 'yes'){
			$.get('/a_task_implementers/', function(template){
				implementer_email_selectize($('#implementer-email'));
				$modal.data('new-task', 'no');
				$modal.find('#implementers_wrap').html(template.object);
			});
		}
		
		$modal.modal({backdrop:'static',keyboard:false});
	});
	
	$(document).on('click', '._edit-implementers-list', function(e) {
		var $li = $(this).closest('li').addClass('selected');
		var $triggered_elem = $(this);
		var modal_id = $triggered_elem.data('target');
		var $modal = $(modal_id);
		var head = $triggered_elem.data('head') // Extract info from data-* attributes
		$modal.find('.modal-title').text(head);
		$modal.find('#implementers_wrap').html('');
		$modal.data('new-task', 'yes');	
		var task_id = get_task_id($(this));
		
		$.get('/a_task_implementers/' + ((task_id) ? ((task_id) + '/') : ''), function(template){
			implementer_email_selectize($('#implementer-email'));
			$modal.data('task-id', task_id);
			$modal.find('#implementers_wrap').html(template.object);
		});
		$modal.modal({backdrop:'static',keyboard:false});
	});

	$(document).on('click', '#_task_implementers_save', function(e){
		e.preventDefault();
		var $modal = $(this).closest('form.modal');
		var task_id = $(this).closest('form.modal').data('task-id');
		if (task_id){
			var data = $modal.serialize();
			zeon_post('/a_task_implementers/' + task_id + '/', data, undefined, undefined, function(response){
				$('[data-task-id = ' + task_id + ']').html(response.template);
			});
		}
		else {
			$modal.data('new-task','no');
		}
		
		$modal.modal('hide');
		var $selected_li = $('li.selected');
		var t = $selected_li.find('.description')
		//$selected_li.removeClass('selected');
		focusAndPlaceCaretAtEnd(t[0]);
	});
});

function open_task_description($wrap){
	var $description = $wrap.find('.description');
	$wrap.addClass('selected');
	var task_id = get_task_id($description);
	zeon_get('/a_task_details/' + task_id + '/', undefined, undefined, function(response){
		$('#task_details_wrap').html(response.template);
		$wrap.removeClass('unviewed');
		edit_sidebar_counter('l_tasks', -1);
		$('#implementer-email').selectize({
			// maxItems: 1,
			closeAfterSelect: true,
			valueField: 'email',
			labelField: 'email',
			placeholder: gettext('Enter email'),
			searchField: ['email'],
			persist: false,
			openOnFocus: false,
			options: task_implementers,
			create: true,
			render: {
				option: function(data, escape) {
					return '<div class="implementer_contact_option">' +
								'<div class = "zeon_row">' +
								   '<div class = "photo">' + 
										'<img src="/static/media/images/no_image.jpg" class="img-circle" alt="Cinque Terre" width="30" height="30">' +
								   '</div>' + 
								   '<div class = "info">' + 
										'<div class = "info">' + 
											((data.email) ? ('<div class = "contacts">' + escape(data.email) + '</div>') : '') +
										'</div>' +
								   '</div>' + 
							   '</div>' + 
						   '</div>';
				},
			},
			onChange: function (value) {
				if (value !== ""){ // This is bad code. Function is called twice, that's why I do this check
					var obj = $(this);
					obj[0].setValue("");
					var email = value;
					var $item = $('#task_details_implementers_wrap .formset-item:last-child');
					$item.find('.email input').val(email);
					$item.removeClass('extra');
					$item.find('.formset-mark-deleted').css('display', 'inline-block');
					add_formset($item, $item.data('prefix'), 'invisible');
					var $task = $('.task_list li.wrap.selected');
					var task_id = $task.data('task-id');
					var data = $('#task_details_implementers_wrap').serialize();
					zeon_post('/a_task_implementers/' + task_id + '/', data, undefined, undefined, function(response){
						$('#task_details_implementers_wrap').html(response.template);
						zeon_get('/a_task/' + task_id + '/', undefined, undefined, function(response){
							$('.task_list li.wrap[data-task-id = ' + task_id + ']').html(response.template);
							var tab = get_active_tab_id();
							if (value !== ''){
								if (tab == 'own') {
									set_fixed_middle_note(gettext('Task has been moved to "Assigned to others" section'));
									$('#assignments_list').prepend($task[0].outerHTML);
									$task.remove();
									refresh_task_counters();
								}
								else if (tab == 'all') {
									$('#own_tasks_list').find('[data-task-id = ' + task_id + ']').remove();
									$('#assignments_list').prepend($task[0].outerHTML);
									refresh_task_counters(); 
								}
								
								var data = {'task_id': task_id}
								zeon_post('/a_task_send_assignment_letter/', data, undefined, undefined, undefined);
							}
						});
					});
				}
			}
		});
	});
}


function show_children_container(task_id, show_flg){
	if (show_flg === 'show'){
		$('[data-task-id = ' + task_id + ']').find('.show_children_container').css('display', 'block').find('.fa-ellipsis-h').toggleClass('fa-ellipsis-h fa-ellipsis-v');
	}
	else if (show_flg === 'hide'){
		$('[data-task-id = ' + task_id + ']').find('.show_children_container').css('display', 'none').find('.fa-ellipsis-h').toggleClass('fa-ellipsis-h fa-ellipsis-v');
	}
}

function get_active_tab_id(){
	return $('#task-group-list').find('li.active a').attr('href').replace('#', '');
}

function get_task_implementers_count(){
	var $form = $('#implementer_form'); 
	return $form.find('.formset-item').not('.deleted, .extra').length;
}

function get_selected_task_id(){
	return $('.task_list li.selected').data('task-id');
}

function implementer_email_selectize($el) {
	$el.selectize({
		// maxItems: 1,
		closeAfterSelect: true,
		valueField: 'email',
		labelField: 'email',
		placeholder: gettext('Enter email'),
		searchField: ['email'],
		persist: false,
		openOnFocus: false,
		options: task_implementers,
		create: true,
		render: {
			option: function(data, escape) {
				return '<div class="implementer_contact_option">' +
							'<div class = "zeon_row">' +
							   '<div class = "photo">' + 
									'<img src="/static/media/images/no_image.jpg" class="img-circle" alt="Cinque Terre" width="30" height="30">' +
							   '</div>' + 
							   '<div class = "info">' + 
									'<div class = "info">' + 
										((data.email) ? ('<div class = "contacts">' + escape(data.email) + '</div>') : '') +
									'</div>' +
							   '</div>' + 
						   '</div>' + 
					   '</div>';
			},
		}
	});
}

function get_task_id($this){
	return $this.closest('.wrap').data('task-id');
}

function remove_task($this){
	var $li = $this.closest('li');
	var task_id = get_task_id($li);
	var parent_id = $li.data('parent-id');
	$('[data-task-id = ' + task_id +']').each(function(){
		var $wrap = $(this).closest('.wrap');
		me_and_children($wrap).remove();
	});
	
	if (parent_id) {
		if ($('[data-parent-id = ' + task_id + ']').length === 0){
			show_children_container(parent_id, 'hide');
		}
	}
	refresh_task_counters();
}

function refresh_task_counters(){
	$('.task_list').each(function(){
		refresh_task_counter_overall($(this).attr('id'));
	});
}

function me_and_children($wrap){
	var lft = $wrap.data('lft'); 
	var rgt = $wrap.data('rgt');
	return $('.task_list .wrap').filter(function() {
		return ($(this).data('lft') >= lft) && ($(this).data('rgt') <= rgt);
	});
}

function create_task(data, callback){
	zeon_post('/a_task_create/', data, undefined, undefined, function(response){
		callback(response);
	});
}

function refresh_task_counter_overall(list_id){
	var counter = parseInt($('#' + list_id).find('li').length);
	$('[href="#' + $('#' + list_id).closest('.tab-pane').attr('id') + '"]').find('._counter_overall').text(counter);			
}

function refresh_task_implementers(){
	var task_id = $('.task_list li.wrap.selected').data('task-id');
	var data = $('#task_details_implementers_wrap').serialize();
	zeon_get('/a_task_implementers/' + task_id + '/', undefined, undefined, function(response){
		$('#task_details_implementers_wrap').html(response.template);
	});
}

function cm_add_comment(){
	var task_id = $('#tasks_tab').data('clicked-task-id'); 
	var data = {'id': task_id}
	zeon_post('/a_task_comments/', data, undefined, undefined, function(response){
		$('#comments_form .modal-body').html(response.template);
		$('#comments_form').data('task-id', task_id);
		$('#comments_form').modal({backdrop:'static',keyboard:false});
	});
}

function cm_tasks_print(){
	alert_info(gettext('Will be available in subsequent versions'));
}