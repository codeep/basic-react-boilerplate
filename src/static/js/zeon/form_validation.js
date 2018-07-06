
$(document).ready(function(){	
	"use strict"
	$(document).on('click', '.form-error', function(e){
		$(this).parent().find('.form-error-message fs12').addClass('dn');
		$(this).removeClass('form-error');
	});
	
	$(document).on('blur', '.form-error', function(e){
		$(this).parent().find('.form-error-message fs12').addClass('db');
	});
	
	$(document).on('keydown', '.form-error input', function(e){
		$(this).parent().removeClass('form-error');
		$(this).parent().find('.form-error-message').remove();
	});
	
});

$.fn.get_error_msg_container = function()
{
	return this.parent().find('.form-error-message fs12');
}

function render_server_errors(response, $form){
	// see the definition of web_json_error
	// to understand how this function works
	
	if ($form){
		$form.find('.form-error').removeClass('form-error');
		$form.find('.form-error-message').remove();
	}		
	
	if (response.str) {
		if ($form && $form.find('.non-field-error-wrapper').length){
			$form.find('.non-field-error-wrapper').html(response.str);
			$form.find('.non-field-error-wrapper').addClass('db');
		}
		else
			show_notification(response.str, NOTIFICATION_STATUS.FAIL);
	}
	
	else {
		var errors = response.forms;
				
		for (var key in errors) 
		{
			if (errors.hasOwnProperty(key)) 
			{
				var $element = $form.find('[name = "' + key + '"]')
				if ($element.length){
					if ($element.length !== 0){				
						$element.after('<div class = "form-error-message fs12">' + errors[key] +'</div>');
						$element.closest('.form-box').addClass('form-error');
					}
					else{
						$form.find('.non-field-error-wrapper').html(errors[key][0]).addClass('db');
					}
					
				}
				
			}
		}
	}
}