'use strict';

$(document).on('click', '.toggle', function(e){
    $(this).toggleClass('active').next().toggle();
});

$(document).on('click', '.accordion-toggle', function(e){
    $(this).toggleClass('active').next().slideToggle(300);
});

$(document).on('click', '.toggle-class-active', function(e){
    e.stopPropagation();
	$(this).toggleClass('active');
});

// Hide bootstrap modal after clicking outside
$('.modal-dialog').click(function(e) {

    var $clicked = $(e.target);

    if ( $clicked.hasClass('modal-dialog') ) {
        $clicked.parents('.modal').modal('hide');
    }

});

$(document).on('click', '.user-profile-box', function(event){
	event.stopPropagation();
    var $clicked = $(event.target);

    if ( $clicked.is('.user-profile-box') || $clicked.is('.user-profile-box > img') ) {
        $(this).find('.user-profile-box__info-box').toggle();
    }

});

$(document).on('click', '.email-info-box--close-state', function(e){
    var sel = getSelection().toString();
	// if no text is highlighted
	if(!sel){
		$(this).addClass('dn').next().removeClass('dn');
	}
});

$(document).on('click', '.email-info-box-group__wrapper .email-info-box', function(e){
    var sel = getSelection().toString();
	// if no text is highlighted
	if(!sel){
		$(this).parent().addClass('dn').prev().removeClass('dn');
	}
});

// jQuery ui datepicker

