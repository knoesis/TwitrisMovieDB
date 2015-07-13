$(function(){	
	var facebook_share = 'http://www.facebook.com/sharer.php?u='+window.location.href,
		gplus_share = 'https://plus.google.com/share?url='+window.location.href,
		twitter_share = 'http://twitter.com/share?text=Check%20out%20this%20Twitris%20analysis&url='+window.location.href,
		email_share = 'mailto:?Subject=Check%20out%20this%20Twitris%20analysis&Body='+window.location.href



  document.querySelector('.sweet-12').onclick = function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "success",
      showCancelButton: true,
      confirmButtonClass: 'btn-success',
      confirmButtonText: 'Success!'
    });
  };  

  document.querySelector('.sweet-14').onclick = function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "error",
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Danger!'
    });
  };


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
				id = movie["info"]["id"];

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
			'<a class="" data-href="http://image.tmdb.org/t/p/w500/'+movie["info"]["poster_path"]+'"  data-toggle="modal" data-target="#movie_desc_modal" data-lightbox="'+movie["info"]["id"]+'" data-title="'+movie["info"]["overview"]+'">'+
			'<img alt="" src="http://image.tmdb.org/t/p/original/'+movie["info"]["poster_path"]+'" /></a>'+
			'<div class="info">'+
			'<h2 class="title">'+title+'</h2>'+
			'<div id="movieInfo'+id+'">'+
			'<p class="desc ellipsis">'+movie["info"]["overview"]+'</p><a href=""><p>Read Full [+]</a>'+
			'</div>'+
			'<ul>'+
// SENTIMENT BUTTON		
			'<li style="width:25%;"><span class="fa fa-smile-o" id="show_sentiment_'+id+'" data-title="'+title+'"> Sentiment Analysis</span></li>'+
// EMOTIONS BUTTON
			'<li style="width:25%;"><span class="fa fa-bar-chart" id="show_emotions_'+id+'" data-title="'+title+'"> Emotional Analysis</span></li>'+

			'<li style="width:25%;">103 <span class="fa fa-twitter-square"> Live Tweet\'s</span></li>'+
			'</ul>'+
			'<div style="display:none;" id="campaignOn'+id+'">'+
			'<h5>Would You Like To Delete The Campaign?</h5>'+
			'<button class="btn btn-fresh text-uppercase">Yes</button><button id="goBack'+id+'" class="btn btn-sunny text-uppercase">Cancel</button>'+
			'</div>'+
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

			$("#power"+id).click(function() {
				    $('#movieInfo'+id).slideToggle("fast");
				    $('#campaignOn'+id).slideToggle("fast");				
				});
				$("#goBack"+id).click(function () {
				    $('#movieInfo'+id).slideToggle("fast");
				    $('#campaignOn'+id).slideToggle("fast");				
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