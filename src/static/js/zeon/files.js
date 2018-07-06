$(function(){
	
	var content_wrapper = $('#content-wrapper');
	content_wrapper.on('click', '._view-mode', function(){
		$(this).toggleClass('switcher-list__link--list switcher-list__link--cell');
		$('#file-list-wrapper').children().toggleClass('dn');
	});
	
	/*
	content_wrapper.on('click', '._select-mode', function(){
		
		get_adjusted('/google_drive/', function(response){
			if (response.template){
				
			}
			else {
				window.location.href = response.authorize_url;
			}
		});
		
		if($(this).text() === gettext("Select")) {
			$(this).text(gettext("Cancel"));
		}
		else {
			$(this).text(gettext("Select"));
		}
		
		$('#file-list-wrapper table tr td:first-child').toggleClass('dn');
		$('#file-list-wrapper table tr td:nth-child(2)').toggleClass('dn');
		$('#file-list-wrapper .files-list-form ').toggleClass('dn');
	});
	*/
	content_wrapper.on('click', '#google-drive-sidetree ._open-folder', function(){
		$('#file-path').append('<li class="bread-crumb__item fl font-bold">' + $(this).text() + '</li>');
		var folder_id = $(this).data('folder-google-id');
		get_adjusted('/google_drive/' + folder_id + '/', function (response){
			$('#file-list-wrapper').html(response.template);
		});
	});
	
	$(document).on('click', '.export_google_file', function(e){
		e.preventDefault();
		var file_id = $(this).closest('tr').data('id');
		var data = {'file_id': file_id}
		var form = $('#google_drive_download');
		form.find('input').val(file_id);
		form.submit();
	});
	
	$(document).on('click', '#test_button', function(e){
		$.post('/a_send_email_smtp/', function(){
			alert('Success');
		});
	});
	
	$(document).on('click', '#google-drive', function(e){
		e.preventDefault();
		zeon_post('/a_files_google/', {}, undefined, undefined, function(response){
			$('#file-group-content').html(response.template);
		});
	});
	
	$(document).on('dblclick', '.google-drive-folder', function(e){
		e.preventDefault();
		var folder_id = $(this).data('id');
		var name = $(this).find('td.name').text();
		var data = {'folder_id': folder_id}
		zeon_post('/a_files_google/', data, undefined, undefined, function(response){
			$('#file-group-content').html(response.template);
			$('#current-path').attr('data-active-file-id',folder_id);
			$('#current-path').html($('#current-path').html() + '<span data-id = ' + folder_id + '>' + name + '</span>');
		});
	});
	
	$(document).on('click', '#current-path span', function(e){
		e.preventDefault();
		var folder_id = $(this).data('id');
		var data = {'folder_id': folder_id}
		var $this = $(this);
		zeon_post('/a_files_google/', data, undefined, undefined, function(response){
			$('#file-group-content').html(response.template);
			$('#current-path').attr('data-active-file-id',folder_id);
			$this.nextAll().remove();
		});
	});
	
	$(document).on('click', '#google_drive_upload', function(e){
		e.preventDefault();
		alert('Hello');
	});
	
	$(document).on('click', '#google-drive-new-folder', function(e){
		BootstrapDialog.show({
            message: 'Folder name: <input type="text" class="form-control">',
            buttons: [ 
					  {
						label: gettext('Ok'),
						cssClass: 'btn-primary',
						data: {
							js: 'btn-confirm'
						},
						action: function(dialogRef) 
						{
							var folder_name = dialogRef.getModalBody().find('input').val();
							if(folder_name === '') {
								alert('Folder name required');
								return false;
							}
							else {
								var data = {'folder_name': folder_name,
										    'parent_folder_id': $('#current-path').data('active-file-id')};
								zeon_post('/a_files_google_create/', data, undefined, undefined, function(response){
									dialogRef.close();
									$('#google_drive_list_container').append(response.template);
								});
							}	
						}
					  }, 
					  {
						label: gettext('Cancel'),
						action: function(dialogItself) {
							dialogItself.close();
						}
					  }
				    ]
        }); 
	});

	
	$(document).on('contextmenu', '#google_drive_list_container tr', function (e) {
		e.preventDefault();
		
		var $context_menu = $('#file_list_context_menu');
		if ($(this).hasClass('selected') === false){
			$(this).siblings().removeClass('selected');
		}
		$(this).addClass('selected');
		
		$context_menu.html('');
		if ($('#google_drive_list_container').find('tr.selected').length == 1){
			$context_menu.append('<li onclick = "cm_dialog_copy()"><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ' + gettext("Rename") + '</a></li>');
		}
		$context_menu.append('<li onclick = "cm_google_drive_delete()"><a href="#"><i class="fa fa-trash"></i>&nbsp; ' + gettext("Delete") + '</a></li>');
		$context_menu.css({ display:'block', top: e.pageY + "px", left: e.pageX + "px" });
		return;
	});
	
	$(document).on('submit', '#google_drive_upload_files', function(e){
		e.preventDefault();
		var data = new FormData(this);
		$.ajax({
			url: $(this).attr('action'),
			type: $(this).attr('method'),
			data: data,
			cache: false,
			processData: false,
			contentType: false,
			success: function(response) {
				$('#google_drive_list_container').append(response.object.template);
			}
		});
		return false;
	});
});

function cm_google_drive_delete(){
	var json_obj = [];
	var $selected_rows = $('#google_drive_list_container tr.selected'); 
	$selected_rows.each(function (){
		json_obj.push($(this).data('id'));
	});
	var data = {'ids': JSON.stringify(json_obj)}
	var $this = $(this);
	zeon_post('/a_files_google_delete/', data, undefined, undefined, function(response){
		$selected_rows.remove();
	});
}