$(document).ready(function(){		
	$.ajax({
		type: 'GET',
		"content-type": "Application/JSON",
		url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/new_releases",
		success: function listMovies (results) {
			results = results["results"];
			var movieTitle = "",
				month_array = [ "JAN","FEB","MAR","APR","MAY","JUNE",
					"JULY","AUG","SEPT","OCT","NOV","DEC"],
				genres={28:"Action",12:"Adventure",16:"Animation",
					35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",
					10751:"Family",14:"Fantasy",10769:"Foreign",
					36:"History",27:"Horror",10402:"Music",
					9648:"Mystery",10749:"Romance",878:"Science Fiction",
					10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"};

			results = _.sortBy(results, "release_date");

			for (var i = 0; i < results.length; i++) {
				// store a copy of results[i] as results so 
				// we don't waste cycles accessing the list
				var result = results[i],
					title = result["original_title"],
					info = result['overview'],
					id = result["id"],
					poster = result['poster_path'];

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
					gs = '',
					data_attrs = 'data-href="http://image.tmdb.org/t/p/w500/'+poster+
						'" data-toggle="modal" data-target="#movie_desc_modal"'+
						'" data-info="'+info+'" data-title="'+title+'"'

				// loop through the genres and create the HTML 
				// for the genre list
				for (var j=0; j<gIds.length&&j<3;j++) {
					gs+='<button style="float:right;" type="button" class="btn nohover btn-default btn-round-xs btn-sm"><span class="glyphicon glyphicon-tag"></span>'+genres[gIds[j]]+'</button>&nbsp';
				}
				// gs+=''; // close the genre list

				// stop backgound pic error by only adding the img el if
				// there is an img to retrieve
				var img = '';
				if (result["backdrop_path"] !== null) {
					img = '<a id="image_'+id+'" '+data_attrs+'><img src="http://image.tmdb.org/t/p/w500'+poster+
						'" data-title="'+title+'"/></a>'
				}	

				$('#movieList').append("<li>"+
					'<time datetime="'+date+'">'+
					'<span class="day">'+day+'</span>'+
					'<span class="month">'+month +'</span>'+
					'<span class="year">'+year+'</span>'+
					'</time>'+
					img+ // either "" or an img element
					'<div class="info">'+
					'<h2 class="title ellipsis">'+title+gs+'</h2>'+
					'<div id="movieInfo'+i+'">'+
					'<p class="desc ellipsis">'+result["overview"]+'<a id="readFull'+i+'" '+data_attrs+'><p>Read Full [+]</a></p>'+
					'<div id="rating'+i+'" data-score="'+result["popularity"]+'"></div>'+
					'<p class="senti" style="display:none;" id="movieSenti" class="">'+"Sentiment"+'</p>'+
					'</div>'+
					'<div style="display:none;" id="campaignOn'+i+'">'+
					'<h5>Would You Like To Start A Campaign On This Film?</h5>'+
					'<button class="btn btn-hot text-uppercase sweet-14 confirmCampaign'+i+'" );">Delete</button><button id="goBack'+i+'" class="btn btn-sunny text-uppercase">Cancel</button>'+
					'</div>'+
					'</div>'+
					'<div class="social">'+
					'<ul>'+					
					'<li class="power" id="power'+i+'" style="width:25%;"><a hr><span class="fa fa-power-off"></span></a></li>'+
					'</ul>'+
					'</div>'+
					'</div>'+
					'</li>')
							$('#rating'+i).raty({
									path: './images',
									readOnly: true, 					
									score: function() {
							    	return $(this).attr('data-score');
							  		}
								});			
							$("#power"+i).click({num:i},function (d) {
							    $('#movieInfo'+d.data.num).slideToggle("fast");
							    $('#campaignOn'+d.data.num).slideToggle("fast");				
							})
							$("#goBack"+i).click({num:i},function (d) {
							    $('#movieInfo'+d.data.num).slideToggle("fast");
							    $('#campaignOn'+d.data.num).slideToggle("fast");


							$(".confirmCampaign"+i).on('click', function(){
							    swal({
									  title: "Are You Sure?",
									  text: "You Will Be Starting A Campaign!",
									  type: "warning",
									  showCancelButton: true,
									  confirmButtonClass: "btn-success",
									  confirmButtonText: "Yes",
									  cancelButtonText: "No",
									  closeOnConfirm: false,
									  closeOnCancel: false
							},
							function(isConfirm) {
							  if (isConfirm) {
							    swal("Deleted!", "Your Campaign Has Been Started", "success");
							  } else {
							    swal("Cancelled", "We Have Not Started A Campaign", "error");
							  }
							});
					  });

					})
				}}		
		},
		error: function (e) {
			console.log(e.message);
			console.log("ERROR");
		}	
    });
});


$(document).ready(function(){

	$("#home, #home1").click(function(){
		 $("#welcomeScreen").show(1000);
		 $(".pageTitle").text("SilverBox - MVP DEMO");
		 $("#newReleases").hide(667);
		 $("#myCampains").hide(667);
		 $("#tvReleases").hide(667);
		 $("#mySupport").hide(667);
	});
	$("#new").click(function(){
		 $("#newReleases").show(1000);
		 $(".pageTitle").text("NEW MOVIE RELEASES");
		 $("#welcomeScreen").hide(667);
		 $("#myCampains").hide(667);
		 $("#tvReleases").hide(667);
		 $("#mySupport").hide(667);
	});
	$("#tv").click(function(){
		 $("#tvReleases").show(1000);
		 $(".pageTitle").text("TV SHOWS");
		 $("#welcomeScreen").hide(667);
		 $("#newReleases").hide(667);
		 $("#myCampains").hide(667);
		 $("#mySupport").hide(667);
	});
	$("#my").click(function(){
		 $("#myCampains").show(1000);
		 $(".pageTitle").text("MY CAMPAIGN'S");
		 $("#welcomeScreen").hide(667);
		 $("#newReleases").hide(667);
		 $("#tvReleases").hide(667);
		 $("#mySupport").hide(667);
	});
	$("#sup").click(function(){
		 $("#mySupport").show(1000);
		 $(".pageTitle").text("SUPPORT");
		 $("#welcomeScreen").hide(667);
		 $("#newReleases").hide(667);
		 $("#tvReleases").hide(667);
		 $("#myCampains").hide(667);

	});
	$("#home, #home1").click(function(){
		 $(this).find('#movieDesc, #movieSenti').toggle();
	});
});


$(function() {
	$("#menu").mmenu({
		extensions : [ "theme-dark", "border-full", "effect-slide-listitems","effect-zoom-menu", "effect-zoom-panels"],
		navbar : false
	}).on('click','a[href^="#/"]',function() {
		return true; // close the menu
	});
});