$(document).ready(function(){
  $('#signupForm').submit(function(){}); // disable default submission behavior
  var validator = $('#signupForm').validate({
    rules: {
    },
    messages: {
    },
    errorClass: 'error',
    validClass: 'success',
    highlight: function(label, errorClass, validClass){
    },
    unhighlight: function(label, errorClass, validClass){
    },
    submitHandler: function(form){
    }
  });
