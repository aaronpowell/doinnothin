doinnothin.chart = (function(Raphael, jQuery) {

	function refresh() {
		show(doinnothin.times);
	};
	
	function show(times) {
		var r = Raphael('chart'),
			fin = function () {
				this.flag = r.g.popup(this.bar.x, this.bar.y, (this.bar.value || "0") + 's').insertBefore(this);
			},
			fout = function () {
				this.flag.animate({opacity: 0}, 300, function () {this.remove();});
			};
    
		r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    
		r.g.text(160, 10, "Current Doin' Nothin' Stats");

		var chart = r.g.hbarchart(10, 25, 200, 20 * times.length, [times.map(function(x) { 
			return x.seconds;
		})])
			.hover(fin, fout);	
	};
	
	eventManager.bind('timer-stopped', function(sender, args) {
		refresh();
	});
	
	return {
		refresh: refresh
	};

})(Raphael, jQuery)