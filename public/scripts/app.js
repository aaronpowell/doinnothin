doinnothin = (function(sw, $) {

	var times = [];
	
	var btn = $('#go').click(function(e) {
		e.preventDefault();
		if(sw.running()) {
			sw.stop();
			var stats = sw.stats();
			times.push(stats);
			btn.attr('value', 'I\'m doin\' nothin\'');
			$('#time').text('');
			eventManager.trigger('timer-stopped', e, {stats: stats});
		} else {
			sw.reset();
			sw.start();
			btn.attr('value', 'I\'m doin\' somethin\'');
			updateCounter();
			
			eventManager.trigger('timer-started', e, {});
		}
	});
	
	function updateCounter() {
		if(sw.running()) {
			$('#time').text('So far... ' + sw.currentSeconds() + 's');
			setTimeout(updateCounter, 10);
		}
	}
	
	$('#total a').click(function(e) {
		e.preventDefault();
		$('#total span').text(ret.totalMinutes() + ' minutes');
	});
	
	$('#save a').click(function(e) {
		e.preventDefault();
		if(times.length) {
			$.post('/save', { start: times[0].started, times: times }, function(result) {
				$('#save a').addClass('saved');
			});
		}
	});
	
	var ret = {
		times: times,
		totalSeconds: function() {
			return times.map(function(x) {
				return x.seconds;
			}).reduce(function(x, y) {
				return x + (y || 0);
			});
		},
		totalMilliseconds: function() {
			return times.map(function(x) {
				return x.milliseconds;
			}).reduce(function(x, y) {
				return x + (y || 0);
			});
		},
		totalMinutes: function() {
			return ret.totalSeconds() / 60;
		}
	};
	
	return ret;

})(stopwatch, jQuery);