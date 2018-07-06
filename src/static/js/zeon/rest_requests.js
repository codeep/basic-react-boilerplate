var FILTER_DATA = null;

$(function(){
	$.get('/get_user_requests_endpoints/', function (response) {
		$('#endpoints_filter').selectize({
			create: false,
			valueField: 'name',
			searchField: ['name'],
			openOnFocus: false,
			persist: true,
			plugins: ['remove_button'],
			options: response.object.endpoints,
			closeAfterSelect: true,
			load: function (input, callback) {
				$.get('/get_user_requests_endpoints/', function (response) {
					return callback(response.object.endpoints);
					});
			},
			render: {
				item: function(item, escape){
						return '<div class="implementer_contact_item">' +
									item.name +
							   '</div>';
				},
		
				option: function(data, escape) {
						return '<div>' +
									data.name +
							   '</div>';
				},
			},
		});
	});
	
	$('#input_filter').selectize({
		delimiter: ',',
		persist: false,
		create: function(input) {
			return {
				value: input,
				text: input
			}
		}
	});
		
	$(document).on('click', '._mark-important', function() {
		var is_marked = null;
		var $icon = $(this);
		if ($(this).hasClass('glyphicon-star-empty')) {
			is_marked = 1;
		}
		else {
			is_marked = 0;
		}
		
		var data = {'id': $(this).closest('._request-wrapper').data('request-id'),
					'is_marked': is_marked}
		$.post('/rest_requests_edit_importance/', data, function() {
			$icon.toggleClass('glyphicon-star-empty glyphicon-star');
		});
	});
	
	$(document).on('mouseenter', '._request-wrapper', function() {
		$(this).find(".glyphicon-star-empty").css('visibility', 'visible');
	});
	
	$(document).on('mouseleave', '._request-wrapper', function() {
		$(this).find(".glyphicon-star-empty").css('visibility', 'hidden');
	});
	
	$(document).on('click', '._input-params', function() {
		var sel = getSelection().toString();
		if(!sel){
			var request_id = $(this).closest('li').data('request-id');
			var $wrapper = $(this).closest('._input-params');
			var url = '/rest_request_param/' + request_id + '/';
			window.open(url,'_blank');
		}
	});
	
	$(document).on('click', '._output-params', function() {
		var sel = getSelection().toString();
		if(!sel){
			var response_id = $(this).closest('li').data('response-id');
			var $wrapper = $(this).closest('._input-params');
			var url = '/rest_response_json/' + response_id + '/';
			window.open(url,'_blank');
		}
	});
	
	$('.json_response').on('click', function() {
		
		var response_id = $(this).closest('li').data('response-id');
		var url = '/rest_response_json/' + response_id + '/';
		window.open(url,'_blank');
	});
	
	$( "#rest_requests_container" ).scroll(function() {
		var margin = 20
		if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
			$("a.endless_more").click();
		}
	});
	
	$(document).on('click', '#clear_requests', function(e){
		BootstrapDialog.confirm({
			message: $('<div>' + gettext('Are you sure you want to delete all the requests?') + '</div>'),
			title: gettext('Delete requests'),
			type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			closable: true,
			draggable: true,
			btnCancelLabel: gettext('No'),
			btnOKLabel: gettext('Yes'),
			callback: function(result){				
				if(result){
					$.post('/rest_request_delete/', function (response){
						$('#rest_requests_container').html('');
					});
				};
			}
		});
	});
	
	$(document).on('click', '#refresh_requests', function(e){
		refresh_requests();
	});
	
	$(document).on('change', '#endpoints_filter, #input_filter', function(e){
		refresh_requests();
	});
	
	function refresh_requests() {
		var data = {}
		if ($('#endpoints_filter').val()){
			data['endpoints'] = $('#endpoints_filter').val();
		}
		if ($('#input_filter').val()){
			data['input'] = $('#endpoints_filter').val();
		}
		$.get('/rest_requests/', data, function (response){
			$('#rest_requests_container').html(response.object.template);
		});
	}
});