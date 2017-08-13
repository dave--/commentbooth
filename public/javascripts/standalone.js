(function (){
	var playbackLog = document.createElement('textarea');
	playbackLog.name = 'playbackLog';
	document.body.appendChild(playbackLog);

	var stopPlayback = document.createElement('button');
	stopPlayback.name = 'stopPlayback';
	document.body.appendChild(stopPlayback);

	var startPlayback = document.createElement('button');
	startPlayback.name = 'startPlayback';
	document.body.appendChild(startPlayback);

	socket.on('init', function (data) {
		playbackLog.value = JSON.stringify(data.playback);
		startPlayback.click();
	})
}())