# no_more_wasted_grim-strikes
Stops early canceling of grim strike from other grim strikes.

Makes it impossible to cast grim strike again before the 2nd hit (with biggest dmg) of previous one is made

**warning** - it might not work fully if you use **Skill Prediction**, it's not like there's a way for both these modules to work together fine...

here are some debug calculations images from this module:
(passed - means time passed in ms from the start of the cast of previous grim strike skill)
(unlocked - means time passed in ms after which you can again safely cast grim strike preserving whole potential damage)

<img src=http://u.cubeupload.com/Owyn/newgrim.jpg>

and here is one from original old module:
(last line was the time for when casting became available again - more than twice as long unnecessary)

<img src=http://u.cubeupload.com/Owyn/oldgrim.jpg>