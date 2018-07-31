//const Command = require('command');
const GRIM_TIMEOUT = 700; // ms // in case you miss your target and there's no S_EACH_SKILL_RESULT, but you wanna recast it real quick lol
const GRIM_STRIKE = 5; // 50300 & 50330
const SHEAR = 3; // 30300 & 30330 // shear can cancel grim before it has done its 2nd hit
const CAT_GRIM = 90005;
const CAT_SHEAR =90003;

module.exports = function NoWastedGrimStrikes(dispatch) {
	//const command = Command(dispatch);
    let hooks = [],
	queue = 0;
	gameId = 0,
    locked = false,
	prevgrim = 0,
	canrecast = false,
	isred = 0,
	haspretty = dispatch.base.protocolMap.name.has('S_SKILL_CATEGORY');
	
	function makenotred()
	{
		if(isred && haspretty)
		{
			dispatch.toClient('S_SKILL_CATEGORY', 3, {category: isred, enabled: true});
			isred = 0;
		}
	}
	
    dispatch.hook('S_LOGIN', 10, ev => {
        gameId = ev.gameId;
		if (ev.templateId % 100 - 1 === 8 && !hooks.length)
		{
			dispatch.hook('S_CREST_MESSAGE', 2, event => {
				if (event.type === 6) // since reaper has no resets other than grim - no need to check which skill was reset
				{
					//command.message('reset <font color="#A52A2A">'+ event.skill +' </font>');
					canrecast = true;
				}
			});

			hook('C_START_SKILL', 6, {order: -200}, event => {
				let skill = Math.floor(event.skill.id / 10000);
				if (locked && (skill === GRIM_STRIKE || skill === SHEAR) && Date.now() - prevgrim < GRIM_TIMEOUT)
				{
					//command.message('<font color="#C0C0C0">' + String(skill)+ ' queued </font>');
					if(skill === GRIM_STRIKE)
					{
						skill = CAT_GRIM;
					}
					else
					{
						skill = CAT_SHEAR;
					}
					if(skill !== isred && haspretty)
					{
						if(queue) // queued another skill while previous one wasn't casted yet - replacing
						{
							makenotred();
						}
						dispatch.toClient('S_SKILL_CATEGORY', 3, {category: skill, enabled: false});
						isred = skill;
					}
					queue = event;
					return false;
				}
				else if(queue)
				{
					queue = 0;
					//command.message('queue<font color="#A52A2A"> cleared </font>');
				}
				if (skill === GRIM_STRIKE) 
				{
					//command.message('<font color="#00FFFF">SS Locked1 </font>' + " prev: " + String(Date.now() - prevgrim));
					locked = true;
					canrecast = false;
					prevgrim = Date.now();
				}
				else if (skill !== SHEAR) // you missed, didn't you?
				{
					makenotred();
				}
			});
			
			hook('S_EACH_SKILL_RESULT', 7, event => {
				if(gameId.equals(event.source))
				{
					/*if(event.damage != 0)
					{
						command.message('<font color="#FBB917"> GRIM_DMG ' + String(event.stage) + ' </font>: '  + String(event.damage));
					}*/
					let skill = Math.floor(event.skill.id / 10000);
					if(event.stage === 0 && (skill === GRIM_STRIKE || skill === SHEAR))
					{
						makenotred();
					}
					else if(event.stage === 1 && skill === GRIM_STRIKE) // when 2nd hit is done
					{
						locked = false;
						//command.message('<font color="#CD0000"> R UNlocked1</font> ' + " passed: " + String(Date.now() - prevgrim));
						if(queue)
						{
							if(Math.floor(queue.skill.id / 10000) === GRIM_STRIKE)
							{
								if(canrecast)
								{
									locked = true;
									prevgrim = Date.now();
								}
							}
							else
							{
								canrecast = true;
							}
							//command.message('can recast: ' + String(canrecast));
							if(canrecast)
							{
								canrecast = false;
								dispatch.toServer('C_START_SKILL', 6, queue);
								queue = 0;
							}
						}
					} // stage 2 happens if you don't cancel animationa after stage 1
				}
			});
		}
		else
		{
			unload();
		}
    })
	
	function unload()
	{
		if(hooks.length) 
		{
			for(let h of hooks) 
			{
				dispatch.unhook(h);
			}
			hooks = [];
		}
	}

	function hook()
	{
		hooks.push(dispatch.hook(...arguments));
	}
}
