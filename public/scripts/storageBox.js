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
