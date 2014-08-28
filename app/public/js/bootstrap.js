jQuery(document).ready(function($){

	if($(".sortable").length){
		$(".sortable").sortable();
	}

	var Scene = (function() {

		$('#scene').parallax();
		
		window.onresize = function() {
			var $scene = $('#scene');
				$scene[0].style.width = window.innerWidth + 'px';
				$scene[0].style.height = window.innerHeight + 'px';
		}
		
		var $scene = $('#scene');
			$scene[0].style.width = window.innerWidth + 'px';
			$scene[0].style.height = window.innerHeight + 'px';
		
	})();
		
	var Icon = (function() {
	
		
		// on click
		$('.icon').on('click', function() {
			Icon.launch($(this));
		});
		
		// on long click 
		var longClick = (function() {
			var timeoutId = 0;
			var clickedIcon;
			$('.icon').mousedown(function() {
				clickedIcon = $(this);
				timeoutId = setTimeout(function(){
					Icon.addShake(clickedIcon);
					return false;
				}, 1000);
			}).bind('mouseup', function() {
				clearTimeout(timeoutId);
				setTimeout(function(){
					if(clickedIcon.hasClass('shake')){
						clickedIcon.addClass('shake-can-be-removed');
					}
				},500);
			});
		})();
		
		//on shaky icon click
		$(document).on('click', '.shake-can-be-removed', function() {
			Icon.removeShake($(this));
			return false;
		});
	
		return {
			launch: function(element) {
				var options = {};
				if($(element).attr('data-launch-type') == "launchExe") {
					options.type = $(element).attr('data-launch-type');
					options.location = $(element).attr('data-launch-location');
					options.activationTitle = $(element).attr('data-activation-title');
				} else if($(element).attr('data-launch-type') == "launchCommand") {
					options.type = $(element).attr('data-launch-type');
					options.command = $(element).attr('data-command');
					options.activationTitle = $(element).attr('data-activation-title');
				} else if($(element).attr('data-launch-type') == "launchUrl") {
					options.type = $(element).attr('data-launch-type');
					options.href = $(element).attr('href');
					options.activationTitle = "Chrome";
				}
				if(!$(element).hasClass("disabled")) {
					$.ajax({
						type: "POST",
						url: "/launch-app",
						data: options
					});
				}
			},
			addShake: function(element) {
				$(element).addClass('shake').addClass('disabled');
				$(element).append('<img class="delete-app-icon" src="/img/delete-2-32.png" alt="Delete" />');
			},
			removeShake: function(element) {
				$(element).removeClass('shake').removeClass('disabled').removeClass('shake-can-be-removed');
				$('.delete-app-icon', $(element)).remove();
			}
		}
	})();
	
});