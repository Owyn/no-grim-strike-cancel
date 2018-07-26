const Command = require('command');
const GRIM_STRIKE = 5; // 50300 & 50330
const GRIM_TIMEOUT = 1400; // ms // in case you miss your target and there's no S_EACH_SKILL_RESULT, but you wanna recast it real fast lol

module.exports = function NoWastedGrimStrikes(dispatch) {
	const command = Command(dispatch);
    let hooks = [],
	gameId = 0,
    locked = false,
	prevgrim = 0;
    
    dispatch.hook('S_LOGIN', 9, event => {
        gameId = event.gameId;
		if (event.templateId % 100 - 1 === 8 && !hooks.length)
		{
			hook('C_START_SKILL', 6, event => {
				if (locked && Math.floor(event.skill.id / 10000) === GRIM_STRIKE && Date.now() - prevgrim < GRIM_TIMEOUT)
				{
					return false;
				}
				if (Math.floor(event.skill.id / 10000) === GRIM_STRIKE) 
				{
					//command.message('<font color="#00FFFF">SS Locked1 </font>' + " prev: " + String(Date.now() - prevgrim));
					locked = true;
					prevgrim = Date.now();
				}
			});
			
			hook('S_EACH_SKILL_RESULT', 7, event => {
				if(gameId.equals(event.source))
				{
					if (Math.floor(event.skill.id / 10000) === GRIM_STRIKE)
					{
						/*if(event.damage != 0)
						{
							command.message('<font color="#FBB917"> GRIM_DMG ' + String(event.stage) + ' </font>: '  + String(event.damage));
						}*/
						if (event.stage === 1) // when 2nd hit is done
						{
							locked = false;
							//command.message("R UNlocked1 " + " passed: " + String(Date.now() - prevgrim));
						} // stage 2 happens if you don't cancel animationa after stage 1
					}
				}
			});
		}
		else
		{
			unload();
		}
    })
	
	function unload() {
		if(hooks.length) {
			for(let h of hooks) dispatch.unhook(h)

			hooks = []
		}
	}

	function hook() {
		hooks.push(dispatch.hook(...arguments))
	}
}
