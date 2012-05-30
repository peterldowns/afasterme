#May 13, 2012

###Person / Event / Skill

Today I learned about the existence of LESS, which is a type of CSS
pre-processor. LESS, like all pre-processors, is a tool for writing code more
effectively and efficiently. I learned its syntax and its usage.

###Reason for Importance

LESS is important because it allows me to write, well, _less_ code and still
achieve the same result. I'm working on an entire website all by myself, and I
have something like two and a half weeks to complete it. If I ever want to get
it working well enough to demo (and pass Senior Project), I'll need to be as
efficient as possible and really get work done quickly. LESS allows me to style
the website — make it look pretty and useable — faster than I would be able to
without it. Also, it makes the website much more maintainable in the future,
should I decide to keep working on it.

#May 14, 2012

###Person / Event / Skill

I did a lot of research on "schema" design for the MongoDB NoSQL database.
Because it's NoSQL, I don't have to think as carefully about the design (because
I can change it later), but it's good to have a plan.

###Reason for Importance

Modern web apps *all* depend on databases. They are used to keep track of users'
data, their sessions, and all sorts of metrics. By learning a lot about how to
use the database, I'm learning an invaluable skill that will help me for the
rest of my life, especially as the world becomes more and more dominated by
internet technologies and data mining. It's also important that I understand how
to use this database because it's how I plan on storing data for my website
— every user has a training schedule that needs to be kept track of. 

#May 16, 2012

###Person / Event / Skill

The new skill I learned today was how to create a REST-ful API (Application
Programming Interface). I used the [Parse](https://www.parse.com/docs/rest) API
as a reference and did other research to determine the best way to expose the
workings of my application.

###Reason for Importance

API design is one of the hardest problems in computer science. A well-designed
API allows quick iteration improvement to the program/website's functionality,
while working with a poor API feels like actively fighting your code to get
anything done. I've learned a lot about good API design (Parse's API is often
pointed to as an example of how to design one) and come up with a plan for how
to apply those to my site. This will make future development faster, and any
code that's written easier to maintain. What's more, the design I've come up
with will let me interact with my users' data in many different ways, so I'm not
restricted to just one possible way of creating my website.


#May 17, 2012

###Person / Event / Skill

I figured out how to work with MongoDB from within
[Node.js](http://nodejs.org/), the programming language I'm using to develop
this website (which still doesn't have a name). With this knowledge, I wrote
code describing a general "Database Connection" and its associated functions
(save, find, delete, update).

###Reason for Importance

This is huge. I cannot emphasize that enough. Node.js is an
asynchronously-focused language. That is, you may say to it "Do Task A, and when
that's done do Tasks B and C." While that may sound similar to most programming
languages, Node is different because if you say "Do Task A, then Task B, then
Task C, and print their results" the results could be printed in *any* order.
You must structure your code as a series of "callbacks" — tasks to immediately
after another task has finished. This *is* dramatically different than other
languages that I've used like C or Python, so it's been very difficult to wrap
my head around. That being said, it's an important and popular way of writing
code, so for the sake of advancing my programming knowledge it's a good thing I
now sort of understand it. Also, there's no way I could write this website
without talking to the database, so it's really important (and awesome) that I
have this working now.

#May 18, 2012

###Person / Event / Skill

I figured out how to mirror my development environment locally and on a remote
server. Any changes I make locally will be reflected remotely, and I can test in
either setting.

###Reason for Importance

No one runs a website from their laptop. That would be ridiculous. What people
do is host their code on remote servers. I'm using a service called
[Dotcloud](https://www.dotcloud.com/) to do this. For testing purposes, it's
important that the website works the same way both locally and on the server.
Until today, that wasn't true for me, but I've figured out how to get the
database working the same in both places. This is important because now I can
quickly work on and improve my code without fiddling around and trying to make
it work the same everywhere — it just will. I may stand a chance of actually
getting this site working by the end of Senior Project.

#May 19, 2012

###Person / Event / Skill

I learned how to do client-side form validation with JQuery and the JQuery
Validate plugin.

###Reason for Importance

When users are signing up for a website, any sort of 'friction' in the process
will make them decide to not sign up after all. Cryptic errors, ugly forms, or
bad questions will make them frustrated with the website — all before they've
even signed up. A website's login form should be as simple and explanatory as
possible, and give good feedback to the user if they enter a wrong value or
something that should be changed slightly. My newfound skills with client-side
validation allow me to show at exactly what spot the user messed up, and
describe how they should fix it. A big part of my senior project is "will users
actually use this website" — yes, but only if they aren't immediately pissed off
by the signup form. 

#May 21, 2012

###Person / Event / Skill

I talked at length with Jack Huemmler, the fastest Junior-year miler in
Pennsylvania, about what he would want from a running website. 

###Reason for Importance

Jack Huemmler is my target audience: a runner who's dissatisfied with current
tools for logging his training. I could create this website entirely for me, but
if it is to ever take off with other people, it has to be built for a larger
audience. Huemmler is one of the people I would love to have using my site, and
he and I talked about what he wants and doesn't want in logging software. It's
important that I listen to his advice if I want him to use it. Also, he's good
publicity for my site — he travels all over Pennsylvania, and (if he likes my
site) would be willing to recommend it to others. 


#May 22, 2012

###Person / Event / Skill

I talked with Mr. Klick today, and he taught me about the science behind coming
up with different running schedules. We came up with three training plans of
different lengths: 16 weeks, 20 weeks, and 24 weeks.

###Reason for Importance

More than just being my advisor, Mr. Klick is an extremely high-class runner. We
talked about what he and his running buddies were looking for in a website (as I
did yesterday with Jack Huemmler). We also talked a lot about the science that
will go into the website. The three training plans that we came up with are the
heart of the site — they are what differentiates this site (unnamed) from
[Athleticore](http://athleticore.com/) and other similar sites. The training
plans are all designed to get a runner as fit as possible while still keeping
safe. These are what will draw users to the site, so it's important that they
exist.

#May 23, 2012

###Person / Event / Skill

I learned how to write HTML with Jade, a syntax that compiles to HTML. It's the
default templating language in Express.JS, the web framework I'm using.

### Reason for Importance

Jade makes things simpler. The syntax makes it easier to write HTML faster and
in a cleaner way, so that everything is more maintainable and I can get more done
in the same amount of time. The other (huge) benefit to Jade is that I can now
include user data in a web page's HTML. This is the core functionality  of the
site — showing each user what training schedule to follow, which workout to do,
and how well they're doing. 

#May 24, 2012

###Person / Event / Skill

Had a great talk with Max Norris and Jack Curtis, two top runners who were
willing to give me feedback on the website dashboard and ideas for what to
include in the webapp (along hte lines of what I talked to Jack Huemmler about).

###Reason for Importance

Marketing rule #1: know thine audience. Ok, that's not really a rule, but it is
super important to know who you're marketing your product towards. These two
guys are my teammates, and I know they've used competing websites like
Athleticore. They walked me through exactly how they used Athleticore, and what
about it they liked and didn't like. Using this information, I can now target my
application to improve upon the things they like and drop/delete/ignore the
functionality they don't. For instance, I learned that they both like to see a
calendar view of their month and their training schedule, but that the same
thing in list form is uninteresting / unimportant to them.


