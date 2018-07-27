# no_more_wasted_grim-strikes
Stops early canceling of **grim strike** from other grim strikes.

Makes it impossible to cast grim strike again or **sheer** before the 2nd hit of grimstrike (with biggest dmg) has passed, or till 1.4sec elapsed in case you fully missed your enemy or was just hitting air for some reason (don't do that), doesn't stop sundering from early cancelling grimstrike though

**warning** - it might not work fully if you use **Skill Prediction**, it's not like there's a way for both these modules to work together fine...

here are some debug calculations images from this module:
(passed - means time passed in ms from the start of the cast of previous grim strike skill)
(unlocked - means time passed in ms after which you can again safely cast grim strike preserving whole potential damage)

<img src=http://u.cubeupload.com/Owyn/newgrim.jpg>

and here is one from original old module:
(last line was the time for when casting became available again - more than twice as long unnecessary)

<img src=http://u.cubeupload.com/Owyn/oldgrim.jpg>