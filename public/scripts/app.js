doinnothin = (function(sw, $) {

	var times = [];
	
	var btn = $('#go').click(function(e) {
		e.preventDefault();
		if(sw.running()) {
			sw.stop();
			var stats = sw.stats();
			times.push(stats);
			if(!$('#stats ul').length) {
				$('#total').show();
				$('<ul></ul>').appendTo($('#stats'));
			}
			
			var d = new Date(stats.started);
			var d2 = new Date(stats.ended);
			$('<li>' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' to ' +  d2.getHours() + ':' + d2.getMinutes() + ':' + d2.getSeconds() + ' (' + stats.seconds + 's) - <em class="editable" contenteditable="true">Description</em></li>')
				.appendTo($('#stats ul'));
			btn.attr('value', 'I\'m doin\' nothin\'');
			$('#time').text('');
		} else {
			sw.reset();
			sw.start();
			btn.attr('value', 'I\'m doin\' somethin\'');
			updateCounter();
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