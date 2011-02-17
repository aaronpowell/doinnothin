var stopwatch = (function() {
    var start = 0;
    var end = 0;
	var running = false;
    return {
        start: function() {
			var date = new Date();
			start = date.getTime();
			running = true;
        },
        stop: function() {
			var date = new Date();
			end = date.getTime();
			running = false;
			return end - start;
        },
        milliseconds: function() {
			return end - start;  
        },
        seconds: function() {
			return (end - start) / 1000;  
        },
        reset: function() {
			start = end = 0;  
        },
		running: function() {
			return running;
		},
		stats: function() {
			return {
				started: start,
				ended: end,
				milliseconds: end - start,
				seconds: (end - start) / 1000
			};
		},
		currentSeconds: function() {
			return (Date.now() - start) / 1000;
		},
		currentMilliseconds: function() {
			return (Date.now() - start);
		}
    };
})();
