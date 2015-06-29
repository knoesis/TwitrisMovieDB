$(document).ready(function(){	
		var movies = {};
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

					$.when(
						$.ajax({
							type: 'GET',
							"content-type": "Application/JSON",
							url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_info/"+name,
							success: function(results) {
								var name = results['info']['original_title']
								movies[name]["info"]=results["info"];
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/sentiment/"+id,
									success: function(results) {
										movies[name]["sentiment"]=$.parseJSON(results);
										$.ajax({
											type: 'GET',
											"content-type": "Application/JSON",
											url:"http://localhost:5200/twitris-movie-ext/api/v1.0/emotions/"+id,
											success: function(results) {
												movies[name]["emotions"]=$.parseJSON(results);
											}
										})
									}
								})
							}	
						})	
					).then(listMovies(movies[name]), myFailure); 	
				};
				
		}});
			function listMovies (movie){			
					var date = movie["info"]["release_date"];
					var day = date.substring(8,10);
					var month = month_array[parseInt(date.substring(6,7))-1];		
					var year = date.substring(0,4);

					$('#myCampains').append("<li>"+
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