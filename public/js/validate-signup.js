$(document).ready(function(){
  $('.help-block').hide();
  $('.help-inline > i').click(function(){
    $(this).parent().parent().find('p').slideToggle(200);
  });
  $('#signupForm').submit(function(){}); // disable default submission behavior
  var validator = $('#signupForm').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        equalTo: "#password2"
      },
      firstName: "required",
      age: {
        required: true,
        number: true
      },
      cellphone: {
        required: false,
      },
      priorExperience: "required",
      bestPRRace: {
        required: "#priorExperience:checked",
      },
      bestPRTime: {
        required: "#priorExperience:checked",
      },
      serious: "required",
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
    },
    errorPlacement: function(error, element){
      // Do nothing
    }
  });
});
