$(document).ready(function(){
  $('.help-block').hide();
  $('.help-inline > i').click(function(){
    $(this).parent().parent().find('.help-block').slideToggle(200);
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
      scheduleType : "required",
      weight : {
        required: true,
        number: true
      },
      zipcode : {
        required: true,
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
          .find('.help-block')
            .slideDown(200);
    },
    unhighlight: function(label, errorClass, validClass){
      $(label)
        .closest('.control-group')
          .removeClass(errorClass)
          .addClass(validClass);
      $(label)
        .parent().parent()
          .find('.help-block')
            .slideUp(200);
    },
    submitHandler: function(form){
      console.log('Submitted login form.');
      $('#signupSubmit').button('loading');
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
          alert("There's been an error and we could not create your account at this time. Please try again.");
          console.log("!!jqXHR", jqXHR, "\n!!Text Status", textStatus, "\n!!errorThrown", errorThrown);
        },
        complete: function(jqXHR, textStatus){
          $('#signupSubmit').button('reset');
        }
      });
      return false;
    },
    errorPlacement: function(error, element){
      // Do nothing
    }
  });
});
