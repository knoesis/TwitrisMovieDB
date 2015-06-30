$(document).ready(function(){	
	$.ajax({
		type: 'GET',
		"content-type": "Application/JSON",
		url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/new_releases",
		success: function listMovies (results) {
			results = results["results"];
			var movieTitle = ""
				month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
				genres={28:"Action",12:"Adventure",16:"Animation",
					35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",
					10751:"Family",14:"Fantasy",10769:"Foreign",
					36:"History",27:"Horror",10402:"Music",
					9648:"Mystery",10749:"Romance",878:"Science Fiction",
					10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"}

			for (var i = 0; i < results.length; i++) {
				// store a copy of results[i] as results so 
				// we don't waste cycles accessing the list
				var result = results[i];
				// only parse if the movie is in english
				if (result["original_language"]==="en" && 
						result["release_date"] !== null) {
					
				// parse the date into an appropriate format
				var date = result["release_date"],
					day = date.substring(8,10),
					month = month_array[parseInt(date.substring(6,7))-1],	
					year = date.substring(0,4),
					// get the genre ids from the movie
					gIds = result['genre_ids'],
					// create a var to store the genre list
					gs = '<ul>';

				// loop through the genres and create the HTML 
				// for the genre list
				for (var j=0; j<gIds.length;j++) {
					gs+='<li>'+genres[gIds[j]]+'</li>';
				}
				gs+='</ul>'; // close the genre list

				// stop backgound pic error by only adding the img el if
				// there is an img to retrieve
				var img = '';
				if (result["backdrop_path"] !== null) {
					img = '<a><img data-lightbox="" alt="" src="http://image.tmdb.org/t/p/w500/'+result["backdrop_path"]+'" /></a>'
				}

				$('#movieList').append("<li>"+
					'<time datetime="'+date+'">'+
					'<span class="day">'+day+'</span>'+
					'<span class="month">'+month +'</span>'+
					'<span class="year">'+year+'</span>'+
					'</time>'+
					img+ // either "" or an img element
					'<div class="info">'+
					'<h2 class="title">'+result["original_title"]+'</h2>'+
					'<div class="movieDesc" id="'+result['id']+'">'+
					'<p class="desc">'+result["overview"]+'</p>'+
					'</div>'+
					'<p class="senti" style="display:none;" id="movieSenti" class="">'+"Sentiment"+'</p>'+
					gs+  // either <ul></ul> or a list of genres
					'<ul>'+
					'<li class="sentimentTogg" style="width:25%;">1 <span class="fa fa-smile-o"></span></li>'+
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
		 $('.movieDesc').each(function() {
		 	$('#'+$(this).attr('id')).dotdotdot({
		 		height:"25px",
		 		watch: false
		 	});
		 })
		 $("#welcomeScreen").hide();
		 $("#myCampains").hide();
	});
	$("#my").click(function(){
		 $("#myCampains").show();
		  $('.movieDesc').each(function() {
		 	$('#'+$(this).attr('id')).dotdotdot({
		 		height:"25px",
		 		watch: false
		 	});
		 })
		 $("#welcomeScreen").hide();
		 $("#newReleases").hide();

	});
	$("#home, #home1").click(function(){
		 $(this).find('#movieDesc, #movieSenti').toggle();
	});
});


$(function() {
	$("#menu").mmenu({
		extensions : [ "theme-white", "border-full", "effect-slide-listitems" ],
		navbar : false
	}).on('click','a[href^="#/"]',function() {
		return true; // close the menu
	});
});