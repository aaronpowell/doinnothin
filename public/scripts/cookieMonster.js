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

