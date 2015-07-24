$(function(){	
	var facebook_share = 'http://www.facebook.com/sharer.php?u='+window.location.href,
		gplus_share = 'https://plus.google.com/share?url='+window.location.href,
		twitter_share = 'http://twitter.com/share?text=Check%20out%20this%20Twitris%20analysis&url='+window.location.href,
		email_share = 'mailto:?Subject=Check%20out%20this%20Twitris%20analysis&Body='+window.location.href

	var month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
		movies = {},
		welcome_visible = true,
		toDelete = "";


	// When the myCampains have been loaded 
	// hide the welcomePage and show the myCampains Page
	var got_info_clear_welcome = function() {
		$('#welcomeScreen').hide();
		$(".pageTitle").text("My Campaign's");
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
						url:"http://localhost:5200/twitris-movie-ext/api/v1.0/get_info/"+name,
						success: function(results) {
							var name = results['info']['original_title'],
								movie_id = results['info']['id']
								c_id = movies[name]['c_id'];
							movies[name]["info"]=results["info"];
							$.when(
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/get_credits/"+movie_id,
									success: function(results) {
										movies[name]["info"]['credits'] = results["credits"];
									},
									error: myFailure
								}),
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/get_videos/"+movie_id,
									success: function(results) {
										movies[name]["info"]['videos'] = results["videos"];
									},
									error: myFailure
								}),
								$.ajax({
									type: 'GET',
									"content-type": "Application/JSON",
									url:"http://localhost:5200/twitris-movie-ext/api/v1.0/get_keywords/"+movie_id,
									success: function(results) {
										movies[name]["info"]['keywords'] = results["keywords"];
									},
									error: myFailure
								}),
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
				cast = _.zip( _.pluck(movies[title]['info']['credits']['cast'], "character"),
						_.pluck(movies[title]['info']['credits']['cast'], "name"),
						_.pluck(movies[title]['info']['credits']['cast'], "profile_path")).toString()
				crew = _.zip( _.pluck(movies[title]['info']['credits']['crew'], "department"),
						_.pluck(movies[title]['info']['credits']['crew'], "name"),
						_.pluck(movies[title]['info']['credits']['crew'], "profile_path")).toString()
				videos = _.pluck(movies[title]['info']['videos']['results'], "key").toString()
				data_attrs = 'data-href="http://image.tmdb.org/t/p/w500/'+poster+
						'" data-toggle="modal" data-target="#movie_desc_modal"'+
						'" data-info="'+info+'" data-title="'+title+'" '+
						'data-cast="'+cast+'" '+
						'data-videos="'+videos+'"+data-crew="'+crew+'"'
						

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
			'<h2 class="title ellipsis">'+title+'</h2>'+
			'<div id="movieInfo'+id+'">'+
			'<p class="desc ellipsis">'+info+'</p><a id="readmore_'+id+'" '+data_attrs+'><p>More Info[+]</a>'+
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
			'<button class="btn btn-hot text-uppercase sweet-14 deleteCampaign" data-c_id="'+movies[title]['c_id']+'">Delete</button><button id="goBack'+id+'" class="btn btn-sunny text-uppercase">Cancel</button>'+
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

			  
			$('.deleteCampaign').on('click', function(e){
				toDelete = e.target.getAttribute("data-c_id");
			    swal({
			    	  name: c_id,
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
					if (isConfirm && toDelete !== "") {
					  	$.ajax({
							type: 'DELETE',
							"content-type": "Application/JSON",
							url:"http://localhost:5200/twitris-movie-ext/api/v1.0/remove/"+toDelete,
							success: function(results) {
								swal("Deleted!", "Your Campaign Has Been Deleted", "success");
							},
							error: function() {
								swal("Error!", "There Was An Error Deleting Your Campaign", "error");
							}
						})
					} else {
					    swal("Cancelled", "Your Campaign Is Safe", "error");
					}
					toDelete = "";
				});
			});

		    $("#show_sentiment_"+id).on('click', function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "sentiment");
		    });
		    $("#show_emotions_"+id).on('click', function(e){
		    	display_analysis($(this)[0].getAttribute("data-title"), "emotions");
		   	});

		   	$(window).on('focus', function(event) {
        $('.show-focus-status > .alert-danger').addClass('hidden');
        $('.show-focus-status > .alert-success').removeClass('hidden');
    }).on('blur', function(event) {
        $('.show-focus-status > .alert-success').addClass('hidden');
        $('.show-focus-status > .alert-danger').removeClass('hidden');
    });    
    
    $('.date-picker').each(function () {
        var $datepicker = $(this),
            cur_date = ($datepicker.data('date') ? moment($datepicker.data('date'), "YYYY/MM/DD") : moment()),
            format = {
                "weekday" : ($datepicker.find('.weekday').data('format') ? $datepicker.find('.weekday').data('format') : "dddd"),                
                "date" : ($datepicker.find('.date').data('format') ? $datepicker.find('.date').data('format') : "MMMM Do"),
                "year" : ($datepicker.find('.year').data('year') ? $datepicker.find('.weekday').data('format') : "YYYY")
            };

        function updateDisplay(cur_date) {    
            $datepicker.find('.date-container > .weekday').text(cur_date.format(format.weekday));
            $datepicker.find('.date-container > .date').text(cur_date.format(format.date));
            $datepicker.find('.date-container > .year').text(cur_date.format(format.year));
            $datepicker.data('date', cur_date.format('YYYY/MM/DD'));
            $datepicker.find('.input-datepicker').removeClass('show-input');
        }
        
        updateDisplay(cur_date);

        $datepicker.on('click', '[data-toggle="calendar"]', function(event) {
            event.preventDefault();
            $datepicker.find('.input-datepicker').toggleClass('show-input');
        });

        $datepicker.on('click', '.input-datepicker > .input-group-btn > button', function(event) {
            event.preventDefault();
            var $input = $(this).closest('.input-datepicker').find('input'),
                date_format = ($input.data('format') ? $input.data('format') : "YYYY/MM/DD");
            if (moment($input.val(), date_format).isValid()) {
               updateDisplay(moment($input.val(), date_format));
            }else{
                alert('Invalid Date');
            }
        });
        
        $datepicker.on('click', '[data-toggle="datepicker"]', function(event) {
            event.preventDefault();
            
            var cur_date = moment($(this).closest('.date-picker').data('date'), "YYYY/MM/DD"),
                date_type = ($datepicker.data('type') ? $datepicker.data('type') : "days"),
                type = ($(this).data('type') ? $(this).data('type') : "add"),
                amt = ($(this).data('amt') ? $(this).data('amt') : 1);
                
            if (type == "add") {
                cur_date = cur_date.add(date_type, amt);
            }else if (type == "subtract") {
                cur_date = cur_date.subtract(date_type, amt);
            }
            
            updateDisplay(cur_date);
        });
        
        if ($datepicker.data('keyboard') == true) {
            $(window).on('keydown', function(event) {
                if (event.which == 37) {
                    $datepicker.find('span:eq(0)').trigger('click');  
                }else if (event.which == 39) {
                    $datepicker.find('span:eq(1)').trigger('click'); 
                }
            });
        }
        
    });
		
			console.log("mycampainsuccess");
	}
	var myFailure = function(){
		console.log("ERROR")
	}

});






// <!--facbook,com/sharer.php?u='+-->