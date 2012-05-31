var run_logging = function(formID){
  $.validator.addMethod(
      'regex',
      function(value, element, regexp){
        var re = new RegExp(regexp);

        console.log("Regexp:", re);
        console.log(" Value:", value);
        console.log("Match?:", re.test(value));
        return this.optional(element) || re.test(value);
      },
      'Please check your input — failed regex test.'
      );
  $(document).ready(function(){
    $(formID).submit(function(){}); // disable default submission behavior
    var logValidator = $(formID).validate({
      rules: {
               logDistanceVal: {
                                 number: true,
                               },
        logTime: {
                   regex: '^\\d+:\\d{2}$'
                 },
             },
        messages: {
                  },
        errorClass: 'error',
        validClass: '',
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
                         console.log('Submitted logging form.');
                         $('#logSave').button('loading');
                         $.ajax({
                           url: '/user/calendar/day/log',
                           type: 'PUT',
                           dataType: 'json',
                           data: $(formID).serialize(),
                           success: function(data, textStatus, jqXHR){
                             alert("Saved successfully!");
                           },
                           error: function(jqXHR, textStatus, errorThrown){
                                    alert("Did not save. Please try again.");
                                    console.log(jqXHR, textStatus, errorThrown);
                                  },
                           complete: function(jqXHR, textStatus){
                                       $('#logSave').button('reset');
                                     }
                         });
                         return false;
                       },
        errorPlacement: function(error, element){
                          // Do nothing
                        }
    });
  });
}
