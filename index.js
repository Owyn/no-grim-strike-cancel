//const Command = require('command');
const GRIM_STRIKE = 5; // 50300 & 50330
const GRIM_TIMEOUT = 1400; // ms // in case you miss your target and there's no S_EACH_SKILL_RESULT, but you wanna recast it real fast lol
const SHEER = 3; // 30300 // sheer can cancel grim before it has done 2nd hit
const CAT_GRIM = 90005;
const CAT_SHEER =90003;

module.exports = function NoWastedGrimStrikes(dispatch) {
	//const command = Command(dispatch);
    let hooks = [],
	queue = 0;
	gameId = 0,
    locked = false,
	prevgrim = 0;
	
	function handleredcleanup(skill)
	{
		let qskill = Math.floor(queue.skill.id / 10000);
		if(queue.skill == GRIM_STRIKE)
		{
			qskill = CAT_GRIM;
		}
		else
		{
			qskill = CAT_SHEER;
		}
		if(qskill != skill)
		{
			//dispatch.toClient('S_SKILL_CATEGORY', 3, {category: qskill, enabled: true});
		}
	}
	
    dispatch.hook('S_LOGIN', 10, ev => {
        gameId = ev.gameId;
		if (ev.templateId % 100 - 1 === 8 && !hooks.length)
		{
			hook('C_START_SKILL', 6, {order: -20, filter: {fake: null}}, event => {
				let skill = Math.floor(event.skill.id / 10000);
				if (locked && (skill === GRIM_STRIKE || skill === SHEER) && Date.now() - prevgrim < GRIM_TIMEOUT)
				{
					if(queue)
					{
						handleredcleanup(skill);
					}
					queue = event;
					//command.message('<font color="#C0C0C0">' + String(skill)+ ' queued </font>');
					if(skill == GRIM_STRIKE)
					{
						skill = CAT_GRIM;
					}
					else
					{
						skill = CAT_SHEER;
					}
					//dispatch.toClient('S_SKILL_CATEGORY', 3, {category: skill, enabled: false});
					return false;
				}
				else if(queue)
				{
					handleredcleanup(0);
					queue = 0;
					//command.message('queue<font color="#A52A2A"> cleared </font>');
				}
				if (skill === GRIM_STRIKE) 
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
							//command.message('<font color="#CD0000"> R UNlocked1</font> ' + " passed: " + String(Date.now() - prevgrim));
							if(queue)
							{
								let skill = Math.floor(queue.skill.id / 10000);
								//dispatch.toServer('C_START_SKILL', 6, queue);
								if(skill == GRIM_STRIKE)
								{
									skill = CAT_GRIM;
								}
								else
								{
									skill = CAT_SHEER;
								}
								//dispatch.toClient('S_SKILL_CATEGORY', 3, {category: skill, enabled: true});
							}
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
