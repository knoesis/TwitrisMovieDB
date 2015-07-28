$(function() {
  $('#chart_carousel').carousel('pause');
  
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
        $top_cast_members = $('<div>').attr('id',"top_cast_members").html('<h4>Cast</h4>');
        $add_cast_members = $('<div style="margin-top:15px">').attr('id',"add_cast_members").addClass("collapse");
        $top_crew_workers = $('<div>').attr('id',"top_crew_workers").html('<h4>Crew</h4>');
        $add_crew_workers = $('<div style="margin-top:15px">').attr('id',"add_crew_workers").addClass("collapse");
        $videos = $('<div class="col-md-12 col-sm-12 col-lg-12">').attr('id', 'videos').html('<h4>Videos</h4>');


    for (var i=0; i<cast.length;) {
      var member = {
        character: cast[i++],
        name: cast[i++],
        profile_pic: cast[i++]
      }
        var $el;
        if (i<12) {
          $el = $top_cast_members;
        } else {
          $el = $add_cast_members;
        }

        $el.append(
        '<div class="media">'+
        '<div class="media-left">'+
        '<a>'+
        '<img class="media-object" src="https://image.tmdb.org/t/p/w45'+member['profile_pic']+'" alt="'+member['name']+member['character']+'">'+
        '</a>'+
        '</div>'+
        '<div class="media-body">'+
        '<h4 class="media-heading">'+member['name']+'</h4>'+
        '<p>'+member['character']+'</p>'+
        '</div>'+
        '</div>')
      }

    for (var i=0; crew.length;) {
        var worker = {
            job: crew[i++],
            name: crew[i++],
            profile_pic: crew[i++]
        }
        var $wl;
        if (i<12) {
          $wl = $top_crew_workers;
        } else {
          $wl = $add_crew_workers;
        }
        $wl.append(
        '<div class="media">'+
        '<div class="media-left">'+
        '<a>'+
        '<img class="media-object" src="https://image.tmdb.org/t/p/w45'+worker['profile_pic']+'" alt="'+worker['name']+'">'+
        '</a>'+
        '</div>'+
        '<div class="media-body">'+
        '<h4 class="media-heading">'+worker['job']+'</h4>'+
        '<p>'+worker['name']+'</p>'+
        '</div>')
      }


    for (var i=0; i < videos.length; i++){            
          $videos.find('li').append('<a style="width:800px;height:400px;"class="video" data-autovideo="true" href="http://www.youtube.com/embed/'+videos[i]+'"></a></div>')
        } 

    $.ajax({
      type: 'GET',
      "content-type": "Application/JSON",
      url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+title,
        success: function(results) {
          $('#movie_desc_body').html(
            $('<div>').addClass("row-fluid").html(
              $('<div>').addClass('col-lg-5').html($('<img>').attr('src',img)))
            .append(
              $('<div>').addClass('col-lg-3')
                .html($('<p>').text(info))
                  .append($top_cast_members)
                  .append($add_cast_members)
                  .append($top_crew_workers)
                  .append($add_crew_workers)))
            // .append($videos)
            .append('<img src="images/rtlogo.png" alt="Rotton Tomatoes Logo">'+
              '<div class="carousel slide row-fluid" data-ride="carousel" id="quote-carousel">'+
              '<ol class="carousel-indicators"></ol>'+
              '<div id="carousel_inner" class="carousel-inner"></div>'+
              '<!-- Carousel Buttons Next/Prev --> <a data-slide="prev" href="#quote-carousel"'+
              ' class="left carousel-control"><i class="fa fa-chevron-left"></i></a> '+
              '<a data-slide="next" href="#quote-carousel" class="right carousel-control">'+
              '<i class="fa fa-chevron-right"></i></a> </div>');



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
            '<div class="col-sm-9"> <p>'+resultNumb[i]["quote"]+'</p> <small>'+resultNumb[i]["publication"]+' from [ '+resultNumb[i]["date"]+' ] ['+resultNumb[i]["critic"]+']</small>'+
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
