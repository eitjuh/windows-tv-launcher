jQuery(document).ready(function($){
	console.log('jquery init');
	$('#scene').parallax();
	var $scene = $('#scene');
		$scene[0].style.width = window.innerWidth + 'px';
		$scene[0].style.height = window.innerHeight + 'px';
});