doinnothin = (function(sw) {

	var times = [];
	
	var btn = document.getElementById('go');
	btn.onclick = function(e) {
		e.preventDefault();
		if(sw.running()) {
			console.log('stopping');
			sw.stop();
			times.push(sw.stats());
		} else {
			console.log('starting');
			sw.reset();
			sw.start();
		}
	};
	
	return {
		times: times,
		totalSeconds: function() {
			return times.reduce(function(x, y) {
				return (x.seconds || x) + y.seconds;
			});
		},
		totalMilliseconds: function() {
			return times.reduce(function(x, y) {
				return (x.milliseconds || x) + y.milliseconds;
			});
		},
		totalMinutes: function() {
			return times.reduce(function(x, y) {
				return (x.seconds || x) + y.seconds;
			}) / 60;
		}
	};

})(stopwatch);