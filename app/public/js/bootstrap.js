jQuery(document).ready(function($){
	console.log('jquery init');
	$('#scene').parallax();
		
	window.onresize = function() {
		var $scene = $('#scene');
			$scene[0].style.width = window.innerWidth + 'px';
			$scene[0].style.height = window.innerHeight + 'px';
	}
	
	var $scene = $('#scene');
		$scene[0].style.width = window.innerWidth + 'px';
		$scene[0].style.height = window.innerHeight + 'px';
		
	$('.icon').on('click', function() {
		var options = {};
		if($(this).attr('data-launch-type') == "launchExe") {
			options.type = $(this).attr('data-launch-type');
			options.location = $(this).attr('data-launch-location');
			options.activationTitle = $(this).attr('data-activation-title');
		} else if($(this).attr('data-launch-type') == "launchCommand") {
			options.type = $(this).attr('data-launch-type');
			options.command = $(this).attr('data-command');
			options.activationTitle = $(this).attr('data-activation-title');
		} else if($(this).attr('data-launch-type') == "launchUrl") {
			options.type = $(this).attr('data-launch-type');
			options.href = $(this).attr('href');
			options.activationTitle = "Chrome";
		}
	
		$.ajax({
			type: "POST",
			url: "/launch-app",
			data: options
		});
	});
});