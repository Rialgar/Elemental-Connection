'use strict';

var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_NS = 'http://www.w3.org/1999/xlink';

window.addEventListener('load', function(){
	var svg = document.getElementById('svg');

	window._game_= new Game(svg);
	_game_.start();
});

function Path(element, x, y, number, parent){
	var domElement = document.createElementNS(SVG_NS, 'path');
	var id = 'path' + number;

	this.element = element;
	this.id = id;
	this.domElement = domElement;
	this.points = [];
	this.circles = [];
	this.length = 0;

	this.addPoint(x, y);

	domElement.setAttribute('id', id);
	domElement.setAttribute('stroke', element.color);
	domElement.setAttribute('stroke-width', 2);

	parent.insertBefore(domElement, parent.firstChild);
}

Path.prototype.createSVGPathDescriptor = function(){
	var p = this.points[0];
	var d = 'M'+p.x+','+p.y;
	for (var i = 1; i < this.points.length; i++) {
		p = this.points[i];
		d += ' L'+p.x+','+p.y;
	};
	this.domElement.setAttribute('d', d);
}

Path.prototype.addPoint = function(x,y){
	this.points.push({x:x, y:y});
	this.createSVGPathDescriptor();

	var l = this.points.length-1;
	if(l > 0){
		var dx = this.points[l].x-this.points[l-1].x;
		var dy = this.points[l].y-this.points[l-1].y;
		this.points[l].length = Math.sqrt(dx*dx+dy*dy);
		this.length += this.points[l].length;
	}
}

Path.prototype.addCircle = function(onEnd){
	var domElement = document.createElementNS(SVG_NS, 'circle');
	domElement.setAttribute('cx', this.points[0].x);
	domElement.setAttribute('cy', this.points[0].y);
	domElement.setAttribute('r', 6);
	domElement.setAttribute('fill', this.element.color);

	var circle = {
		element: this.element,
		domElement: domElement,
		onEnd: onEnd,
		segment: 1,
		position: 0
	}

	var self = this;

	this.domElement.parentElement.appendChild(domElement);
	this.circles.push(circle);
	return circle;
}

Path.prototype.update = function(delta){
	var dPos = delta / 20;
	for (var i = 0; i < this.circles.length; i++) {
		var c = this.circles[i];
		c.position += dPos;
		while(this.points[c.segment].length < c.position){
			c.position -= this.points[c.segment].length
			c.segment++;
			if(c.segment >= this.points.length){
				this.circles.shift();
				return;
			}
		}
		var s = c.segment;
		var f = c.position / this.points[s].length;
		var x = this.points[s-1].x * (1-f) + this.points[s].x * (f);
		var y = this.points[s-1].y * (1-f) + this.points[s].y * (f);
		c.domElement.setAttribute('cx',x);
		c.domElement.setAttribute('cy',y);
	};
}

function Source(element, x, y, amount, parent, game){
	var domElement = document.createElementNS(SVG_NS, 'g');
	domElement.setAttribute('transform', 'translate('+x+','+y+')');

	var circle = document.createElementNS(SVG_NS, 'circle');
	circle.setAttribute('cx', 0);
	circle.setAttribute('cy', 0);
	circle.setAttribute('r', 20);
	circle.setAttribute('fill', 'transparent');
	circle.setAttribute('stroke', element.color);
	circle.setAttribute('stroke-width', 2);
	domElement.appendChild(circle);

	var fill = document.createElementNS(SVG_NS, "path");
	fill.setAttribute('fill', element.color);
	domElement.appendChild(fill);

	this.element = element;
	this.domElement = domElement;
	this.fill = fill;
	this.maxAmount = amount;
	this.amount = amount;

	this.updateFill();

	var self = this;
	parent.appendChild(domElement);
	domElement.addEventListener("mousedown", function(evt){
		if(self.path){
			game.removePath(self.path);
		}
		self.path = game.startDrawingPath(self, x, y);
	});
}

Source.prototype.updateFill = function(){
	var y = -2*this.amount/this.maxAmount + 1;
	var d;
	if(y < -0.99){
		var d = 'M0,-20 A20,20 0 1,1 0,20 A20,20 0 1,1 0,-20';
	} else {
		var x = Math.sqrt(1 - y*y);
		x = x*20;
		y = y*20;
		var la = y>0 ? 0 : 1;
		var d = 'M'+x+','+y+' A20,20 0 '+la+',1 '+(-x)+','+y+' L'+x+','+y;
	}
	this.fill.setAttribute('d', d);
}

function Drain(element, x, y, amount, parent, game){
	var domElement = document.createElementNS(SVG_NS, 'g');
	domElement.setAttribute('transform', 'translate('+x+','+y+')');

	var border = document.createElementNS(SVG_NS, 'rect');
	border.setAttribute('x', -20);
	border.setAttribute('y', -20);
	border.setAttribute('width', 40);
	border.setAttribute('height', 40);
	border.setAttribute('fill', 'transparent');
	border.setAttribute('stroke', element.color);
	border.setAttribute('stroke-width', 2);
	domElement.appendChild(border);

	var fill = document.createElementNS(SVG_NS, "rect");
	fill.setAttribute('x', -20);
	fill.setAttribute('width', 40);
	fill.setAttribute('fill', element.color);
	fill.setAttribute('stroke-width', 0);
	domElement.appendChild(fill);

	this.element = element;
	this.domElement = domElement;
	this.fill = fill;
	this.maxAmount = amount;
	this.amount = 0;

	this.updateFill();

	var self = this;
	parent.appendChild(domElement);
	domElement.addEventListener("mouseup", function(evt){
		if(self.path){
			game.removePath(self.path);
		}
		game.finishPath(self, x, y);
		evt.stopPropagation();
	});
}

Drain.prototype.updateFill = function(){
	var y = -2*this.amount/this.maxAmount + 1;
	y *= 20;
	this.fill.setAttribute('y', y);
	this.fill.setAttribute('height', 20-y);
}

function Game(svg){
	this.elements = {
		earth: {
			color: 'saddlebrown',
		},
		water: {
			color: 'blue',
		},
		air: {
			color: '#FFFF60',
		},
		fire: {
			color: 'red',
		},
	}
	this.svg = svg;
	this.paths = [];
	this.paused = false;

	var self = this;
	this.onResize();
	window.addEventListener('resize', function(){
		self.onResize();
	})
}

Game.prototype.onResize = function(){
	var ratio = 3/4;

	var dWidth = document.documentElement.clientWidth;
	var dHeight = document.documentElement.clientHeight;
	
	var height = Math.round(Math.min( dHeight, dWidth * ratio ));
	var width =  Math.round(height / ratio);

	this.svg.setAttribute('width', width + 'px');
	this.svg.setAttribute('height', height + 'px');

	this.svg.style.top = Math.round((dHeight - height)/2) + 'px';
	this.svg.style.left = Math.round((dWidth - width)/2) + 'px';

	this.scale = {
		x: width / 800,
		y: height / 600
	};
}
Game.prototype.togglePause = function(){
	this.paused ^= 1;
}

Game.prototype.addPath = function(element, x, y){
	var path = new Path(element, x, y, this.paths.length, this.svg);
	this.paths.push(path);
	return path;
}

Game.prototype.update = function(delta){
	if(!this.paused){
		for (var i = 0; i < this.paths.length; i++) {
			this.paths[i].update(delta);
		};
	}
}

Game.prototype.removePath = function(path){
	if(path.source){
		path.source.path = false;
	}
	if(path.drain){
		path.drain.path = false;
	}
	this.paths.splice(this.paths.indexOf(path),1);
	path.domElement.parentElement.removeChild(path.domElement);
}

Game.prototype.startDrawingPath = function(source, x, y){
	this.newPath = this.addPath(source.element, x, y);
	this.newPath.source = source;
	return this.newPath;
}

Game.prototype.addPointToPath = function(x, y){
	if(this.newPath){
		this.newPath.addPoint(x, y);
	}
}

Game.prototype.finishPath = function(drain, x, y){
	if(this.newPath){
		if(drain.element === this.newPath.element){
			this.newPath.addPoint(x, y);
			this.newPath.drain = drain;
			this.newPath = false;
		} else {
			this.cancelPath();
		}
	}
}

Game.prototype.cancelPath = function(){
	if(this.newPath){
		this.removePath(this.newPath);
		this.newPath = false;
	}
}

Game.prototype.start = function() {
		var self = this;
		this.svg.addEventListener('mousemove', function(evt){
			self.addPointToPath(evt.layerX*self.scale.x, evt.layerY*self.scale.y);
		});

		this.svg.addEventListener('mouseup', function(evt){
			self.cancelPath();
		});

		new Source(this.elements.fire, 50, 50, 5, this.svg, this);
		new Drain(this.elements.fire, 750, 550, 5, this.svg, this);

		new Source(this.elements.water, 750, 50, 5, this.svg, this);
		new Drain(this.elements.water, 50, 550, 5, this.svg, this);

		var last = new Date().valueOf();
		function update(){
			var now = new Date().valueOf();
			var delta = Math.min(now-last, 100);
			self.update(delta);
			window.requestAnimationFrame(update);
		}
		window.requestAnimationFrame(update);
};