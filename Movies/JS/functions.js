$(function() {
	$('#datepicker').datepicker({});

	$('#movie_desc_modal').on('shown.bs.modal', function (e) {
		console.log(e);
	});
});