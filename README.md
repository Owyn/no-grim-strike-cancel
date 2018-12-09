# no_more_wasted_grim-strikes
Stops early cancelling of **grim strike** <img src=https://image.ibb.co/eFn4gU/Grim_Strike1_1.png> from other grims or shears or sundering.

Delays casting of grim strike or shear or sundering before the 2nd hit (with biggest dmg) of previous grimstrike has passed, or till 0.7 sec elapsed in case you fully missed your enemy or you was just hitting air for some reason (don't do that and expect something...)

**visual clarity** - skill hotbar slot becomes red when a skill is delayed untill the 2nd hit of previous grim - that means no need to smash the skill button anymore for the next skillcast to happen, and becomes normal again after 1st hit of delayed skill is done - after that it's possible to cast\delay skills again
(Can be turned off via proxy command `grim.stream`)

**note** - it waits for dmg number of 2nd hit to reach the client, meaning ping would delay it, but it should be compensated with smooth skill delaying method implemented here

**Skill Prediction** - current grim module version is fully compatible with SP and has no issues\errors\whatsoever, it's just that Salty blacklisted this module cuz he thinks it gives too much of an advantage (and maybe because 1st alpha version wasn't compatible with it lol - his excuse)

to bypass his blacklist of modules he personally doesn't like - just rename the modules folder so it won't contain the word **grim**