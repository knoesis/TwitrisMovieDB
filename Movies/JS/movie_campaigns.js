$(function(){	
	var facebook_share = 'http://www.facebook.com/sharer.php?u='+window.location.href,
		gplus_share = 'https://plus.google.com/share?url='+window.location.href,
		twitter_share = 'http://twitter.com/share?text=Check%20out%20this%20Twitris%20analysis&url='+window.location.href,
		email_share = 'mailto:?Subject=Check%20out%20this%20Twitris%20analysis&Body='+window.location.href

	var month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
		movies = {},
		welcome_visible = true;


	// When the myCampains have been loaded 
	// hide the welcomePage and show the myCampains Page
	var got_info_clear_welcome = function() {
		$('#welcomeScreen').hide();
		$(".pageTitle").text("My Twittris Campaigns");
		$('#myCampains').show();
		welcome_visible = false;
	}

	var display_analysis = function(name, type) {
		if (!_.isUndefined(movies[name])) {
			var series = movies[name][type];
			$('#chart_body').empty();
			$("#multi_modal").modal();
			$('#multi_modal').on('shown.bs.modal', function (e) {
				var title = [name,(type==="emotions"?"Emotions":"Sentiment"),"Analysis"].join(" "),
			    	built_graph = buildChart("chart_body", title, series, (type==="emotions"?true:false)),
					chart = new Highcharts.Chart( built_graph );
					var redraw = _.debounce(function(){chart.redraw()}, 300);
					$(window).resize(redraw);
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
							$.when(
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/sentiment/"+c_id,
									success: function(results) {
										movies[name]["sentiment"]=results['data'];
									},
									error: myFailure
								}),
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/emotions/"+c_id,
									success: function(results) {
										movies[name]["emotions"]=results['data'];
									},
									error: myFailure
								}),
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+c_id,
									success: function(results) {
										movies[name]["reviews"]=results['reviews'];
									},
									error: myFailure
								})
							).done(function() {
								listMovies(movies[name])
							})
						},
						error: myFailure
					})		
			};
		}	
	});
	var listMovies = function(movie){			
			var date = movie["info"]["release_date"],
				day = date.substring(8,10),
				month = month_array[parseInt(date.substring(6,7))-1],
				year = date.substring(0,4),
				title = movie["info"]["original_title"],
				id = movie["info"]["id"],
				poster = movie["info"]["poster_path"],
				info = movie['info']['overview'],
				data_attrs = 'data-href="http://image.tmdb.org/t/p/w500/'+poster+
						'" data-toggle="modal" data-target="#movie_desc_modal"'+
						'" data-info="'+info+'" data-title="'+title+'"'

			movies[title]['emotions'] = graph_data(movie['emotions'], 'pie')
			movies[title]['sentiment'] = graph_data(movie['sentiment'], 'line')
	        
			if (welcome_visible)  {
				got_info_clear_welcome();
			}
			
			$('#campaignMovieList').append("<li>"+
			'<time datetime="'+date+'">'+
			'<span class="day">'+day+'</span>'+
			'<span class="month">'+month +'</span>'+
			'<span class="year">'+year+'</span>'+
			'</time>'+
			'<a id="image_'+id+'" '+data_attrs+'>'+
			'<img alt="" src="http://image.tmdb.org/t/p/original/'+poster+'" /></a>'+
			'<div class="info">'+
			'<h2 class="title">'+title+'</h2>'+
			'<div id="movieInfo'+id+'">'+
			'<p class="desc ellipsis">'+info+'</p><a id="readmore_'+id+'" '+data_attrs+'><p>Read Full [+]</a>'+
			'</div>'+
			'<ul>'+
// SENTIMENT BUTTON		
			'<li style="width:33.3%;"><span class="fa fa-bar-chart" id="show_sentiment_'+id+'" data-title="'+title+'"> Sentiment</span></li>'+
// EMOTIONS BUTTON
			'<li style="width:33.3%;"><span class="fa fa-pie-chart" id="show_emotions_'+id+'" data-title="'+title+'"> Emotional</span></li>'+

			'<li style="width:33.3%;"><span class="fa fa-twitter-square"> Live Tweet\'s</span></li>'+
			'</ul>'+
			'<div style="display:none;" id="campaignOn'+id+'">'+
			'<h5>Would You Like To Delete The Campaign?</h5>'+
			'<button class="btn btn-hot text-uppercase sweet-14 deleteCampaign" onclick="_gaq.push(["_trackEvent", "example", "try", "deleteCampaign"]);">Delete</button><button id="goBack'+id+'" class="btn btn-sunny text-uppercase">Cancel</button>'+
			'</div>'+
			'</div>'+
			'<div class="social">'+
			'<ul>'+
			'<li class="facebook" style="width:25%;"><a href="#facebook"><span class="fa fa-facebook"></span></a></li>'+
			'<li class="twitter" style="width:25%;"><a href="#twitter"><span class="fa fa-twitter"></span></a></li>'+
			'<li class="google-plus" style="width:25%;"><a href="#google-plus"><span class="fa fa-google-plus"></span></a></li>'+
			'<li class="power" id="power'+id+'" style="width:25%;"><a><span class="fa fa-power-off"></span></a></li>'+
			'</ul>'+
			'</div>'+
			'</li>')

			$("#power"+id).click(function() {
				    $('#movieInfo'+id).slideToggle("fast");
				    $('#campaignOn'+id).slideToggle("fast");				
				});
				$("#goBack"+id).click(function () {
				    $('#movieInfo'+id).slideToggle("fast");
				    $('#campaignOn'+id).slideToggle("fast");	
				});

			  
			  $('.deleteCampaign').on('click', function(){
			    swal({
					  title: "Are You Sure?",
					  text: "You will not be able to get the campaign data back!",
					  type: "warning",
					  showCancelButton: true,
					  confirmButtonClass: "btn-danger",
					  confirmButtonText: "Yes",
					  cancelButtonText: "No",
					  closeOnConfirm: false,
					  closeOnCancel: false
					},
					function(isConfirm) {
					  if (isConfirm) {
					    swal("Deleted!", "Your Campaign Has Been Deleted", "success");
					  } else {
					    swal("Cancelled", "Your Campaign Is Safe", "error");
					  }
					});
			  });

		    $("#show_sentiment_"+id).on('click', function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "sentiment");
		    });
		    $("#show_emotions_"+id).on('click', function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "emotions");
		   	});
		
			console.log("mycampainsuccess");
	}
	var myFailure = function(){
		alert ("ERROR")
	}

});






// <!--facbook,com/sharer.php?u='+-->