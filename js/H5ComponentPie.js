/* 雷达图组件对象 */

var h5ComponentPie = function(name,cfg) {
	var component = new h5ComponentBase(name,cfg);

	var w = cfg.width,
		h = cfg.height,
		r = w / 2;

	//加入一个画布
	var cns = document.createElement('canvas'),
		ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',1);
	component.append(cns);

	//绘制一个底图层
	ctx.beginPath();
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.lineWidth = 1;
	ctx.arc(r,r,r,0,2 * Math.PI);
	ctx.fill();
	//ctx.stroke();

	//绘制一个数据层
	var cnsData = document.createElement('canvas'),
		ctxData = cnsData.getContext('2d');
	cnsData.width = ctxData.width = w;
	cnsData.height = ctxData.height = h;
	$(cnsData).css('zIndex',2);
	component.append(cnsData);

	var colors = ['red','green','blue','orange','darkred'], //备用颜色
		sAngle = 1.5 * Math.PI,  // 设置画圆开始位置12点方向
		eAngle = 0,
		aAngle = Math.PI * 2,
		step = cfg.data.length;

	for(var i = 0; i < step; i++) {
		var item = cfg.data[i],
			color = item[2] || (item[2] = colors.pop());

		eAngle = sAngle + aAngle * item[1];
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = .1;
		ctx.moveTo(r,r);
		ctx.arc(r,r,r,sAngle,eAngle);
		ctx.fill();
		//ctx.stroke();

		sAngle = eAngle;

		//加入所有项目文本及百分比
		var text = $('<div class="text">');
		text.text(cfg.data[i][0]);
		component.append(text);

		var per = $('<div class="per" >');
		per.text(cfg.data[i][1] * 100 + '%');
		text.append(per);

		var x = r + Math.sin(Math.PI * 0.5 - sAngle) * r;
		var y = r + Math.cos(Math.PI * 0.5  - sAngle) * r;
		//console.log(sAngle);
		if(x > w/2) {
			text.css('left',x/2);
		} else {
			text.css('right',(w-x)/2);
		}

		if(y > h/2) {
			text.css('top',y/2);
		} else {
			text.css('bottom',(h-y)/2);
		}

		if(cfg.data[i][2]) {
			text.css('color',cfg.data[i][2]);
		}
		text.css('opacity',0);
	}	

	//绘制一个蒙版层
	var cnsMas = document.createElement('canvas'),
		ctxMas = cnsMas.getContext('2d');
	cnsMas.width = ctxMas.width = w;
	cnsMas.height = ctxMas.height = h;
	$(cnsMas).css('zIndex',3);
	component.append(cnsMas);

	ctxMas.fillStyle = '#fff';
	ctxMas.stroleStyle = '#fff';
	ctxMas.lineWidth = 1;

	//生长动画
	var draw = function (per) {
		ctxMas.clearRect(0,0,w,h);
		ctxMas.beginPath();
		ctxMas.moveTo(r,r);
		if(per <= 0) {
			ctxMas.arc(r,r,r,0,Math.PI * 2);
			component.find('.text').css('opacity',0);
		} else { 
			ctxMas.arc(r,r,r,sAngle,sAngle + 2*Math.PI*per,true); //
		}

		ctxMas.fill();
		//ctxMas.stroke();

		if(per >= 1) {
			h5ComponentPie.resort(component,find('.text')); ///
			component.find('.text').css('opacity',1);
			ctxMas.clearRect(0,0,w,h);
		}
	}

	draw(0);
	component.on('onLoad',function() {
		var set = 0;
		for(var i = 0; i < 100; i++) {
			setTimeout(function() {
				set += .01;
				draw(set);
			}, i*50 + 500);
		}
	});

	component.on('onLeave',function() {
		var set = 1;
		for(var i = 0; i < 100; i++) {
			setTimeout(function() {
				set -= .01;
				draw(set);
			}, i*10);
		}
	});

	return component;

}

h5ComponentPie.resort = function(list) {
	//检测相交
	var compare = function(domA,domB) {
		var offsetA = $(domA).offset(),
			offsetB = $(domB).offset(),

			//domA的
			shadowA_x = [offsetA.left,$(domA).width() + offsetA.left],
			shadowA_y = [offsetA.top,$(domA).height() + offsetA.top],

			shadowB_x = [offsetB.left,$(domB).width() + offsetB.left],
			shadowB_y = [offsetB.top,$(domB).height() + offsetB.top],

			//检测X相交
			interset_x=(shadowA_x[0]>shadowB_x[0]&&shadowA_x[0]<shadowB_x[1])||(shadowA_x[1]>shadowB_x[0]&&shadowA_x[1]<shadowB_x[1])
			//检测y相交
			interset_y=(shadowA_y[0]>shadowB_y[0]&&shadowA_y[0]<shadowB_y[1])||(shadowA_y[1]>shadowB_y[0]&&shadowA_y[1]<shadowB_y[1])

		return interset_x&&interset_y;

	}

	var reset = function(domA,domB) {
		if($(domA).css('top')!='auto') {
			$(domA).css('top',parseInt($(domA).css('top'), 10)+$(domB).height());
		} else {
			$(domA).css('bottom',parseInt($(domA).css('bottom'), 10)+$(domB).height());
		}
	}

}





























