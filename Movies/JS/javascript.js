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
		$('#myCampains').show();
		welcome_visible = false;
	}

	var display_analysis = function(name, type) {
		if (!_.isUndefined(movies[name])) {
			var series = movies[name][type];
			// $("#modal_title").text(name+' '+type+' Analysis');
			$('#modal_body').empty();
			$("#multi_modal").modal();
			$('#multi_modal').on('shown.bs.modal', function (e) {
			    if (type==="emotions") {
			    	 $('#modal_body').highcharts({
					        chart: {
					            type: 'pie',
					            options3d: {
					                enabled: true,
					                alpha: 45
					            }
					        },
					         credits: {
							      enabled: false
							  },
					        title: {
					            text: name + " Emotional Analysis"
					        },
					        subtitle: {
					            text: ''
					        },
					        plotOptions: {
					            pie: {
					                innerSize: 100,
					                depth: 45
					            }
					        },
					        series: [{
					            name: 'Reviews',
					            data: _.zip(_.pluck(series['series'], 'name'), _.pluck(series['series'], 'value'))
					            
					        }]
					    });	
			    } else {
			    	 $('#modal_body').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });
					
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
		    	display_analysis($(this)[0].getAttribute("data-title"), "Sentiment");
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