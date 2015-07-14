$(function() {
	$('#datepicker').datepicker({});

	$('#movie_desc_modal').on('show.bs.modal', function (e) {
		var info = $("#"+e.relatedTarget.id)[0].getAttribute("data-info"),
			title = $("#"+e.relatedTarget.id)[0].getAttribute("data-title"),
			img = $("#"+e.relatedTarget.id)[0].getAttribute("data-href"),

		
		$('#movie_desc_body').html(
			$('<div>').addClass("row-fluid").html(
				$('<div>').addClass('col-lg-8').html($('<img>').attr('src',img))).append(
				$('<div>').addClass('col-lg-4').html($('<p>').text(info))))
			.append('
		<div class="carousel slide" data-ride="carousel" id="quote-carousel">
	        <!-- Bottom Carousel Indicators -->
	        <ol class="carousel-indicators">
	          <li data-target="#quote-carousel" data-slide-to="0" class="active"></li>
	          <li data-target="#quote-carousel" data-slide-to="1"></li>
	          <li data-target="#quote-carousel" data-slide-to="2"></li>
	        </ol>        
        <!-- Carousel Slides / Quotes -->
        <div class="carousel-inner">        
          <!-- Quote -->
        <div class="item active">
            <blockquote>
              <div class="row">
                <div class="col-sm-3 text-center">
                  <img class="img-circle" src="http://www.reactiongifs.com/r/overbite.gif" style="width: 100px;height:100px;">
                  <!--<img class="img-circle" src="https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg" style="width: 100px;height:100px;">-->
                </div>
                <div class="col-sm-9">
                  <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit!</p>
                  <small>Someone famous</small>
                </div>
              </div>
            </blockquote>
        </div>

         <!-- Carousel Buttons Next/Prev -->
        <a data-slide="prev" href="#quote-carousel" class="left carousel-control"><i class="fa fa-chevron-left"></i></a>
        <a data-slide="next" href="#quote-carousel" class="right carousel-control"><i class="fa fa-chevron-right"></i></a>
      </div>');
		$('#modal_title').text(title)
	});
});