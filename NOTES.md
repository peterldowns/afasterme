# How to find races?

http://www.runningintheusa.com/Race/MapShot.aspx?Rank:Date&StartDate:9-3-2012&EndDate:9-26-2012&Special:5K&Page:1

  http://www.runningintheusa.com/Race/MapShot.aspx
  {
    Rank: Date
    StartDate:  Month-Day-Year
    EndDate: Month-Day-Year
    Special: 5k
    Page: 1
  }

# User model

  db.users.id : {
    # Mandatory Info
    Name,
    Age,
    Sex,
    Location : {
      State,
      City,     # allow user to put in state/city or zipcode and generate the others
      Zipcode
    },
    Email,

    # Optional Info
    Height,
    Weight,
    Phone number, # for reminders
    Twitter / FB auth, # for bragging?


    calendar : [
      {
        date,
        plan : {
          VDOT,
          phase,
          day of phase, # ???
          type,
          reason,
          distance,
          time,
          terrain # ???
        },
        feedback : {
          distance,
          time,
          pace : {
            average,
            max,
            min
          },
          difficulty rating,
          temperature,
          heart rate,
          weather,
          user notes,
        },
      }
      ... more of these. each day looks like this ?
    ]
  }

Idea: separate db's for:

* `user_info` : name, age, sex, etc.
* `plans` : what the user should be running
* `feedback` : what the user actually ran and felt
* `auth` : spits back a UUID if the user is logged in correctly

use a UUID from `auth` to find info, plans, feedback. `user_info.id` is the user's ID.
