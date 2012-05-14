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

# Database Design

### User model

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

### Summary of Best Practices

* "First class" objects, that are at top level, typically have their own collection.
* Line item detail objects typically are embedded.
* Objects which follow an object modelling "contains" relationship should generally be embedded.
* Many to many relationships are generally done by linking.
* Collections with only a few objects may safely exist as separate collections, as the whole collection is quickly cached in application server memory.
* Embedded objects are a bit harder to link to than "top level" objects in collections.
* It is more difficult to get a system-level view for embedded objects. When needed an operation of this sort is performed by using MongoDB's map/reduce facility.
* If the amount of data to embed is huge (many megabytes), you may reach the limit on size of a single object. See also GridFS.
* If performance is an issue, embed.

### Linking data

http://www.mongodb.org/display/DOCS/Database+References#DatabaseReferences-DBRef

` stu = { name : 'Joe', classes : [ new DBRef('courses', x._id) ] } `
