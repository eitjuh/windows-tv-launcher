jQuery(document).ready(function($){

	var Weather = (function() {
	
		navigator.geolocation.getCurrentPosition(function(data){
			$.ajax({
				url : "http://api.wunderground.com/api/d07f77703958f46f/geolookup/conditions/q/" + data.coords.latitude + "," + data.coords.longitude + ".json",
				dataType : "jsonp",
				success : function(parsed_json) {
					var location = parsed_json['location']['city'];
					var temp_c = parsed_json['current_observation']['temp_c'];
					alert("Current temperature in " + location + " is: " + temp_c);
				}
			});
		});
		return {
		}
	})();

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
	
		// on remove click
		$(document).on('click', '.delete-app-icon', function() {
			var appIconToDelete = $(this).closest('.icon');
			var appIdToDelete = appIconToDelete.attr('data-id');
			var titleToDelete = $('.caption', appIconToDelete).text();
			var confirmDelete = confirm("Are you sure you want to remove " + titleToDelete + "!?");
			if(confirmDelete){
				$.ajax({
					type: "POST",
					url: "/remove-app",
					data: {"removeId" : appIdToDelete}
				});
				appIconToDelete.animate({'zoom': 0}, 1000, function(){
					appIconToDelete.remove();
				});
			}
		});
	
		// on dragging
		if($(".sortable").length){
			$(".sortable").sortable({
				stop: function(event, ui) {
					var i, j = 1, options = {};
					for(i = 0; i < $(".icon").length; i++){
						$($(".icon")[i]).attr('data-order', j);
						options[$($(".icon")[i]).attr('data-id')] = j;
						j++;
					}
					$.ajax({
						type: "POST",
						url: "/update-app-order",
						data: options
					});
				}
			});
		}
		
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
				}, 500);
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
					options.href = $(element).attr('data-href');
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