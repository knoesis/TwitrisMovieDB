$(function() {
	$('#datepicker').datepicker({});

	

  $('#search_new_movies').on('keyup', function(e){
    var text = e.target.value,
        $children = $('#movieList > li'),
        $parent = $('#movieList');

    var $movie = $children.filter(function(){
        return $(this).attr('data-id').toLowerCase().indexOf(text.toLowerCase()) === 0; 
    });

    if ($movie.length>0) {
      $("html, body").animate({
           scrollTop: $movie.first().offset().top - $parent.offset().top + $parent.scrollTop()
        });
    }
  });

});
