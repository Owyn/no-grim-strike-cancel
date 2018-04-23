const GRIM_STRIKE = 5;

module.exports = function NoGrimStrikeCancel(dispatch) {
    let gameId = 0,
    job = -1,
    locked = false,
    eventId = 0;
    
    dispatch.hook('S_LOGIN', 9, event => {
        gameId = event.gameId;
        job = event.templateId % 100 - 1;
    })
    
    dispatch.hook('C_START_SKILL', 1, event => {
        if (job === 8) {
            const skill = Math.floor((event.skill - 0x4000000) / 10000);
            if (locked && skill === GRIM_STRIKE) return false;
            if (skill === GRIM_STRIKE) locked = true;
        }
    })
    
    dispatch.hook('S_ACTION_STAGE', 4, event => {
        if(gameId.equals(event.gameId) && job === 8) {
            const skill = Math.floor((event.skill - 0x4000000) / 10000)
            
            if (skill === GRIM_STRIKE ) {
                if (event.stage === 0) {
                    eventId = event.id;
                    locked = true;
                } else {
                    locked = false;
                }
            }
        }
    })
    
    dispatch.hook('S_ACTION_END', 3, event => {
        if(gameId.equals(event.gameId)) {
            if (eventId === event.id) locked = false;
        }
    })
    
    dispatch.hook('C_CANCEL_SKILL', 1, event => {
        if (job === 8) locked = false;
    })
}
