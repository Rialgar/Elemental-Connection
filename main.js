'use strict';

var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_NS = 'http://www.w3.org/1999/xlink';

window.addEventListener('load', function(){
	var svg = document.getElementById('svg');

	window._game_= new Game(svg);
	_game_.start();
});

function ColissionTree(points){
	this.bbox = {
		min:{
			x: Infinity,
			y: Infinity
		},
		max:{
			x: -Infinity,
			y: -Infinity
		}
	}
	var midX = [];
	var midY = [];
	for (var i = 0; i < points.length; i++) {
		this.bbox.min.x=Math.min(this.bbox.min.x,points[i].x);
		this.bbox.min.y=Math.min(this.bbox.min.y,points[i].y);
		this.bbox.max.x=Math.max(this.bbox.max.x,points[i].x);
		this.bbox.max.y=Math.max(this.bbox.max.y,points[i].y);
		midX.push(points[i]);
		midY.push(points[i]);
	};
	if(points.length > 16){ //subdivide only if a sufficient number of points is present
		midX.sort(function(a,b){return a.x-b.x});
		midY.sort(function(a,b){return a.y-b.y});

		midX = midX.splice(Math.ceil(midX.length/2)-1, 2 - midX.length%2);
		midY = midY.splice(Math.ceil(midY.length/2)-1, 2 - midY.length%2);
		var median = {
			x: 0,
			y: 0
		};
		for (var i = 0; i < midX.length; i++) {
			median.x += midX[i].x;
			median.y += midY[i].y;
		};
		median.x /= midX.length;
		median.y /= midY.length;

		var topLeft = [];
		var	topRight = [];
		var bottomLeft = [];
		var bottomRight = [];

		var last = false;
		for (var i = 0; i < points.length; i++) {
			var next = false;
			var point = points[i];
			if(point.x <= median.x){
				if(point.y <= median.y){
					next = topLeft;
				} else {
					next = bottomLeft;
				}
			} else if(point.y <= median.y){
				next = topRight;
			} else {
				next = bottomRight;
			}
			next.push(point);
			if(last && last != next){
				last.push(point); //because we care for line segments
			}
			last = next;
		}

		this.median = median;
		this.topLeft = new ColissionTree(topLeft);
		this.topRight = new ColissionTree(topRight);
		this.bottomLeft = new ColissionTree(bottomLeft);
		this.bottomRight = new ColissionTree(bottomRight);
	} else {
		this.points = points;
	}
};

function linesCollide(a, b, c, d){
	var denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    var numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    var numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

    if (denominator == 0){
    	if(numerator1 == 0 && numerator2 == 0){
    		if(a.x != b.x){
    			var ac = a.x-c.x,
    			ad = a.x-d.x,
    			bc = b.x-c.x,
    			bd = b.x-d.x;
    			return ac*ad <= 0 || bc*bd <= 0 || ac*bc <=0 || ad*bd <= 0;
    		} else {
    			var ac = a.y-c.y,
    			ad = a.y-d.y,
    			bc = b.y-c.y,
    			bd = b.y-d.y;
    			return ac*ad <= 0 || bc*bd <= 0 || ac*bc <=0 || ad*bd <= 0;
    		}
    	} else {
    		return false;
    	};
    }

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
};

ColissionTree.prototype.collides = function(from, to){
		if(
			(from.x < this.bbox.min.x && to.x < this.bbox.min.x) ||
			(from.x > this.bbox.max.x && to.x > this.bbox.max.x) ||
			(from.y < this.bbox.min.y && to.y < this.bbox.min.y) ||
			(from.y > this.bbox.max.y && to.y > this.bbox.max.y)
		){
			return false
		} else if(!this.points){ //subdivided, check correct subtree
			var p = [from, to];
			var last = false;
			for (var i = 0; i < p.length; i++) {
				var point = p[i];
				var next = false;
				if(point.x <= this.median.x){
					if(point.y <= this.median.y){
						next = this.topLeft;
					} else {
						next = this.bottomLeft;
					}
				} else if(point.y <= this.median.y){
					next = this.topRight;
				} else {
					next = this.bottomRight;
				}
				if(next != last && next.collides(from,to)){
					return true;
				}
				last = next;
			}
			return false;
		} else { //not subdivided, check own line segements
			for (var i = 1; i < this.points.length; i++) {
				if(linesCollide(from, to, this.points[i-1], this.points[i])){
					return true;
				}
			};
		}
}

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
	if(this.finalized){
		return;
	}
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

Path.prototype.finalize = function(){
	this.finalized = true;
	this.colissionTree = new ColissionTree(this.points);
}

Path.prototype.collides = function(from, to){
	if(this.finalized){
		return this.colissionTree.collides(from, to);
	}
}

Path.prototype.addCircle = function(offset){
	var domElement = document.createElementNS(SVG_NS, 'circle');
	domElement.setAttribute('cx', this.points[0].x);
	domElement.setAttribute('cy', this.points[0].y);
	domElement.setAttribute('r', 6);
	domElement.setAttribute('fill', this.element.color);

	var circle = {
		element: this.element,
		domElement: domElement,
		segment: 1,
		position: 0
	}

	var self = this;

	this.domElement.parentElement.appendChild(domElement);
	this.circles.push(circle);

	if(offset > 0){
		this.moveCircle(circle, offset);
	}
	return circle;
}

Path.prototype.moveCircle = function(circle, delta){
	var distance = delta / 4;
	circle.position += distance;
	while(this.points[circle.segment].length < circle.position){
		circle.position -= this.points[circle.segment].length
		circle.segment++;
		if(circle.segment >= this.points.length){
			circle.domElement.parentElement.removeChild(circle.domElement);	
			this.circles.shift();
			this.drain.addUnit();
			return;
		}
	}
	var s = circle.segment;
	var f = circle.position / this.points[s].length;
	var x = this.points[s-1].x * (1-f) + this.points[s].x * (f);
	var y = this.points[s-1].y * (1-f) + this.points[s].y * (f);
	circle.domElement.setAttribute('cx',x);
	circle.domElement.setAttribute('cy',y);
}

Path.prototype.update = function(delta){
	for (var i = 0; i < this.circles.length; i++) {
		this.moveCircle(this.circles[i], delta);
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
	this.sendInterval = 500;
	this.sendNextIn = 0;

	this.updateFill();

	var self = this;
	parent.appendChild(domElement);
	domElement.addEventListener("mousedown", function(evt){
		if(self.path){
			game.removePath(self.path);
		}
		self.path = game.startDrawingPath(self, x, y);
	});
	domElement.addEventListener("touchstart", function(evt){
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

Source.prototype.removePath = function(){
	this.path = false;
	this.setAmount(this.maxAmount);
	this.sendNextIn = 0;
}

Source.prototype.setAmount = function(amount){
	this.amount = Math.min(this.maxAmount,Math.max(0,amount));
	this.updateFill();
}

Source.prototype.update = function(delta){
	if(this.amount > 0 && this.path && this.path.drain){
		this.sendNextIn -= delta;
		if(this.sendNextIn <= 0){
			this.path.addCircle(-this.sendNextIn);
			this.sendNextIn = this.sendInterval;
			this.setAmount(this.amount-1);
		}
	}
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
	this.x = x;
	this.y = y;

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

Drain.prototype.checkTouchEnd = function(x,y){
	if(x >= this.x-20 && x <= this.x+20 && y >= this.y-20 && y  <= this.y+20){
		return true;
	}
	return false;
};

Drain.prototype.updateFill = function(){
	var y = -2*this.amount/this.maxAmount + 1;
	y *= 20;
	this.fill.setAttribute('y', y);
	this.fill.setAttribute('height', 20-y);
}

Drain.prototype.setAmount = function(amount){
	this.amount = Math.min(this.maxAmount,Math.max(0,amount));
	this.updateFill();
}

Drain.prototype.removePath = function(){
	this.path = false;
	this.setAmount(0);
}

Drain.prototype.addUnit = function(){
	this.setAmount(this.amount+1);
	this.updateFill();
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
	this.sources = [];
	this.drains = [];
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

	this.offset = {
		x: Math.round((dWidth - width)/2),
		y: Math.round((dHeight - height)/2)
	}

	this.svg.style.top = this.offset.y + 'px';
	this.svg.style.left = this.offset.x + 'px';

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
		for (var i = 0; i < this.sources.length; i++) {
			this.sources[i].update(delta);
		};
	}
}

Game.prototype.removePath = function(path){
	if(path.source){
		path.source.removePath();
	}
	if(path.drain){
		path.drain.removePath();
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
		var last = this.newPath.points[this.newPath.points.length-1];
		for (var i = 0; i < this.paths.length; i++) {
			var p = this.paths[i];
			if(p.element != this.newPath.element && p.collides(last, {x:x,y:y})){
				return;
			}
		};
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

Game.prototype.addSource = function(element, x, y, amount){
	this.sources.push(new Source(element, x, y, amount, this.svg, this));
}

Game.prototype.addDrain = function(element, x, y, amount){
	this.drains.push(new Drain(element, x, y, amount, this.svg, this));
}

Game.prototype.start = function() {
		var self = this;
		this.svg.addEventListener('mousemove', function(evt){
			self.addPointToPath(evt.layerX/self.scale.x, evt.layerY/self.scale.y);
		});

		this.svg.addEventListener('mouseup', function(evt){
			self.cancelPath();
		});

		document.addEventListener('touchmove', function(evt){
			self.addPointToPath(
				(evt.touches[0].clientX-self.offset.x)/self.scale.x,
				(evt.touches[0].clientY-self.offset.y)/self.scale.y
			);
			evt.preventDefault();
		});

		this.svg.addEventListener('touchend', function(evt){
			var x = (evt.changedTouches[0].clientX-self.offset.x)/self.scale.x;
			var y = (evt.changedTouches[0].clientY-self.offset.y)/self.scale.y;
			for (var i = 0; i < self.drains.length; i++) {
				if(self.drains[i].checkTouchEnd(x,y)){
					self.finishPath(self.drains[i], self.drains[i].x, self.drains[i].y);
					return;
				}
			};
			self.cancelPath();
		});

		this.addSource(this.elements.fire, 50, 50, 5);
		this.addDrain(this.elements.fire, 750, 550, 5);

		this.addSource(this.elements.water, 750, 50, 5);
		this.addDrain(this.elements.water, 50, 550, 5);

		var last = new Date().valueOf();
		function update(){
			var now = new Date().valueOf();
			var delta = Math.min(now-last, 100);
			last = now;
			self.update(delta);
			window.requestAnimationFrame(update);
		}
		window.requestAnimationFrame(update);
	};