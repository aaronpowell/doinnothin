doinnothin = (function(sw, $) {

	var times = [];
	
	var btn = $('#go').click(function(e) {
		e.preventDefault();
		if(sw.running()) {
			sw.stop();
			var stats = sw.stats();
			times.push(stats);
			if(!$('#stats ul').length) {
				$('<ul></ul>').appendTo($('#stats'));
			}
			
			var d = new Date(stats.started);
			var d2 = new Date(stats.ended);
			$('<li>' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' to ' +  d2.getHours() + ':' + d2.getMinutes() + ':' + d2.getSeconds() + ' (' + stats.seconds + 's) - <em class="editable" contenteditable="true">Description</em></li>')
				.appendTo($('#stats ul'));
			btn.attr('value', 'Go!');
			$('#time').text('');
		} else {
			sw.reset();
			sw.start();
			btn.attr('value', 'Stop!');
			updateCounter();
		}
	});
	
	function updateCounter() {
		if(sw.running()) {
			$('#time').text('So far... ' + sw.currentSeconds() + 's');
			setTimeout(updateCounter, 10);
		}
	}
	
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

})(stopwatch, jQuery);