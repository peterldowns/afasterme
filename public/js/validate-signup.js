$(document).ready(function(){
  $('.help-block').hide();
  $('.help-inline > i').click(function(){
    $(this).parent().parent().find('p').slideToggle(200);
  });
  $('#signupForm').submit(function(){}); // disable default submission behavior
  var signupValidator = $('#signupForm').validate({
    rules: {
      name: "required",
      username: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        equalTo: "#password2"
      },
      age: {
        required: true,
        number: true,
        min: 1,
        max: 100
      },
      priorExperience: "required",
      weight : {
        required: true,
        number: true
      },
      zipcode : {
        digits: true,
        rangelength: [5, 5]
      }
    },
    messages: {
    },
    errorClass: 'error',
    validClass: 'success',
    highlight: function(label, errorClass, validClass){
      $(label)
        .closest('.control-group')
          .removeClass(validClass)
          .addClass(errorClass);
      $(label)
        .parent().parent()
          .find('p')
            .slideDown(200);
    },
    unhighlight: function(label, errorClass, validClass){
      $(label)
        .closest('.control-group')
          .removeClass(errorClass)
          .addClass(validClass);
      $(label)
        .parent().parent()
          .find('p')
            .slideUp(200);
    },
    submitHandler: function(form){
      console.log('hi');
      var formdata = $('#signupForm').serialize();
      var email = $('#email').val();
      $.ajax({
        url: '/user',
        type: 'POST',
        dataType: 'json', 
        data: $('#signupForm').serialize(),
        success: function(data, textStatus, jqXHR){
          window.location = '/login?newuser=true&email='+email;
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log("!!jqXHR", jqXHR, "\n!!Text Status", textStatus, "\n!!errorThrown", errorThrown);
        }
      });
      return false;
    },
    errorPlacement: function(error, element){
      // Do nothing
    }
  });
});
