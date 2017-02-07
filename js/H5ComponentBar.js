/* 柱图组件对象 */

var h5ComponentBar = function(name,cfg) {
	var component  = new h5ComponentBase(name,cfg);

	$.each(cfg.data,function(index,item) {
		var line = $('<div class="line">'),
			name = $('<div class="name">'),
			rate = $('<div class="rate">'),
			per = $('<div class="per">');

		var width = item[1]*100 + '%',
			bgStyle = '';

		rate.css('width',width);
		if(item[2]) {
			bgStyle = 'style="background-color: '+ item[2] +'"';
			per.css('color',item[2]);
		}
		rate.html('<div class="bg" '+ bgStyle + '></div>');
		per.text(width);

		name.text(item[0]);
		line.append(name).append(rate).append(per);
		component.append(line);

	});

	return component;
}
