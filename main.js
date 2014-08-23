"use strict";

var SVG_NS = "http://www.w3.org/2000/svg";
var XLINK_NS = "http://www.w3.org/1999/xlink";

window.addEventListener("load", function(){
	var svg = document.getElementById("svg");

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

	parent.appendChild(domElement);
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

function Game(svg){
	this.elements = {
		earth: {
			color: "saddlebrown",
		},
		water: {
			color: "blue",
		},
		air: {
			color: "#FFFF60",
		},
		fire: {
			color: "red",
		},
	}
	this.svg = svg;
	this.paths = [];
	this.paused = false;

	var self = this;
	this.onResize();
	window.addEventListener("resize", function(){
		self.onResize();
	})
}

Game.prototype.onResize = function(){
	var ratio = 3/4;

	var dWidth = document.documentElement.clientWidth;
	var dHeight = document.documentElement.clientHeight;
	
	var height = Math.round(Math.min( dHeight, dWidth * ratio ));
	var width =  Math.round(height / ratio);

	this.svg.setAttribute("width", width + "px");
	this.svg.setAttribute("height", height + "px");

	this.svg.style.top = Math.round((dHeight - height)/2) + "px";
	this.svg.style.left = Math.round((dWidth - width)/2) + "px";

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

Game.prototype.startDrawingPath = function(x, y){
	this.newPath = this.addPath(this.elements.fire, x, y);
}

Game.prototype.addPointToPath = function(x, y){
	if(this.newPath){
		this.newPath.addPoint(x, y);
	}
}

Game.prototype.finishPath = function(x, y){
	if(this.newPath){
		this.newPath.addPoint(x, y);
		this.newPath = false;
	}
}

Game.prototype.start = function() {
		var self = this;
		this.svg.addEventListener("mousedown", function(evt){
			self.startDrawingPath(evt.layerX*self.scale.x, evt.layerY*self.scale.y);
		});

		this.svg.addEventListener("mousemove", function(evt){
			self.addPointToPath(evt.layerX*self.scale.x, evt.layerY*self.scale.y);
		});

		this.svg.addEventListener("mouseup", function(evt){
			self.finishPath(evt.layerX*self.scale.x, evt.layerY*self.scale.y);
		});

		var last = new Date().valueOf();
		function update(){
			var now = new Date().valueOf();
			var delta = Math.min(now-last, 100);
			self.update(delta);
			window.requestAnimationFrame(update);
		}
		window.requestAnimationFrame(update);
};