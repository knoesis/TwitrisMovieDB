$(function() {
	$('#datepicker').datepicker({});

  var scroll = function(e, id) {
    var text = e.target.value,
      $children = $(id+' > li'),
      $parent = $(id);

    var $movie = $children.filter(function(){
      return $(this).attr('data-id').toLowerCase().indexOf(text.toLowerCase()) === 0; 
    });

    if ($movie.length>0) {
      $("html, body").animate({
        scrollTop: $movie.first().offset().top - $parent.offset().top + $parent.scrollTop()
      });
    }
  }

  $('#search_now_playing').on('keyup', function(e){
      scroll(e, "#movies_now_playing_list");
  });
  $('#search_upcoming').on('keyup', function(e){
      scroll(e, "#movies_upcoming_list");
  });

  $('#movie_desc_modal').on('show.bs.modal', function (e) {
    var info = $("#"+e.relatedTarget.id)[0].getAttribute("data-info"),
        title = $("#"+e.relatedTarget.id)[0].getAttribute("data-title"),
        img = $("#"+e.relatedTarget.id)[0].getAttribute("data-href"),
        cast = $("#"+e.relatedTarget.id)[0].getAttribute("data-cast").split(","),
        crew = $("#"+e.relatedTarget.id)[0].getAttribute("data-crew").split(","),
        videos = $("#"+e.relatedTarget.id)[0].getAttribute("data-videos").split(","),
        $cast_members = $('<div>').attr('id',"cast_members").html('<h5>Cast</h5>');
        $director = $('<div>').attr('id',"director").html('<h5>Director</h5>');


    for (var i=0; i< 12;) {
      var member = {
        character: cast[i++],
        name: cast[i++],
        profile_pic: cast[i++]
      }
        $cast_members.append(
        '<div class="media">'+
        '<div class="media-left">'+
        '<a>'+
        '<img class="media-object" src="https://image.tmdb.org/t/p/w45'+member['profile_pic']+'" alt="...">'+
        '</a>'+
        '</div>'+
        '<div class="media-body">'+
        '<h4 class="media-heading">'+member['name']+'</h4>'+
        '<p>'+member['character']+'</p>'+
        '</div>'+
        '</div>')
    for (var i=0; i< 12;) {
        var director = {
            job: crew[i++],
            name: crew[i++],
            profile_pic: crew[i++]
        }
    }
      $director.append(
      '<div class="media">'+
      '<div class="media-left">'+
      '<a>'+
      '<img class="media-object" src="https://image.tmdb.org/t/p/w45'+member['profile_pic']+'" alt="...">'+
      '</a>'+
      '</div>'+
      '<div class="media-body">'+
      '<h4 class="media-heading">'+member['name']+'</h4>'+
      '<p>'+member['character']+'</p>'+
      '</div>'+
      '</div>')







    }

    $.ajax({
      type: 'GET',
      "content-type": "Application/JSON",
      url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+title,
        success: function(results) {
          $('#movie_desc_body').html(
            $('<div>').addClass("row-fluid").html(
              $('<div>').addClass('col-lg-8').html($('<img>').attr('src',img))).append(
              $('<div>').addClass('col-lg-4')
                .html($('<p>').text(info))
                  .append($cast_members)
                  .append($cast_members)))
            .append(' <ul class="bxslider"></ul>')
            .append('<img src="images/rtlogo.png" alt="Rotton Tomatoes Logo">'+
              '<div class="carousel slide row-fluid" data-ride="carousel" id="quote-carousel">'+
              '<ol class="carousel-indicators"></ol>'+
              '<div id="carousel_inner" class="carousel-inner"></div>'+
              '<!-- Carousel Buttons Next/Prev --> <a data-slide="prev" href="#quote-carousel"'+
              ' class="left carousel-control"><i class="fa fa-chevron-left"></i></a> '+
              '<a data-slide="next" href="#quote-carousel" class="right carousel-control">'+
              '<i class="fa fa-chevron-right"></i></a> </div>');



          // for (var i=0; i < videos.length; i++){            
          //   $('.bxslider').append('<li>'+
          //     '<iframe src="https://www.youtube.com/watch?v='+videos[i]+'" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'+
          //     '</li>')
          // }  

          var resultNumb = results["reviews"];
        
          for ( var i = 0; i < resultNumb.length ; i++) {
            var rottonImg = "",
                hFresh = resultNumb[i]["freshness"];
    
            if (hFresh === "fresh") {
              rottonImg = "images/fresh.png"
            } else {
              rottonImg = "images/gonebad.png" 
            }

            $('#carousel_inner').append(
            // <!-- Rotton Tomatoes Reviews --> 
            '<div class="item '+(i===0?"active":"")+'"> <blockquote> '+
            '<div class="row-fluid"> '+
            '<div class="col-sm-12 text-center"> '+
            '<img class="img-circle" src="'+rottonImg+'" style="width: 100px;height:100px;"> '+       
            '<div class="col-sm-9"> <p>'+resultNumb[i]["quote"]+'</p> <small>'+resultNumb[i]["critic"]+' from [ '+resultNumb[i]["publication"]+' ] ['+resultNumb[i][""]+']</small>'+
            '</div> '+
            '</div> </blockquote> '+
            '</div>')
          }
        },
        error: function(e) {
          console.log(e);
        }
    });

    $('#modal_title').text(title);

  })

});
