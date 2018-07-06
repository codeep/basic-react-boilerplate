$(function(){
	
	$(document).on( 'change','#default_calendar_account', function(e){
		var selected_value = $(this).val();
		var selected_option = $(this).find('option:selected').text().trim();
		var params = {'data': {'calendar_account_id': selected_value}}
		post_adjusted('/change_default_account/', params, function(){
			show_notification('Changes have been saved');
			
		});
	});
	
	$(document).on( 'change','select.user-setting', function(e){
		// var selected_value = $(this).val();
		// var selected_option = $(this).find('option:selected').text().trim();
		var settings = {};
		var key = null;
		var value = null;
		
		key = $(this).data('setting-name');
		value = $(this).val();
		settings[key] = value;
		
		settings = JSON.stringify(settings);
		var params = {'data': {'settings': settings}};
		var url = '/a_user_settings_edit/';
		post_adjusted('/a_user_settings_edit/', params, function(response){
			show_notification('Changes have been saved', NOTIFICATION_STATUS.SUCCESS);
			
		});
	});
	
	$(document).on( 'change', 'input.user-setting', function(e){
		var settings = {};
		var key = null;
		var value = null;
		
		// all input settings at once
		/*
		$('input.user-setting').each(function(){			
			key = $(this).data('setting-name');
			value = $(this).val();
			settings[key] = value; 
		});
		*/
		key = $(this).data('setting-name');
		value = $(this).val();
		settings[key] = value;
		
		settings = JSON.stringify(settings);
		var params = {'data': {'settings': settings}};
		var url = '/a_user_settings_edit/';
		post_adjusted(url, params, function(response){
			show_notification('Changes have been saved', NOTIFICATION_STATUS.SUCCESS);
			
		});
	});
});