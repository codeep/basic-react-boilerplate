$(function(){
	"use strict"
	//resetChat();
	$(".mytext").on("keyup", function(e) {
		if (e.which == 13) {
			var text = $(this).val();
			if (text !== "") {
				insertChat("me", text);
				$(this).val('');
			}
		}
	});
});

function resetChat() {
  $("ul").empty();
}
