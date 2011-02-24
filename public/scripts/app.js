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

window.localDB = (function() {

	var pageStorage = (function() {
		var db = {};
		return {
			getItem: function(key) {
				if(!key) return;
				return db[key];
			},
			setItem: function(key, value) {
				if(!key) return;
				db[key] = value;
			},
			removeItem: function(key) {
				if(!key || !db[key]) return;
				return db[key];
			},
			clear: function() {
				db = {};
			}
		};
	})();

	function get(key, storage) {
		var s = storage.getItem(key);
		if(s) {
			return JSON.parse(s);
		}
		return undefined;
	}

	function getStorage(type) {
		type = type || 'localStorage';
		switch(type) {
			case 'sessionStorage':
				return sessionStorage;
			case 'pageStorage':
				return pageStorage;
			default:
				return localStorage;
		};
	}
	
	function set(key, value, storage) {
		storage.setItem(key, JSON.stringify(value));
	}
	
	function del(key, storage) {
		storage.removeItem(key);
	}
	
	return {
		getItem: function(key, type) {
			if(!key) return;
			var storage = getStorage(type);
			return get(key, storage);
		},
		setItem: function(key, value, type) {
			if(!key) return;
			var storage = getStorage(type);
			set(key, value, storage);
		},
		removeItem: function(key, type) {
			if(!key) return;
			var storage = getStorage(type);
			del(key, type);
		},
		clear: function(type) {
			var storage = getStorage(type);
			storage.clear();
		}
	};

})();