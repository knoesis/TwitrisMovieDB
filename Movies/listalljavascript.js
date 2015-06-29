$(document).ready(function(){	
		$.ajax({
			type: 'GET',
			"content-type": "Application/JSON",
			url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/new_releases",
			success: function listMovies (results) {
				results = results["results"];
				var movieTitle = "";
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

				for (var i = 0; i < results.length; i++) {

					if (results[i]["original_language"]==="en"){
						
					var date = results[i]["release_date"];
					var day = date.substring(8,10);
					var month = month_array[parseInt(date.substring(6,7))-1];		
					var year = date.substring(0,4);

					$('#movieList').append("<li>"+
					'<time datetime="'+date+'">'+
					'<span class="day">'+day+'</span>'+
					'<span class="month">'+month +'</span>'+
					'<span class="year">'+year+'</span>'+
					'</time>'+
					'<img alt="" src="http://image.tmdb.org/t/p/w500/'+results[i]["backdrop_path"]+'" />'+
					'<div class="info">'+
					'<h2 class="title">'+results[i]["original_title"]+'</h2>'+
					'<p class="desc" id="movieDesc" class="dsotdotdot">'+results[i]["overview"]+'</p>'+
					'<p class="senti" style="display:none;" id="movieSenti" class="">'+"Sentiment"+'</p>'+
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
					}}
					$("img").error(function(){
	        		$(this).hide();
					});

					$('.dotdotdot').dotdotdot({
						height: "100px"

					});					
			},
			error: function (e) {
				console.log(e.message);
				console.log("ERROR");
			}	
    });
});


	$(document).ready(function(){
		$("#home, #home1").click(function(){
			 $("#welcomeScreen").show();
    		 $("#newReleases").hide();
    		 $("#myCampains").hide();
		});
		$("#new").click(function(){
			 $("#newReleases").show();
    		 $("#welcomeScreen").hide();
    		 $("#myCampains").hide();
		});
		$("#my").click(function(){
			 $("#myCampains").show();
    		 $("#welcomeScreen").hide();
    		 $("#newReleases").hide();
		});
		$("#home, #home1").click(function(){
			 $(this).find('#movieDesc, #movieSenti').toggle();
		});


});

	$(document).ready(function(){
		$(function() {
				$("#menu")
					.mmenu({
		extensions 	: [ "theme-white", "border-full", "effect-slide-listitems" ],
		navbar 		: false
					}).on( 'click',
						'a[href^="#/"]',
						function() {
							return false;
						}
					);
			});
});	