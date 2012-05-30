/*
 * Takes minutes and seconds and returns minutes as a float.
 * Args:
 *    minutes = a Number
 *    seconds = a Number
 * Returns:
 *    a Number of minutes
 * Example:
 *    > m(5, 30)
 *    5.5
 */
var m = exports.m = function(min, sec) {
  return min + sec/60.0;
}

var mtm = exports.mtm = function(meters){
  return meters*0.000621371192;
}

/*
 * Turns a date object into a key for use with a user's calendar dict.
 * Args:
 *    date = a Date object.
 * Returns:
 *    a string to be used as a key, of the form "YEAR-MONTH-DAY"
 * Example: 
 */
var makeKey = exports.makeKey = function(date) {
  return date.getFullYear()+'-'+(date.getUTCMonth()+1)+'-'+date.getUTCDate();
}

/*
 * Given a start day, return a list of numDays starting with that
 * day and extending into the future.
 * Args:
 *    startDate = a Date object
 *    numDays = an integer
 * Returns:
 *    a list of Date objects, starting with startDate
 * Example:
 */
var makeDateRange = exports.makeDateRange = function(startDate, numDays) {
  var daterange = [startDate];
  for(i=0;daterange.length < numDays;i++) {
    var d = new Date();
    d.setDate(d.getDate()+i);
    daterange.push(d);
  }
  return daterange;
}

/*
 * Given a distance and a time, calculate an equivalent VDOT
 * (V O2 Max) measurement to the nearest integer. Based on Tom
 * Fangrow's VDOT calculator:
 *    http://www.tomfangrow.com/jsvdot.html
 * Args:
 *    mile = a Number of mile
 *    minutes = a Number of minutes
 *    seconds = a Number of seconds
 * Returns:
 *    an integer VDOT level
 * Example:
 */
var VDOT = exports.VDOT = function(mile, milepace) {
  var d = (mile*1.609344)*1000, // Distance (meters)
      t = milepace, // Time (minutes)
      c = -4.6 + .182258*(d/t) + .000104*(d*d)/(t*t), // Oxygen cost c(t)
      i = .8 + .1894393*Math.exp(-.012778*t) +
          .2989558*Math.exp(-.1932605*t), // V02 Max i(t)
      vdot = Math.round(1000*(c/i))/1000;
  return Math.round(vdot);
}

/*
 * Returns the correct pace based on VDOT and type of run.
 * From Daniels 2nd Edition, Table 3.2 (pgs. 52-55)
 * Args:
 *    vdot      = integer from 30 through 85
 *    type      = one of ['E', 'MP', 'T', 'I', 'R']
 *    distance  = one of ['km', 'mile', 200, 400, 800, 1000, 1200]
 * Returns:
 *    pace in minutes per _distance_, as a float
 * Example:
 *    > intensity(30, 'E', 'mile')
 *    12.666666666
 */
var getPace = exports.getPace = function(vdot, type, distance) {
  var key = {
    E : {
      km : 0,
      mile: 1
    },
    L : {
      km: 0,
      mile: 1
    },
    MP: {
      mile: 2
    },
    T: {
      400: 3,
      800: 4,
      1000: 5,
      mile: 7
    },
    I: {
      400: 8,
      1000: 9,
      1200: 11,
      mile: 12
    },
    R: {
      200: 13,
      400: 14,
      800: 15
    }
  };
  var paces = {
    30:[m(7,52),m(12,40),m(11,01),m(02,33),m(05,07),m(06,24),m(10,00),m(10,18),m(02,22),null,null,null,null,m(0,67),m(2,16),null,null],
    31:[m(7,41),m(12,22),m(10,45),m(02,30),m(04,59),m(06,14),m(06,49),m(10,02),m(02,18),null,null,null,null,m(0,65),m(2,12),null,null],
    32:[m(7,30),m(12,04),m(10,29),m(02,26),m(04,52),m(06,05),m(06,39),m(09,47),m(02,14),null,null,null,null,m(0,63),m(2,08),null,null],
    33:[m(7,20),m(11,48),m(10,14),m(02,23),m(04,45),m(05,56),m(06,30),m(09,33),m(02,11),null,null,null,null,m(0,62),m(2,05),null,null],
    34:[m(7,10),m(11,32),m(10,00),m(02,19),m(04,38),m(05,48),m(06,21),m(09,20),m(02,08),null,null,null,null,m(0,60),m(2,02),null,null],
    35:[m(7,01),m(11,17),m(9,46),m(02,16),m(04,32),m(05,40),m(06,12),m(09,07),m(02,05),null,null,null,null,m(0,59),m(1,59),null,null],
    36:[m(6,52),m(11,02),m(9,33),m(02,13),m(04,26),m(05,33),m(06,04),m(08,55),m(02,02),null,null,null,null,m(0,57),m(1,55),null,null],
    37:[m(6,43),m(10,49),m(9,20),m(02,10),m(04,20),m(05,25),m(05,56),m(08,44),m(01,59),m(05,00),null,null,null,m(0,56),m(1,53),null,null],
    38:[m(6,35),m(10,35),m(9,08),m(02,07),m(04,15),m(05,19),m(05,49),m(08,33),m(01,56),m(04,54),null,null,null,m(0,54),m(1,50),null,null],
    39:[m(6,27),m(10,23),m(8,57),m(02,05),m(04,10),m(05,12),m(05,41),m(08,22),m(01,54),m(04,48),null,null,null,m(0,53),m(1,48),null,null],
    40:[m(6,19),m(10,11),m(8,46),m(02,02),m(04,05),m(05,06),m(05,35),m(08,12),m(01,52),m(04,42),null,null,null,m(0,52),m(1,46),null,null],
    41:[m(6,12),m(9,59),m(8,35),m(02,00),m(04,00),m(05,00),m(05,28),m(08,02),m(01,50),m(04,36),m(05,00),null,null,m(0,51),m(1,44),null,null],
    42:[m(6,05),m(9,48),m(8,25),m(01,57),m(03,55),m(04,54),m(05,22),m(07,52),m(01,48),m(04,31),m(04,55),null,null,m(0,50),m(1,42),null,null],
    43:[m(5,58),m(9,37),m(8,15),m(01,55),m(03,51),m(04,49),m(05,16),m(07,42),m(01,46),m(04,26),m(04,50),null,null,m(0,49),m(1,40),null,null],
    44:[m(5,52),m(9,27),m(8,06),m(01,53),m(03,46),m(04,43),m(05,09),m(07,33),m(01,44),m(04,21),m(04,45),null,null,m(0,48),m(0,98),null,null],
    45:[m(5,46),m(9,17),m(7,57),m(01,51),m(03,42),m(04,38),m(05,04),m(07,25),m(01,42),m(04,16),m(04,40),null,null,m(0,47),m(0,96),null,null],
    46:[m(5,40),m(9,07),m(7,48),m(01,49),m(03,38),m(04,33),m(04,58),m(07,17),m(01,40),m(04,12),m(04,35),m(05,00),null,m(0,46),m(0,94),null,null],
    47:[m(5,34),m(8,58),m(7,40),m(01,47),m(03,35),m(04,29),m(04,54),m(07,10),m(01,38),m(04,07),m(04,29),m(04,54),null,m(0,45),m(0,92),null,null],
    48:[m(5,28),m(8,49),m(7,32),m(01,45),m(03,31),m(04,24),m(04,48),m(07,02),m(01,36),m(04,03),m(04,25),m(04,49),null,m(0,44),m(0,90),null,null],
    49:[m(5,23),m(8,40),m(7,24),m(01,43),m(03,28),m(04,20),m(04,44),m(06,55),m(01,35),m(03,59),m(04,21),m(04,45),null,m(0,44),m(0,89),null,null],
    50:[m(5,18),m(8,32),m(7,17),m(01,42),m(03,24),m(04,15),m(04,39),m(06,51),m(01,33),m(03,55),m(04,17),m(04,41),null,m(0,43),m(0,87),null,null],
    51:[m(5,13),m(8,24),m(7,09),m(01,40),m(03,21),m(04,11),m(04,35),m(06,44),m(01,32),m(03,51),m(04,12),m(04,36),null,m(0,42),m(0,86),null,null],
    52:[m(5,08),m(8,16),m(7,02),m(01,38),m(03,17),m(04,07),m(04,30),m(06,38),m(01,31),m(03,48),m(04,09),m(04,33),null,m(0,42),m(0,85),null,null],
    53:[m(5,04),m(8,09),m(6,56),m(01,37),m(03,15),m(04,04),m(04,27),m(06,32),m(01,30),m(03,44),m(04,05),m(04,29),null,m(0,41),m(0,84),null,null],
    54:[m(4,59),m(8,01),m(6,49),m(01,35),m(03,12),m(04,00),m(04,23),m(06,26),m(01,28),m(03,41),m(04,02),m(04,25),null,m(0,40),m(0,82),null,null],
    55:[m(4,55),m(7,54),m(6,43),m(01,34),m(03,09),m(03,56),m(04,18),m(06,20),m(01,27),m(03,37),m(03,58),m(04,21),null,m(0,40),m(0,81),null,null],
    56:[m(4,50),m(7,48),m(6,37),m(01,33),m(03,06),m(03,53),m(04,15),m(06,15),m(01,26),m(03,34),m(03,55),m(04,18),null,m(0,39),m(0,80),null,null],
    57:[m(4,46),m(7,41),m(6,31),m(01,31),m(03,04),m(03,50),m(04,12),m(06,09),m(01,25),m(03,31),m(03,52),m(04,15),null,m(0,39),m(0,79),null,null],
    58:[m(4,42),m(7,34),m(6,25),m(01,30),m(03,00),m(03,45),m(04,07),m(06,04),m(01,23),m(03,28),m(03,48),m(04,10),null,m(0,38),m(0,77),null,null],
    59:[m(4,38),m(7,28),m(6,19),m(01,29),m(02,58),m(03,43),m(04,04),m(05,59),m(01,22),m(03,25),m(03,45),m(04,07),null,m(0,37),m(0,76),null,null],
    60:[m(4,35),m(7,22),m(6,14),m(01,28),m(02,56),m(03,40),m(04,01),m(05,54),m(01,21),m(03,23),m(03,42),m(04,03),null,m(0,37),m(0,75),m(2,30),null],
    61:[m(4,31),m(7,16),m(6,09),m(01,26),m(02,53),m(03,37),m(03,58),m(05,50),m(01,20),m(03,20),m(03,39),m(04,00),null,m(0,36),m(0,74),m(2,28),null],
    62:[m(4,27),m(7,11),m(6,04),m(01,25),m(02,51),m(03,34),m(03,54),m(05,45),m(01,19),m(03,17),m(03,36),m(03,57),null,m(0,36),m(0,73),m(2,26),null],
    63:[m(4,24),m(7,05),m(5,59),m(01,24),m(02,49),m(03,32),m(03,52),m(05,41),m(01,18),m(03,15),m(03,33),m(03,54),null,m(0,35),m(0,72),m(2,24),null],
    64:[m(4,21),m(7,00),m(5,54),m(01,23),m(02,47),m(03,29),m(03,49),m(05,36),m(01,17),m(03,12),m(03,30),m(03,51),null,m(0,35),m(0,71),m(2,22),null],
    65:[m(4,18),m(6,54),m(5,49),m(01,22),m(02,45),m(03,26),m(03,46),m(05,32),m(01,16),m(03,10),m(03,28),m(03,48),null,m(0,34),m(0,70),m(2,20),null],
    66:[m(4,14),m(6,49),m(5,45),m(01,21),m(02,43),m(03,24),m(03,43),m(05,28),m(01,15),m(03,08),m(03,25),m(03,45),m(5,00),m(0,34),m(0,69),m(2,18),null],
    67:[m(4,11),m(6,44),m(5,40),m(01,20),m(02,41),m(03,21),m(03,40),m(05,24),m(01,14),m(03,05),m(03,22),m(03,42),m(4,57),m(0,33),m(0,68),m(2,16),null],
    68:[m(4,08),m(6,39),m(5,36),m(01,19),m(02,39),m(03,19),m(03,38),m(05,20),m(01,13),m(03,03),m(03,20),m(03,39),m(4,53),m(0,33),m(0,67),m(2,14),null],
    69:[m(4,05),m(6,35),m(5,32),m(01,18),m(02,37),m(03,16),m(03,35),m(05,16),m(01,12),m(03,01),m(03,18),m(03,36),m(4,50),m(0,32),m(0,66),m(2,12),null],
    70:[m(4,02),m(6,30),m(5,28),m(01,17),m(02,35),m(03,14),m(03,32),m(05,13),m(01,11),m(02,59),m(03,16),m(03,34),m(4,46),m(0,32),m(0,65),m(2,10),null],
    71:[m(4,00),m(6,26),m(5,24),m(01,16),m(02,33),m(03,12),m(03,30),m(05,09),m(01,10),m(02,57),m(03,13),m(03,31),m(4,43),m(0,31),m(0,64),m(2,08),null],
    72:[m(3,57),m(6,21),m(5,20),m(01,16),m(02,32),m(03,10),m(03,28),m(05,05),m(01,09),m(02,55),m(03,11),m(03,29),m(4,40),m(0,31),m(0,63),m(2,06),null],
    73:[m(3,54),m(6,17),m(5,16),m(01,15),m(02,30),m(03,08),m(03,26),m(05,02),m(01,09),m(02,53),m(03,09),m(03,27),m(4,37),m(0,31),m(0,62),m(2,05),null],
    74:[m(3,52),m(6,13),m(5,12),m(01,14),m(02,29),m(03,06),m(03,23),m(04,59),m(01,08),m(02,51),m(03,07),m(03,25),m(4,34),m(0,30),m(0,62),m(2,04),null],
    75:[m(3,49),m(6,09),m(5,09),m(01,14),m(02,27),m(03,04),m(03,21),m(04,56),m(01,07),m(02,49),m(03,05),m(03,22),m(4,31),m(0,30),m(0,61),m(2,03),null],
    76:[m(3,47),m(6,05),m(5,05),m(01,13),m(02,26),m(03,02),m(03,19),m(04,52),m(01,06),m(02,48),m(03,03),m(03,20),m(4,28),m(0,29),m(0,60),m(2,02),null],
    77:[m(3,44),m(6,01),m(5,01),m(01,12),m(02,24),m(03,00),m(03,17),m(04,49),m(01,05),m(02,46),m(03,01),m(03,18),m(4,25),m(0,29),m(0,59),m(2,00),null],
    78:[m(3,42),m(5,57),m(4,58),m(01,11),m(02,22),m(02,58),m(03,15),m(04,46),m(01,05),m(02,44),m(02,59),m(03,16),m(4,23),m(0,29),m(0,59),m(1,59),null],
    79:[m(3,40),m(5,54),m(4,55),m(01,10),m(02,21),m(02,56),m(03,13),m(04,43),m(01,04),m(02,42),m(02,57),m(03,14),m(4,20),m(0,28),m(0,58),m(1,58),null],
    80:[m(3,38),m(5,50),m(4,52),m(01,10),m(02,19),m(02,54),m(03,11),m(04,41),m(01,04),m(02,41),m(02,56),m(03,12),m(4,17),m(0,28),m(0,58),m(1,56),null],
    81:[m(3,35),m(5,46),m(4,49),m(01,09),m(02,18),m(02,53),m(03,09),m(04,38),m(01,03),m(02,39),m(02,54),m(03,10),m(4,15),m(0,28),m(0,57),m(1,55),null],
    82:[m(3,33),m(5,43),m(4,46),m(01,08),m(02,17),m(02,51),m(03,07),m(04,35),m(01,02),m(02,38),m(02,52),m(03,08),m(4,12),m(0,27),m(0,56),m(1,54),null],
    83:[m(3,31),m(5,40),m(4,43),m(01,08),m(02,15),m(02,49),m(03,05),m(04,32),m(01,02),m(02,36),m(02,51),m(03,07),m(4,10),m(0,27),m(0,56),m(1,53),null],
    84:[m(3,29),m(5,36),m(4,40),m(01,07),m(02,14),m(02,48),m(03,04),m(04,30),m(01,01),m(02,35),m(02,49),m(03,05),m(4,08),m(0,27),m(0,55),m(1,52),null],
    85:[m(3,27),m(5,33),m(4,37),m(01,06),m(02,13),m(02,46),m(03,02),m(04,27),m(01,01),m(02,33),m(02,47),m(03,03),m(4,05),m(0,27),m(0,55),m(1,51),null]
      }
  //console.log("Type:", type);
  //console.log("Distance:", distance);
  //console.log("Key[%s]: %s", type, key[type]);
  //console.log("Key[%s][%s]: %s", type, distance, key[type][distance]);
  //console.log("paces[%d]:", vdot, paces[vdot]);
  return paces[vdot][key[type][distance]];
}

/*
 * Create a new running calendar.
 */
var makeSchedule = exports.makeSchedule = function(type, miletime, experience, startDate) {
  var start;
  if (startDate) {
    start = startDate;
  }
  else {
    start = new Date();
    while (start.getDay() != 0) { // Start on a Sunday
      start.setDate(start.getDate()+1);
    }
  }
  var cal = {}
  switch (type) {
    case 16:
      return week16Schedule(miletime, experience, start);
      break;
    case 20:
      return week20Schedule(miletime, experience, start);
      break;
    case 24:
      return week24Schedule(miletime, experience, start);
      break;
    default: 
      console.log("Could not create a %d-week schedule", type);
      return {};
  }
}

var descriptions = exports.descriptions = {
  O: "Woo! A Day Off!",
  E: "\
    The easiest run you'll ever take.",
  MP: "\
    Not to hard, not too soft.",
  T:"\
    Pretty difficult. Getting there, anyway.",
  I:"\
    Yeah, this is quite difficult indeed.",
  R:"\
    Mm, throw a bit of chicken in that pot and you've got a stew..\
    I mean a RACE going!",
  repeats:"\
    These pretty much blow."
}


var week24Schedule = exports.week24Schedule = function(miletime, experience, start) {
  var cal = {},
      dates = makeDateRange(start, 16*7),
      mileage_initial = 20,
      VDOT_initial = VDOT(1, miletime);

  for (daynum in dates) {
    var date = dates[daynum],
        week = Math.floor(daynum / 7) + 1,
        weekday = date.getDay(), // 0 (Sun) -> 6 (Sat)
        key = makeKey(date),
        vdot = VDOT_initial + 1*Math.floor(week/6), // increase VDOT every 6 weeks
        type,
        pace,
        time,
        distance,
        _day = {
          date: date,
          week: week,
          weekday: weekday,
          log: {
            distance: {
              value: null,
              unit: null
            },
            time: null,
            pace: null,
            comments: null,
            intensity: null,
            feeling: null
          }
        };
    
    // Phase
    if (week <= 6) {
      _day['phase'] = 1;
    }
    else if (week <= 12) {
      _day['phase'] = 2;
    }
    else if (week <= 18) {
      _day['phase'] = 3;
    }
    else if (week <= 24) {
      _day['phase'] = 4;
    }
    else {
      _day['phase'] = 0;
    }
    
    // Plans
    if (week <= 6) {
      switch (weekday) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          type = {
            key: 'E',
            name: 'easy',
            info: descriptions['E']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(30, 0);
          distance = {
            val: Math.round(10* (time/pace) )/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 6:
          if (week <= 3) {
            type = {
              key: 'O',
              name: 'day off',
              info: descriptions['O']
            };
            pace = 0.0;
            time = m(0, 0);
            distance = {
              val: 0,
              unit: 'mile',
              accuracy: 'exact'
            };
          }
          else {
            type = {
              key: 'L',
              name: 'long',
              info: descriptions['L']
            };
            pace = getPace(vdot, type.key, 'mile');
            time = m(85, 0);
            distance = {
              val: Math.round(10* (time/pace) )/10,
              unit: 'mile',
              accuracy: 'about'
            };
          }
          break;
      }
    }
    else if (week == 7) {
      switch (weekday) {
        case 0:   // Long Run
          type = {
            key: 'L',
            name: 'long',
            info: descriptions['L']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(85, 0);
          distance = {
            val: Math.round(10*(time/pace))/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 1:
        case 4:
        case 5:   // Easy
          type = {
            key: 'E',
            name: 'easy',
            info: descriptions['E']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(30, 0);
          distance = {
            val: Math.round(10* (time/pace) )/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 2:   // Q1
          type = {
            workout: true,
            key: 'R',
            name: 'repeats',
            info: "<p>5 to 6 x (2x200m R pace with 200m recovery jogs + 1x400m R pace with 400m jog).</p><br>"+descriptions['R']
          };
          pace = {
            200: getPace(vdot, type.key, 200),
            400: getPace(vdot, type.key, 400),
            800: getPace(vdot, type.key, 800),
          };
          distance = {
            val: mtm(9600),
            unit: 'mile',
            accuracy: 'exact'
          };
          time = null;
          break;
        case 3:   // Q2
          type = {
            workout: true,
            key: 'T',
            name: 'threshold',
            info: "<p>5 to 6 x (1 mile at T pace with 1-min rests)</p><br>"+descriptions['T']
          };
          pace = {
            mile: getPace(vdot, type.key, 'mile')
          };
          distance = {
            val: 6,
            unit: 'mile',
            accuracy: 'about'
          };
          time = null;
          break;
        case 6:   // Q3
          type = {
            workout: true,
            key: 'I',
            name: 'Interval',
            info: "<p>Sets of (2min hard [I] pace, 1-min jog + 1 min hard [I] pace, \
              30-sec jog + 30 sec hard [I] pace, 30-sec jog). The sum of I pace should be 8% \
              of the week's total mileage or 10K, whichever is less. Hard [I] pace means to run \
              at I pace or to run equally hard if not a measured distance.</p>"
          };
          pace = {
            mile: getPace(vdot, type.key, 'mile')
          };
          distance = {
            val: mtm(10000),
            unit: 'mile',
            accuracy: 'about'
          };
          time = null;
          break;
        default:
          break;
      }
    }
    else if (week == 8) {
      switch (weekday) {
        case 0:   // Long Run
          type = {
            key: 'L',
            name: 'long',
            info: descriptions['L']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(85, 0);
          distance = {
            val: Math.round(10*(time/pace))/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 1:
        case 4:
        case 5:   // Easy
          type = {
            key: 'E',
            name: 'easy',
            info: descriptions['E']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(30, 0);
          distance = {
            val: Math.round(10* (time/pace) )/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 2:   // Q1
          type = {
            workout: true,
            key: 'R',
            name: 'repeats',
            info: "<p>10 to 12 x (400m R pace with 400m jogs). The sum of R pace should total no more than 5% of the week's mileage.</p>"+descriptions['R']
          };
          pace = {
            400: getPace(vdot, type.key, 400)
          };
          distance = {
            val: mtm(9600),
            unit: 'mile',
            accuracy: 'exact'
          };
          time = null;
          break;
        case 3:   // Q2
          type = {
            workout: true,
            key: 'T',
            name: 'threshold',
            info: "<p> 5 to 6 x (1 mile T pace with 10min rests).</p>"+descriptions['T']
          };
          pace = {
            mile: getPace(vdot, type.key, 'mile')
          };
          distance = {
            val: 6,
            unit: 'mile',
            accuracy: 'about'
          };
          time = null;
          break;
        case 6:   // Q3 or Race
          type = {
            key: 'O',
            name: 'day off',
            info: descriptions['O']
          };
          pace = 0.0;
          time = m(0, 0);
          distance = {
            val: 0,
            unit: 'mile',
            accuracy: 'exact'
          };
          break;
        default:
          break;
      }
    }
    else if (week == 9) {
      switch (weekday) {
        case 0:   // Long Run
          type = {
            key: 'L',
            name: 'long',
            info: descriptions['L']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(85, 0);
          distance = {
            val: Math.round(10*(time/pace))/10,
            unit: 'mile',
            accuracy: 'about'
          };
          break;
        case 1:
        case 4:
        case 5:   // Easy
          type = {
            key: 'E',
            name: 'easy',
            info: descriptions['E']
          };
          pace = getPace(vdot, type.key, 'mile');
          time = m(30, 0);
          distance = {
            val: Math.round(10* (time/pace) )/10,
            unit: 'mile',
            accuracy: 'about',
          };
          break;
 
        case 0:
        case 1:
        case 4:
        case 5:   // Easy
          break;
        case 2:   // Q1
          type = {
            workout: true,
            key: 'R',
            name: 'repeats',
            info:"<p>4 x (200m R pace with 200m jogs) + 2 x (400m R pace with 400m jogs) + 1 x (800m R pace with 800m jog) + 2 x (400m R pace with 400m jog) + 4 x (200m R pace with 200m jogs)</p>"+descriptions['R']
          };
          pace = {
            200: getPace(vdot, type.key, 200),
            400: getPace(vdot, type.key, 400),
            800: getPace(vdot, type.key, 800)
          };
          distance = {
            val: mtm(8000),
            unit: 'mile',
            accuracy: 'about'
          };
          time = null;
          break;
        case 3:   // Q2
          type = {
            workout: true,
            key: 'T',
            name: 'threshold',
            info: "<p>3 x (2-mile or 10 to 12 min at T pace with 2-min rests)</p>"+descriptions['T']
          };
          pace = {
            mile: getPace(vdot, type.key, 'mile'),
          };
          distance = {
            val: 6,
            unit: 'mile',
            accuracy: 'about'
          };
          time = null;
          break;
        case 6:   // Q3 or Race
          type = {
            workout: true,
            key: 'I',
            name: 'intervals',
            info: "<p>5 to 6 x (3-min hard or 800, 1,000, or 1,200m I pace with 3-min recovery jogs) Stay under 8% of the week's total mileage at I pace.</p>"+descriptions['I']
          };
          pace = {
            800: getPace(vdot, type.key, 800),
            1000: getPace(vdot, type.key, 1000),
            1200: getPace(vdot, type.key, 1200)
          };
          distance = {
            val: mtm(7200),
            unit: 'mile'
          };
          time = null;
          break;
        default:
          break;
      }
    }
    else {
      type = {
        key: 'E',
        name: 'easy',
        info: descriptions['E']
      };
      pace = getPace(vdot, type.key, 'mile');
      time = m(30, 0);
      distance = {
        val: Math.round(10* (time/pace) )/10,
        unit: 'mile',
        accuracy: 'about'
      };
    }
    _day['plan'] = {
      vdot: vdot, // increase VDOT by 1 every 5th week
      type: type,
      pace: pace,
      time: time,
      distance: distance,
    };
    cal[key] = _day;
  }
  return cal;
}
