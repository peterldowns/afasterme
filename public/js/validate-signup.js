$(document).ready(function(){
  $('#signupForm').submit(function(){}); // disable default submission behavior
  var validator = $('#signupForm').validate({
    rules: {
      firstName: "required",
      age: {
        required: true,
        number: true
      },
      email: {
        required: true,
        email: true
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
    }
    


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
