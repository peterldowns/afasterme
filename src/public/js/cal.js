var renderCalendar = function(mm, yyyy){
  // Create current date object
  var now = new Date();

  // Defaults
  if(arguments.length == 0){
    mm = now.getMonth();
    yyyy = now.getFullYear();
  }

  // Create the viewed date object
  var curMonth = new Date(yyyy, mm, 1), // first day of current month
      curYear = curMonth.getFullYear();

  var prevMonth = new Date(curYear, mm-1, 1), // first day of previous month
      nextMonth = new Date(curYear, mm+1, 1); // first day of next month

  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
 ];
  var HEADINGS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    //"Summary"
  ];
  var MONTH_LENGTHS = [
    31,
    now.getYear()%4== 0 ? 29: 28, // Leap years
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  
  // Important Dates
  var fdom = curMonth.getDay(); // First day of month (day of week)

  // Clear the view
  $('#calendar > thead:last').empty();
  $('#calendar > tbody:last').empty();

  var days_to_render = [];
  var _d = new Date(curMonth);

  // Utility functions
  var makeKey = function(date) {
    return date.getFullYear()+'-'+(date.getUTCMonth())+'-'+date.getUTCDate();
  }
  var makeDay = function(_date, _class) {
    return {
      date: _date,
      class: _class,
      key: makeKey(_date)
    };
  }
  
  // Add days from last month to beginning of the calendar
  _d.setDate(_d.getDate()-1);
  while (_d.getDay() !== 6) {
    days_to_render.unshift( makeDay(new Date(_d), 'last-month') );
    _d.setDate(_d.getDate()-1);
  }

  // Add this month's days to the calendar
  _d = new Date(curMonth);
  while (_d.getMonth() == curMonth.getMonth()) {
    days_to_render.push( makeDay(new Date(_d), 'this-month') );
    _d.setDate(_d.getDate()+1);
  }

  // Add days from the beginning of next month to the calendar
  while (_d.getDay() !== 0) {
    days_to_render.push( makeDay(new Date(_d), 'next-month') );
    _d.setDate(_d.getDate()+1);
  }

  // Render the table
  var _head = "",
      _body = "";
  
  // Start with the headers
  _head += "<tr><th style='text-align:center' colspan='8'><h1>"
          + MONTHS[curMonth.getMonth()]
          + " "
          + curMonth.getFullYear()
          + "</h1></th></tr>";
  _head += "<tr>";
  HEADINGS.forEach(function(day){
    _head += (
        "<th>" + day + "</th>"
    );
  });
  _head += "<th>Summary</th>"
  _head += "</tr>";

  // Render the body
  for (i in days_to_render){
    console.log(weekday);
    var weekday = i % 7,
        info = days_to_render[i];
    
    if (weekday === 0){
      _body += "<tr>\n";
    }

    _body += "\t<td id='"+info.key+"' class='"+info.class+" day";
    if (info.date.toDateString() === now.toDateString()) {
      _body += " today'";
    }
    else {
      _body += "'";
    }
    _body += ">\n";
    _body += "\t\t<span class='calDate'>"+info.date.getDate()+"</p>\n";
    _body += "\t</td>\n";

    if (weekday === 6){
      _body += "<th class='summary'></th>";
      _body += "</tr>\n";
    }
  }

  // Actually do the rendering
  $('#calendar > thead').append(_head);
  $('#calendar > tbody').append(_body);

  // Make prev/cur/next month buttons work.
  $('#lastMonth').unbind('click').bind('click', function() {
    renderCalendar(prevMonth.getMonth(), prevMonth.getFullYear());
  });
  $('#currentMonth').unbind('click').bind('click', function(){
    renderCalendar(now.getMonth(), now.getFullYear());
  });
  $('#nextMonth').unbind('click').bind('click', function(){
    renderCalendar(nextMonth.getMonth(), nextMonth.getFullYear());
  });

  $.ajax({
    url: '/user/calendar',
    type: 'GET',
    dataType: 'json',
    data: {
      _csrf: $('#_csrf').val()
    },
    success: function(cal, textStatus, jqXHR){
      $('#modals').empty();
      console.log(cal);
      for (key in cal){
        console.log(key);
        makeModal($('#'+key), cal[key], key);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert("Error loading data.");
      console.log(jqXHR);
    }
  });
}
