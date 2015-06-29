$(document).ready(function(){	
	var month_array = new Array();
		month_array[0] = "JAN";
		month_array[1] = "FEB";
		month_array[2] = "MAR";
		month_array[3] = "APR";
		month_array[4] = "MAY";
		month_array[5] = "JUNE";
		month_array[6] = "JULY";
		month_array[7] = "AUG";
		month_array[8] = "SEPT";
		month_array[9] = "OCT";
		month_array[10] = "NOV";
		month_array[11] = "DEC";
	var movies = {},
		welcome_visible = true;



	var got_info_clear_welcome = function() {
		$('#welcomeScreen').hide();
		$('#myCampains').show();
		welcome_visible = false;
	}

	$.ajax({
		type: 'GET',
		"content-type": "Application/JSON",
		url:"http://localhost:5200/twitris-movie-ext/api/v1.0/list",
		success: function (response) {
			var resp = response['campaigns'];
			for (var i=0; i<resp.length; i++) {
				var name = resp[i]['event'],
					id = resp[i]['id'];

					movies[name]= {};						

				$.ajax({
						type: 'GET',
						"content-type": "Application/JSON",
						url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_info/"+name,
						success: function(results) {
							var name = results['info']['original_title'],
								movie_id = results['info']['id'];
							movies[name]["info"]=results["info"];
							$.ajax({
								type: 'GET',
								"content-type": "Application/JSON",
								url:"http://localhost:5200/twitris-movie-ext/api/v1.0/sentiment/"+id,
								success: function(results) {
									movies[name]["sentiment"]=results['data'];
									$.ajax({
										type: 'GET',
										"content-type": "Application/JSON",
										url:"http://localhost:5200/twitris-movie-ext/api/v1.0/emotions/"+id,
										success: function(results) {
											movies[name]["emotions"]=results['data'];
											$.ajax({
												type: 'GET',
												"content-type": "Application/JSON",
												url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+movie_id,
												success: function(results) {
													listMovies(movies[name])
												}
											});
										}
									})
								}
							})
						}	
					})		
			};
		}	
	});
	function listMovies (movie){			
			var date = movie["info"]["release_date"];
			var day = date.substring(8,10);
			var month = month_array[parseInt(date.substring(6,7))-1];		
			var year = date.substring(0,4);

			if (welcome_visible)  {
				got_info_clear_welcome();
			}

			$('#campaignMovieList').append("<li>"+
			'<time datetime="'+date+'">'+
			'<span class="day">'+day+'</span>'+
			'<span class="month">'+month +'</span>'+
			'<span class="year">'+year+'</span>'+
			'</time>'+
			'<img alt="" src="http://image.tmdb.org/t/p/w500/'+movie["info"]["backdrop_path"]+'" />'+
			'<div class="info">'+
			'<h2 class="title">'+movie["info"]["original_title"]+'</h2>'+
			'<p class="desc" id="movieDesc" class="dsotdotdot">'+movie["info"]["overview"]+'</p>'+
			'<ul>'+
			'<li id="sentimentTogg" style="width:25%;">1 <span class="fa fa-smile-o"></span></li>'+
			'<li style="width:25%;">3 <span class="fa fa-question"></span></li>'+
			'<li style="width:25%;">103 <span class="fa fa-envelope"></span></li>'+
			'<li style="width:25%;">3 <span class="fa fa-question"></span></li>'+
			'</ul>'+
			'</div>'+
			'<div class="social">'+
			'<ul>'+
			'<li class="facebook" style="width:33%;"><a href="#facebook"><span class="fa fa-facebook"></span></a></li>'+
			'<li class="twitter" style="width:34%;"><a href="#twitter"><span class="fa fa-twitter"></span></a></li>'+
			'<li class="google-plus" style="width:33%;"><a href="#google-plus"><span class="fa fa-google-plus"></span></a></li>'+
			'</ul>'+
			'</div>'+
			'</li>')					
			console.log("mycampainsuccess");
	}
	function myFailure (){
		alert ("ERROR")
	}

});





// <!--facbook,com/sharer.php?u='+-->