$(document).ready(function(){
  $('#emailControl').tooltip({
    placement: 'bottom',
    title: 'The email you signed up with',
    trigger: 'manual'
  });
  $('#passwordControl').tooltip({
    placement: 'bottom',
    title: 'Your password',
    trigger: 'manual'
  });
  $('#loginForm').submit(function(){});
  var validator = $('#loginForm').validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      password: "required"
    },
    messages: {
      email: "Please enter your email address",
      password: "Please enter your password"
    },
    errorClass: 'error',
    validClass: 'success',
    highlight: function(label, errorClass, validClass){
      $(label).closest('.control-group').removeClass(validClass).addClass(errorClass);
      $(label).closest('.control-group').tooltip('show');
    },
    unhighlight: function(label, errorClass, validClass){
      $(label).closest('.control-group').removeClass(errorClass).addClass(validClass);
    },
    submitHandler: function(form){
      var email = $('#email').val();
      var password = $('#password').val();
      $.ajax({
        url: '/login',
        type: 'POST',
        dataType: 'json',
        data: {
          email: email,
          password: password,
          _csrf: $('#_csrf').val()
        },
        success: function(data, textStatus, jqXHR){
          window.location = '/dashboard';
        },
        error: function(jqXHR, textStatus, errorThrown){
          window.location = '/login?error=true&email='+email;
        }
      });
      return false;
    },
    errorPlacement: function(error, element){
      // do nothing with errors. Just highlight.
    },
  });
});
