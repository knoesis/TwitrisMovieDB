$(document).ready(function(){	
	lightbox.init();
	var month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
		movies = {},
		welcome_visible = true;


	// When the myCampains have been loaded 
	// hide the welcomePage and show the myCampains Page
	var got_info_clear_welcome = function() {
		$('#welcomeScreen').hide();
		$(".pageTitle").text("My Twittris Campaigns");
		$('#newReleases').show();
		welcome_visible = false;
	}

	var display_analysis = function(name, type) {
		if (!_.isUndefined(movies[name])) {
			var series = movies[name][type];
			$("#modal_title").text(name+' '+type+' Analysis');
			$('#modal_body').empty();
			$("#multi_modal").modal();
			$('#multi_modal').on('shown.bs.modal', function (e) {
			    if (type==="emotions") {
				    new Chartist.Pie('#modal_body', { 
					   	series:_.pluck(series['series'], 'value'), 
					   	labels:_.pluck(series['series'], 'name')
				    });
				} else {
					new Chartist.Line('#modal_body', {
					  labels: ['1', '2', '3', '4', '5', '6'],
					  series: [
					    {
					      name: 'Fibonacci sequence',
					      data: [1, 2, 3, 5, 8, 13]
					    },
					    {
					      name: 'Golden section',
					      data: [1, 1.618, 2.618, 4.236, 6.854, 11.09]
					    }
					  ]
					})
				}
			});
		}
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
					movies[name] = {
						c_id : id
					};						

				$.ajax({
						type: 'GET',
						"content-type": "Application/JSON",
						url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_info/"+name,
						success: function(results) {
							var name = results['info']['original_title'],
								movie_id = results['info']['id']
								c_id = movies[name]['c_id'];
							movies[name]["info"]=results["info"];
							$.ajax({
								type: 'GET',
								"content-type": "Application/JSON",
								url:"http://localhost:5200/twitris-movie-ext/api/v1.0/sentiment/"+c_id,
								success: function(results) {
									movies[name]["sentiment"]=results['data'];
									$.ajax({
										type: 'GET',
										"content-type": "Application/JSON",
										url:"http://localhost:5200/twitris-movie-ext/api/v1.0/emotions/"+c_id,
										success: function(results) {
											movies[name]["emotions"]=results['data'];
											$.ajax({
												type: 'GET',
												"content-type": "Application/JSON",
												url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+movie_id,
												success: function(results) {
													movies[name]["reviews"]=results['reviews']['results'];
													listMovies(movies[name])
												},
												error: myFailure
											});
										},
										error: myFailure
									})
								},
								error: myFailure
							})
						},
						error: myFailure
					})		
			};
		}	
	});
	function listMovies (movie){			
			var date = movie["info"]["release_date"],
				day = date.substring(8,10),
				month = month_array[parseInt(date.substring(6,7))-1],
				year = date.substring(0,4),
				title = movie["info"]["original_title"],
				id = movie["info"]["id"],
				series = [],
				data = _.pluck(_.flatten(_.pluck(movie['emotions'], "data")), "count");

			// reg ex explanation
			// everything between "/" IS the reg ex 
			// "\(" means that we are going to escape the reg ex meaning of "(" and look for an actual exsisting "("
			// the yellow () mean that we want to save what is found 
			// . means any char
			// + means one or more of the preceeding chars 
			str = "string 'something'"			
			var re = RegExp(/\((.+)\)/);

			_.each(_.pluck(movie['emotions'], "name"), function(val) {
				// at each step, val == "something (emotion)"
				// match uses the reg ex to find "(emotion)""
				// it returns ["(emotion)", "emotion"]
				series.push({"name":val.match(re)[1]}); 
			});	

			movies[title]["emotions"] = {series:series};

			// loop through and add the count of each emotion to the object in the series
			_.each(data, function(val, i) {
				series[i]["value"] = val; 
			});
			
			if (welcome_visible)  {
				got_info_clear_welcome();
			}
			
			$('#campaignMovieList').append("<li>"+
			'<time datetime="'+date+'">'+
			'<span class="day">'+day+'</span>'+
			'<span class="month">'+month +'</span>'+
			'<span class="year">'+year+'</span>'+
			'</time>'+
			'<a class="" href="http://image.tmdb.org/t/p/w500/'+movie["info"]["poster_path"]+'" data-lightbox="'+movie["info"]["id"]+'" data-title="'+movie["info"]["overview"]+'"><img alt="" src="http://image.tmdb.org/t/p/original/'+movie["info"]["poster_path"]+'" /></a>'+
			'<div class="info">'+
			'<h2 class="title">'+title+'</h2>'+
			'<p class="desc ellipsis">'+movie["info"]["overview"]+'</p><a href=""><p>Read Full [+]</a>'+
			'<ul>'+
// SENTIMENT BUTTON		
			'<li style="width:25%;"><span class="fa fa-smile-o" id="show_sentiment_'+id+'" data-title="'+title+'"> Sentiment Analysis</span></li>'+
// EMOTIONS BUTTON
			'<li style="width:25%;"><span class="fa fa-bar-chart" id="show_emotions_'+id+'" data-title="'+title+'"> Emotional Analysis</span></li>'+

			'<li style="width:25%;">103 <span class="fa fa-twitter-square"> Live Tweet\'s</span></li>'+
			'</ul>'+
			'</div>'+
			'<div class="social">'+
			'<ul>'+
			'<li class="facebook" style="width:25%;"><a href="#facebook"><span class="fa fa-facebook"></span></a></li>'+
			'<li class="twitter" style="width:25%;"><a href="#twitter"><span class="fa fa-twitter"></span></a></li>'+
			'<li class="google-plus" style="width:25%;"><a href="#google-plus"><span class="fa fa-google-plus"></span></a></li>'+
			'<li class="power" style="width:25%;"><a href="#power"><span class="fa fa-power-off"></span></a></li>'+
			'</ul>'+
			'</div>'+
			'</li>')

		    $("#show_sentiment_"+id).click(function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "sentiment");
		    });
		    $("#show_emotions_"+id).click(function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "emotions");
		   	});
		
			console.log("mycampainsuccess");
	}
	function myFailure (){
		alert ("ERROR")
	}

});






// <!--facbook,com/sharer.php?u='+-->