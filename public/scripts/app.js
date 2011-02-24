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

window.cookieMonster = (function() {
	if(!Array.prototype.filter) {
		Array.prototype.filter = function(fn) {
			var ret = [];
			for(var i=0,l=this.length; i<l; i++) {
				if(fn(this[i], i)) ret.push(this[i]);
			}
			return ret;
		};
	};
	return {
		add: function(key, value) {
			document.cookie = key + '=' + JSON.stringify(value);
		},
		get: function(key) {
			var cookies = document.cookie.split('; ')
				.filter(function(x) {
					return x.split('=')[0] == key;
				}).map(function(x) {
					var s = x.split('=')[1];
					return JSON.parse(s);
				});
			
			if(cookies && cookies.length > 0) {
				return cookies[0];
			}
			return;			
		},
		remove: function(key, value) {
			document.cookie = key + '=' + JSON.stringify(value) + ';expires=' + 'Thu, 01-Jan-70 00:00:01 GMT;';
		}
	};
})();

window.storageBox = (function() {

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
				delete db[key];
			},
			clear: function() {
				db = {};
			}
		};
	})();

	var cookieStorage = (function() {
		cookieMonster.add('cookieStorage', {});
		function getDB() {
			return cookieMonster.get('cookieStorage');
		};
		return {
			getItem: function(key) {
				if(!key) return;
				var db = getDB();
				return db[key];
			},
			setItem: function(key, value) {
				if(!key) return;
				var db = getDB();
				db[key] = value;
				cookieMonster.add('cookieStorage', db);
			},
			removeItem: function(key) {
				if(!key) return;
			
			},
			clear: function() {
				cookieMonster.add('cookieStorage', {});
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
			case 'cookieStorage':
				return cookieStorage;
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
		},
		getDB: getStorage
	};

})();
