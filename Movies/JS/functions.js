$(function() {
	$('#datepicker').datepicker({});

	$('#movie_desc_modal').on('show.bs.modal', function (e) {
		var info = $("#"+e.relatedTarget.id)[0].getAttribute("data-info"),
			title = $("#"+e.relatedTarget.id)[0].getAttribute("data-title"),
			img = $("#"+e.relatedTarget.id)[0].getAttribute("data-href"),
			rating = $("#"+e.relatedTarget.id)[0].getAttribute("data-href"),
			rottenTom = movies[title]["reviews"];
		$('#movie_desc_body').html(
			$('<div>').addClass("row-fluid").html(
				$('<div>').addClass('col-lg-8').html($('<img>').attr('src',img))).append(
				$('<div>').addClass('col-lg-4').html($('<p>').text(info))))
			.append('<p></p>');
		$('#modal_title').text(title)
	});
});