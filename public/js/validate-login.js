$(document).ready(function(){
  $('#loginForm').submit(function(){});
  var validator = $('#loginForm').validate({
    rules: {
      email: "required",
      password: "required"
    },
    messages: {
      email: "Please enter your email address",
      password: "Please enter your password"
    },
    errorClass: 'error',
    validClass: 'success',
    highlight: function(label, errorClass, validClass){
      $(label).parent().removeClass(validClass).addClass(errorClass);
    },
    unhighlight: function(label, errorClass, validClass){
      $(label).parent().removeClass(errorClass).addClass(validClass);
    },
    submitHandler: function(form){
      var email = $('#email').val(),
          password = $('#password').val();
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
    }
    errorPlacement: function(error, element){
      // do nothing with errors. Just highlight.
    },
  });
});
