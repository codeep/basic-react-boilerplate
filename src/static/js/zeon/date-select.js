// Created by Navasardyan Edgar
// https://learn.jquery.com/plugins/basic-plugin-creation/

(function ( $ ) {
 
    $.fn.dateSelector = function( options ) {
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass(className);
			},
			dayNamesMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
			dateFormat: SETTINGS.DATE_FORMAT,
			timeFormat: 'hh:mmtt',
			showOtherMonths: true,
			altField: "",
            onClose: function(dateText, inst) {
				return false; // In order to stop surplus triggering of change event
			}	,
			onSelect: function(dateText) {
				return false; // In order to stop surplus triggering of change event
			}
        }, options );
 
        // Greenify the collection based on the settings variable.
        return this.css({
            beforeShow: settings.beforeShow, 
			dayNamesMin: settings.dayNamesMin,
			altField: settings.altField,
			dateFormat: settings.dateFormat,
			timeFormat: settings.timeFormat,
			showOtherMonths: settings.showOtherMonths,
            onClose: settings.onClose,
			onSelect: settings.onSelect
		});
    };
}( jQuery ));