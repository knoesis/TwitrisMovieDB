$(document).ready(function(){  
  $document.querySelector('.sweet-10').onclick = function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "info",
      showCancelButton: true,
      confirmButtonClass: 'btn-primary',
      confirmButtonText: 'Primary!'
    });
  };
  $document.querySelector('.sweet-12').onclick = function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "success",
      showCancelButton: true,
      confirmButtonClass: 'btn-success',
      confirmButtonText: 'Success!'
    });
  };

  $document.querySelector('.sweet-13').onclick = function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: 'btn-warning',
      confirmButtonText: 'Warning!'
    });
  };
};