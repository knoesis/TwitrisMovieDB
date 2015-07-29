$(function(){	
	var facebook_share = 'http://www.facebook.com/sharer.php?u='+window.location.href,
		gplus_share = 'https://plus.google.com/share?url='+window.location.href,
		twitter_share = 'http://twitter.com/share?text=Check%20out%20this%20Twitris%20analysis&url='+window.location.href,
		email_share = 'mailto:?Subject=Check%20out%20this%20Twitris%20analysis&Body='+window.location.href

	var month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
		movies = {},
		welcome_visible = true,
		toDelete = "",
		current_chart = {
			title: "",
			sent_emo: "",
			type: "",
			c_id: ""
		};


	// When the myCampains have been loaded 
	// hide the welcomePage and show the myCampains Page
	var got_info_clear_welcome = function() {
		$('#welcomeScreen').hide();
		$(".pageTitle").text("My Campaign's");
		$('#myCampains').show();
		welcome_visible = false;
	}

	var draw_chart = function(name, sent_emo, type) {
		var type = (_.isUndefined(type)?(sent_emo==="emotions"?"pie":"line"):type),
			series = graph_data(movies[name][sent_emo], type),
			title = [name,(sent_emo==="emotions"?"Emotions":"Sentiment"),"Analysis"].join(" "),
			built_graph = buildChart("chart_body", title, series, (type==="pie"?true:false)),
			chart = new Highcharts.Chart( built_graph );
		current_chart['title'] = name;
		current_chart['sent_emo'] = sent_emo; 
		current_chart['type'] = type;  
		current_chart['c_id'] = movies[name]['c_id'];
	}

	$('#chart_type').change(function(e){
		var type = e.target.id,
			name = current_chart['title'],
			sent_emo = current_chart['sent_emo']; 
		$('#chart_carousel').carousel('prev');
		$('#chart_carousel').carousel('pause');
		draw_chart(name, sent_emo, type);
	});

	$('#change_date').on('click', function(e){
		var start = $('#start_date').attr('data-date'),
			end = $('#end_date').attr('data-date')
			sent_emo = current_chart['sent_emo'];

		$.ajax({
			type: 'GET',
			data: {
				start_date: start,
				end_date: end
			},
			"content-type": "Application/JSON",
			url:"http://localhost:5200/twitris-movie-ext/api/v1.0/"+sent_emo+"/"+current_chart['c_id'],
			success: function (response) { 
				var name = current_chart['title']
					sent_emo = current_chart['sent_emo']
					type = current_chart['type']
				movies[name][sent_emo] = response['data'];
				$('#chart_carousel').carousel('prev');
				$('#chart_carousel').carousel('pause');
				draw_chart(name, sent_emo, type);
			},
			error: function(){
				console.log("ERROR")
			}
		})
	})

	var display_analysis = function(name, sent_emo, type) {
		if (!_.isUndefined(movies[name])) {
			$('#chart_body').empty();
			$("#multi_modal").modal();
			$('#multi_modal').on('shown.bs.modal', function() {
				draw_chart(name, sent_emo, type)
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
				var result = resp[i],
					title = resp[i]['event'],
					id = resp[i]['id']
					movie = {};
				movies[title] = {
					c_id : id
				}
				movie['info'] = result['info']['info']
				movie['credits'] = result['info']['credits']
				movie['videos'] = result['info']['videos']
				movies[title]["sentiment"]=result['sentiment'];
				movies[title]["emotions"]=result['emotions'];
				var date = movie["info"]["release_date"],
					day = date.substring(8,10),
					month = month_array[parseInt(date.substring(6,7))-1],
					year = date.substring(0,4),
					poster = movie["info"]["poster_path"],
					info = movie['info']['overview'],
					cast = _.zip( _.pluck(movie['credits']['cast'], "character"),
							_.pluck(movie['credits']['cast'], "name"),
							_.pluck(movie['credits']['cast'], "profile_path")).toString(),					
					crew = [];

				_.each(movie['credits']['crew'], function(item){
					if(item['job']==='Director' || item['job']==='Writer' || item['job']==='Producer'){
					    crew.push(item)
					}
				})
				crew = _.zip(_.pluck(crew, "name"),_.pluck(crew, "job"),_.pluck(crew, "profile_path")).toString()

				var videos = _.pluck(movie['videos']['results'], "key").toString(),
					data_attrs = 'data-href="http://image.tmdb.org/t/p/w342/'+poster+
						'" data-toggle="modal" data-target="#movie_desc_modal"'+
						'" data-info="'+info+'" data-title="'+title+'" '+
						'data-cast="'+cast+'" data-crew="'+crew+'" '+
						'data-videos="'+videos+'"';

				if (welcome_visible)  {
					got_info_clear_welcome();
				}
				
				$('#campaignMovieList').append("<li>"+
				'<time datetime="'+date+'"><span class="day">'+day+'</span><span class="month">'+month +'</span><span class="year">'+year+'</span>'+
				'</time><a id="image_'+id+'" '+data_attrs+'><img alt="" src="http://image.tmdb.org/t/p/original/'+poster+'" /></a>'+
				'<div class="info"><h2 class="title ellipsis">'+title+'</h2><div id="movieInfo'+id+'">'+
				'<p class="desc ellipsis">'+info+'</p><a id="readmore_'+id+'" '+data_attrs+'><p>More Info[+]</a></div><ul>'+
				'<li style="width:33.3%;"><span class="fa fa-bar-chart" id="show_sentiment_'+id+'" data-title="'+title+'"> Sentiment</span></li>'+
				'<li style="width:33.3%;"><span class="fa fa-pie-chart" id="show_emotions_'+id+'" data-title="'+title+'"> Emotional</span></li>'+
				'<li style="width:33.3%;"><span class="fa fa-globe"> Network</span></li></ul>'+
				'<div style="display:none;" id="campaignOn'+id+'"><h5>Would You Like To Delete The Campaign?</h5>'+
				'<button class="btn btn-hot text-uppercase sweet-14 deleteCampaign" data-c_id="'+movie['c_id']+
				'">Delete</button><button id="goBack'+id+'" class="btn btn-sunny text-uppercase">Cancel</button>'+
				'</div></div><div class="social"><ul>'+
				'<li class="facebook" style="width:25%;"><a href="#facebook"><span class="fa fa-facebook"></span></a></li>'+
				'<li class="twitter" style="width:25%;"><a href="#twitter"><span class="fa fa-twitter"></span></a></li>'+
				'<li class="google-plus" style="width:25%;"><a href="#google-plus"><span class="fa fa-google-plus"></span></a></li>'+
				'<li class="power" id="power'+id+'" style="width:25%;"><a><span class="fa fa-power-off"></span></a></li>'+
				'</ul></div></li>')

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
			};
		}, error: function(){
			console.log("ERROR")
		}
	});

});






// <!--facbook,com/sharer.php?u='+-->