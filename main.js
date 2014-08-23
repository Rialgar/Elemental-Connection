"use strict";

var SVG_NS = "http://www.w3.org/2000/svg";
var XLINK_NS = "http://www.w3.org/1999/xlink";

window.addEventListener("load", function(){
	var svg = document.getElementById("svg");
	
	function onResize(){
		var ratio = 3/4;

		var dWidth = document.documentElement.clientWidth;
		var dHeight = document.documentElement.clientHeight;
		
		var height = Math.round(Math.min( dHeight, dWidth * ratio ));
		var width =  Math.round(height / ratio);

		svg.setAttribute("width", width + "px");
		svg.setAttribute("height", height + "px");

		svg.style.top = Math.round((dHeight - height)/2) + "px";
		svg.style.left = Math.round((dWidth - width)/2) + "px";
	}

	onResize();

	window.addEventListener("resize", onResize);

	window._game_= new Game(svg);
	_game_.start();
});

function Path(element, points, number, parent){
	var domElement = document.createElementNS(SVG_NS, 'path');
	var id = 'path' + number;

	this.element = element;
	this.id = id;
	this.domElement = domElement;
	this.points = points;
	this.circles = [];

	this.length = 0;
	for (var i = 1; i < this.points.length; i++) {
		var dx = this.points[i].x-this.points[i-1].x;
		var dy = this.points[i].y-this.points[i-1].y;
		this.points[i].length = Math.sqrt(dx*dx+dy*dy);
		this.length += this.points[i].length;
	};

	domElement.setAttribute('id', id);
	domElement.setAttribute('stroke', element.color);
	domElement.setAttribute('stroke-width', 2);
	this.createSVGPathDescriptor();

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
	var dx = this.points[l].x-this.points[l-1].x;
	var dy = this.points[l].y-this.points[l-1].y;
	this.points[l].length = Math.sqrt(dx*dx+dy*dy);
	this.length += this.points[l].length;
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
}

Game.prototype.togglePause = function(){
	this.paused ^= 1;
}

Game.prototype.addPath = function(element, points){
	var path = new Path(element, points, this.paths.length, this.svg);
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

Game.prototype.start = function() {
		var path = this.addPath(this.elements.fire, [{x:20,y:20}]);
		path.addPoint(780, 20);
		path.addPoint(780, 580);
		path.addPoint(20, 580);

		var self = this;
		var last = new Date().valueOf();
		function update(){
			var now = new Date().valueOf();
			var delta = Math.min(now-last, 100);
			self.update(delta);
			window.requestAnimationFrame(update);
		}
		window.requestAnimationFrame(update);
};