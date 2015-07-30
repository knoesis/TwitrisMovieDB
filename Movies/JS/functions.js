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
    $('#movie_desc_body').empty();
    var info = $("#"+e.relatedTarget.id)[0].getAttribute("data-info"),
        title = $("#"+e.relatedTarget.id)[0].getAttribute("data-title"),
        img = $("#"+e.relatedTarget.id)[0].getAttribute("data-href"),
        cast = $("#"+e.relatedTarget.id)[0].getAttribute("data-cast").split(","),
        crew = $("#"+e.relatedTarget.id)[0].getAttribute("data-crew").split(","),
        videos = $("#"+e.relatedTarget.id)[0].getAttribute("data-videos").split(","),
        $top_cast_members = $('<div>').attr('id',"top_cast_members").html('<h3 style="text-align:center">Cast</h3>');
        $add_cast_members = $('<div style="margin-top:15px">').attr('id',"add_cast_members").addClass("collapse");
        $top_crew_workers = $('<div>').attr('id',"top_crew_workers").html('<h3 style="text-align:center">Crew</h3>');
        $add_crew_workers = $('<div style="margin-top:15px">').attr('id',"add_crew_workers").addClass("collapse");
        $videos = $('<div>').html('<h3 style="text-align:center;">Trailer & Clips</h3><br><div class="carousel slide row-fluid" data-ride="carousel" id="video_carousel"> <ol class="carousel-indicators"></ol> <div id="video_carousel_inner" style="width:600px; margin-left:auto; margin-right:auto;" class="carousel-inner"></div> <!-- Carousel Buttons Next/Prev --> <a data-slide="prev" href="#video_carousel"class="left carousel-control"><i class="fa fa-chevron-left"></i></a> <a data-slide="next" href="#video_carousel" class="right carousel-control"> <i class="fa fa-chevron-right"></i></a> </div></br>');


    for (var i=0; i<cast.length;) {
      var member = {
        character: cast[i++],
        name: cast[i++]
      }
      var img_string = cast[i++]
      member['profile_pic'] = (img_string===""?"images/missingprofile.png":"https://image.tmdb.org/t/p/w45"+img_string)
      
        var $el;
        if (i<12) {
          $el = $top_cast_members;
        } else {
          $el = $add_cast_members;
        }

        $el.append('<div class="media"><div class="media-left"><a>'+
        '<img style="width:45px;height:68px;" class="media-object" src="'+member['profile_pic']+'" alt="'+member['name']+member['character']+'">'+
        '</a></div><div class="media-body"><h4 class="media-heading">'+member['name']+'</h4>'+
        '<p>'+member['character']+'</p></div></div>')
      }
    // $('.img').error(function () { $(this).css({visibility:'hidden'}); });

    for (var i=0; i<crew.length;) {
        var worker = {
            job: crew[i++],
            name: crew[i++]
        }
            
        var img_string = crew[i++]
        worker['profile_pic'] = (img_string===""?"images/missingprofile.png":"https://image.tmdb.org/t/p/w45"+img_string)
        
        if (i<12) {
          $wl = $top_crew_workers;
        } else {
          $wl = $add_crew_workers;
        }
        $wl.append('<div class="media"><div class="media-left"><a>'+
        '<img style="width:45px;height:68px;" class="media-object" src="'+worker['profile_pic']+'" alt="'+worker['name']+'">'+
        '</a></div><div class="media-body"><h4 class="media-heading">'+worker['job']+'</h4>'+
        '<p>'+worker['name']+'</p></div>')
      }


    for (var i=0; i < videos.length; i++){            
          $videos.find("#video_carousel_inner").append('<div class="item'+(i==0?" active":"")+'"><div class="embed-responsive embed-responsive-16by9" id="embed-container" width="700" height="400"><iframe src="http://www.youtube.com/embed/'+videos[i]+'?modestbranding=1&rel=1&iv_load_policy=3&ap=%2526fmt%3D18" frameborder="0" allowfullscreen=""></iframe></div></div>')
        } 

                  // Find all YouTube videos
          var $allVideos = $("iframe[src^='//www.youtube.com']"),

              // The element that is fluid width
              $fluidEl = $("body");

          // Figure out and save aspect ratio for each video
          $allVideos.each(function() {

            $(this)
              .data('aspectRatio', this.height / this.width)

              // and remove the hard coded width/height
              .removeAttr('height')
              .removeAttr('width');

          });

          // When the window is resized
          $(window).resize(function() {

            var newWidth = $fluidEl.width();

            // Resize all videos according to their own aspect ratio
            $allVideos.each(function() {

              var $el = $(this);
              $el
                .width(newWidth)
                .height(newWidth * $el.data('aspectRatio'));

            });

          // Kick off one resize to fix all videos on page load
          }).resize();

    $.ajax({
      type: 'GET',
      "content-type": "Application/JSON",
      url:"http://127.0.0.1:5200/twitris-movie-ext/api/v1.0/get_reviews/"+title,
        success: function(results) {
          $('#movie_desc_body').html(
            $('<div>').addClass("row-fluid").css("min-height","525px").html(
              $('<div>').addClass('col-lg-5 col-lg-offset-0 col-md-5 col-md-offset-0 col-sm-8 col-sm-offset-2').html($('<img height="513" width="342">').attr('src',img)))
                .append($('<div>').addClass('col-lg-7 col-md-7 col-sm-12')
                        .append($('<h3>').addClass('text-center').text('Description'))
                          .append($('<p>').text(info))
                          .append($('<div>').addClass('col-lg-6 col-md-6 text-right')
                            .html($('<div>').addClass('text-left').css({"overflow":"auto","height":"310px"})
                              .append($top_cast_members)
                              .append($add_cast_members))
                              .append($('<button class="btn btn-twitris btn-round-xs" id="showCast">').text("Show More")))
                          .append($('<div>').addClass('col-lg-6 col-md-6 text-right')
                            .html($('<div>').addClass('text-left').css({"overflow":"auto","height":"310px"})
                              .append($top_crew_workers)
                              .append($add_crew_workers))
                              .append($('<button class="btn btn-twitris btn-round-xs" id="showCrew">').text("Show More")))))
                .append($videos)
                .append($('<div>').addClass("row-fluid")
                  .html('<img class="image_banner" src="images/rtlogo.png" alt="Rotton Tomatoes Logo">'+
                  '<div class="carousel slide row-fluid" data-ride="carousel" id="quote-carousel">'+
                  '<ol class="carousel-indicators"></ol>'+
                  '<div id="carousel_inner" class="carousel-inner"></div>'+
                  '<!-- Carousel Buttons Next/Prev --> <a data-slide="prev" href="#quote-carousel"'+
                  ' class="left carousel-control"><i class="fa fa-chevron-left"></i></a> '+
                  '<a data-slide="next" href="#quote-carousel" class="right carousel-control">'+
                  '<i class="fa fa-chevron-right"></i></a> </div>'));

           $("#showCast").click(function(){
                $("#add_cast_members").toggleClass("in");
                $(this).text(function(i, v){
                   return v === 'Show More' ? 'Show Less' : 'Show More'
                        })              
            });

            $("#showCrew").click(function(){
                $("#add_crew_workers").toggleClass("in");
                $(this).text(function(i, v){
                   return v === 'Show More' ? 'Show Less' : 'Show More'
                        })      
            });



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
            '<div class="col-sm-9"> <p>'+resultNumb[i]["quote"]+'</p> <a target="_blank" style="text-decoration:none" href="'+resultNumb[i]["links"]["review"]+'"><small>'+resultNumb[i]["publication"]+' on [ '+resultNumb[i]["date"]+' ] by ['+resultNumb[i]["critic"]+']</small></a>'+
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
