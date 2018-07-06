$(function(){
	
	$(document).on('click', '.toggle-password', function(e){
		var self = $(this);
		self.toggleClass('active');
		self.parent().find('input').attr('type', ( self.hasClass('active') ? 'text' : 'password')).focus();
	});
	
	$('#sign-up-form').on('submit', function(e){
		e.preventDefault();
		var $form = $(this);
		var url = $form.attr('action');
		var params = {'data': $form.serialize(),
					  'form': $form}
		post_adjusted(url, params, function(response){
			$('#user-info-credentials-wrapper').addClass('dn');
			$('#user-info-confirmation-wrapper').removeClass('dn');
		});
	});
	
	$('#user-form-change-credentials').on('click', function(e){
		//history.pushState({ foo: "bar" }, "page 2", '/confirm/');
		e.preventDefault();
		$('#user-info-credentials-wrapper').removeClass('dn');
		$('#user-info-confirmation-wrapper').addClass('dn');
	});
	
	$('#user-activation-key-form').on('submit', function(e){
		e.preventDefault();
		var $form = $(this);
		var url = $form.attr('action');
		var email = $('#sign-up-form [name=email]').val(); 
		var params = {'data': $form.serialize() + '&' + $('#sign-up-form').serialize() + '&email=' + email,
					  'form': $form}
		post_adjusted(url, params, function(response){
			location.href = "/";
		});
	});
});