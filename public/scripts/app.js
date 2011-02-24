doinnothin = (function(sw, $) {
	
	var bootup = new Date();
	var dbId = bootup.getFullYear() + '-' + (bootup.getMonth()+1) + '-' + bootup.getDate();
	var db = storageBox.getItem(dbId);
	if(!db) {
		db = {times:[]};
		storageBox.setItem(dbId, db);
	}
	eventManager.trigger('time-refresh', this, { times: db.times });
	
	var btn = $('#go').click(function(e) {
		e.preventDefault();
		if(sw.running()) {
			sw.stop();
			var stats = sw.stats();
			var db = storageBox.getItem(dbId);
			db.times.push(stats);
			storageBox.setItem(dbId, db);
			btn.attr('value', 'I\'m doin\' nothin\'');
			$('#time').text('');
			eventManager.trigger('time-refresh', e, {stats: stats, times: db.times});
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
		var times = storageBox.getItem(dbId).times;
		if(times.length) {
			$.post('/save', { start: times[0].started, times: times }, function(result) {
				$('#save a').addClass('saved');
			});
		}
	});
	
	var ret = {
		times: function() {
			return storageBox.getItem(dbId).times;
		},
		totalSeconds: function() {
			var times = storageBox.getItem(dbId).times;
			return times.map(function(x) {
				return x.seconds;
			}).reduce(function(x, y) {
				return x + (y || 0);
			});
		},
		totalMilliseconds: function() {
			var times = storageBox.getItem(dbId).times;
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