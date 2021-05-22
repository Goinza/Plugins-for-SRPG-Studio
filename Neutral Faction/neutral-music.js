//Plugin by Goinza

(function() {

    BaseTurnLogoFlowEntry._changeMusic = function() {
		var handle;
		var handleActive = root.getMediaManager().getActiveMusicHandle();
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var turnType = root.getCurrentSession().getTurnType();

		if (turnType === TurnType.PLAYER) {
			handle = mapInfo.getPlayerTurnMusicHandle();
		}
		else if (turnType === TurnType.ALLY) {
			handle = mapInfo.getAllyTurnMusicHandle();
		}
		else if (turnType === TurnType.ENEMY) {
			handle = mapInfo.getEnemyTurnMusicHandle();
		}
        else if (turnType === TurnType.NEUTRAL) {
            handle = NeutralControl.getNeutralMusicHandle(mapInfo);
        }
		
		// Play only if it's music which differs from the current music.
		if (!handle.isEqualHandle(handleActive)) {
			MediaControl.resetMusicList();
			MediaControl.musicPlayNew(handle);
		}
    }

})()