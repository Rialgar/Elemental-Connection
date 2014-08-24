'use_strict';

var levels = [
	{
		sources: [
			{element: 'fire', x:250, y:300}
		],
		drains: [
			{element: 'fire', x:550, y:300}
		],
		converters: [],
		obstacles: []
	},
	{
		sources: [
			{element: 'fire', x:250, y:300}
		],
		drains: [
			{element: 'fire', x:550, y:300}
		],
		converters: [],
		obstacles: [
			{element: 'wall', A:{x:390, y:100}, B:{x:410, y:500}}
		]
	},
	{
		sources: [
			{element: 'fire', x:50, y:50}
		],
		drains: [
			{element: 'fire', x:750, y:550}
		],
		converters: [],
		obstacles: [
			{element: 'wall', A:{x:100, y:0}, B:{x:120, y:360}},
			{element: 'wall', A:{x:100, y:400}, B:{x:120, y:600}},
			{element: 'wall', A:{x:119, y:360}, B:{x:300, y:340}},
			{element: 'wall', A:{x:119, y:400}, B:{x:200, y:420}},
			{element: 'wall', A:{x:260, y:400}, B:{x:481, y:420}},
			{element: 'wall', A:{x:480, y:570}, B:{x:500, y:300}},
			{element: 'wall', A:{x:480, y:280}, B:{x:500, y:0}},
			{element: 'wall', A:{x:330, y:360}, B:{x:481, y:340}},
			{element: 'wall', A:{x:330, y:359}, B:{x:350, y:150}},
			{element: 'wall', A:{x:119, y:550}, B:{x:481, y:570}},
			{element: 'wall', A:{x:330, y:0}, B:{x:350, y:91}},
			{element: 'wall', A:{x:170, y:90}, B:{x:430, y:110}},
			{element: 'wall', A:{x:530, y:50}, B:{x:550, y:550}},
			{element: 'wall', A:{x:580, y:0}, B:{x:600, y:80}},
			{element: 'wall', A:{x:580, y:90}, B:{x:600, y:600}},
			{element: 'wall', A:{x:599, y:90}, B:{x:690, y:110}},
			{element: 'wall', A:{x:740, y:90}, B:{x:800, y:110}},
			{element: 'wall', A:{x:650, y:190}, B:{x:800, y:210}},
			{element: 'wall', A:{x:599, y:280}, B:{x:760, y:300}},
			{element: 'wall', A:{x:599, y:420}, B:{x:610, y:440}},
			{element: 'wall', A:{x:679, y:420}, B:{x:800, y:440}},
			{element: 'wall', A:{x:660, y:330}, B:{x:680, y:560}},
			{element: 'wall', A:{x:740, y:299}, B:{x:760, y:400}}
		]
	},
	{
		sources: [
			{element: 'fire', x:250, y:200},
			{element: 'water', x:250, y:400}
		],
		drains: [
			{element: 'fire', x:550, y:200},
			{element: 'water', x:550, y:400}
		],
		converters: [],
		obstacles: [],
	},
	{
		sources: [
			{element: 'fire', x:400, y:100},
			{element: 'water', x:200, y:300}
		],
		drains: [
			{element: 'fire', x:400, y:500},
			{element: 'water', x:600, y:300}
		],
		converters: [],
		obstacles: [
			{element: 'wall', A:{x:150, y:250}, B:{x:370, y:270}},
			{element: 'wall', A:{x:150, y:330}, B:{x:370, y:350}},
			{element: 'wall', A:{x:430, y:250}, B:{x:650, y:270}},
			{element: 'wall', A:{x:430, y:330}, B:{x:650, y:350}},

			{element: 'wall', A:{x:350, y:50}, B:{x:370, y:251}},
			{element: 'wall', A:{x:430, y:50}, B:{x:450, y:251}},
			{element: 'wall', A:{x:350, y:349}, B:{x:370, y:550}},
			{element: 'wall', A:{x:430, y:349}, B:{x:450, y:550}},
		],
	},
	{
		sources: [
			{element: 'fire', x:200, y:200},
			{element: 'water', x:200, y:400}
		],
		drains: [
			{element: 'fire', x:600, y:200},
			{element: 'water', x:600, y:400}
		],
		converters: [],
		obstacles: [
			{element: 'water', A:{x:390, y:200}, B:{x:410, y:0}},
			{element: 'wall', A:{x:390, y:200}, B:{x:410, y:400}},
			{element: 'fire', A:{x:390, y:600}, B:{x:410, y:400}}
		],
	},
	{
		sources: [
			{element: 'fire', x:200, y:200},
			{element: 'water', x:200, y:400}
		],
		drains: [
			{element: 'fire', x:600, y:200},
			{element: 'water', x:600, y:400}
		],
		converters: [],
		obstacles: [
			{element: 'water', A:{x:0, y:100}, B:{x:390, y:120}},
			{element: 'wall', A:{x:390, y:100}, B:{x:410, y:500}},
			{element: 'fire', A:{x:0, y:480}, B:{x:390, y:500}},

			{element: 'wall', A:{x:730, y:100}, B:{x:410, y:120}},
			{element: 'water', A:{x:730, y:100}, B:{x:750, y:300}},
			{element: 'fire', A:{x:730, y:300}, B:{x:750, y:500}},
			{element: 'wall', A:{x:730, y:480}, B:{x:410, y:500}}
		],
	},
	{
		sources: [
			{element: 'fire', x:50, y:200},
			{element: 'water', x:50, y:400}
		],
		drains: [
			{element: 'fire', x:750, y:200},
			{element: 'water', x:750, y:400}
		],
		converters: [],
		obstacles: [
			{element: 'water', A:{x:100, y:0}, B:{x:120, y:100}},
			{element: 'fire', A:{x:100, y:100}, B:{x:120, y:200}},
			{element: 'water', A:{x:100, y:200}, B:{x:120, y:300}},
			{element: 'fire', A:{x:100, y:300}, B:{x:120, y:400}},
			{element: 'water', A:{x:100, y:400}, B:{x:120, y:500}},
			{element: 'fire', A:{x:100, y:500}, B:{x:120, y:600}},

			{element: 'wall', A:{x:120, y:90}, B:{x:220, y:110}},
			{element: 'wall', A:{x:300, y:90}, B:{x:400, y:110}},
			{element: 'wall', A:{x:120, y:190}, B:{x:400, y:210}},
			{element: 'wall', A:{x:120, y:290}, B:{x:220, y:310}},
			{element: 'wall', A:{x:300, y:290}, B:{x:400, y:310}},
			{element: 'wall', A:{x:120, y:390}, B:{x:400, y:410}},
			{element: 'wall', A:{x:120, y:490}, B:{x:220, y:510}},			
			{element: 'wall', A:{x:300, y:490}, B:{x:400, y:510}},

			{element: 'water', A:{x:400, y:0}, B:{x:420, y:300}},
			{element: 'fire', A:{x:400, y:300}, B:{x:420, y:600}},

			{element: 'wall', A:{x:420, y:90}, B:{x:680, y:110}},
			{element: 'wall', A:{x:420, y:190}, B:{x:510, y:210}},
			{element: 'wall', A:{x:590, y:190}, B:{x:680, y:210}},
			{element: 'wall', A:{x:420, y:290}, B:{x:680, y:310}},
			{element: 'wall', A:{x:420, y:390}, B:{x:510, y:410}},
			{element: 'wall', A:{x:590, y:390}, B:{x:680, y:410}},		
			{element: 'wall', A:{x:420, y:490}, B:{x:680, y:510}},

			{element: 'fire', A:{x:680, y:0}, B:{x:700, y:100}},
			{element: 'water', A:{x:680, y:100}, B:{x:700, y:200}},
			{element: 'fire', A:{x:680, y:200}, B:{x:700, y:300}},
			{element: 'water', A:{x:680, y:300}, B:{x:700, y:400}},
			{element: 'fire', A:{x:680, y:400}, B:{x:700, y:500}},
			{element: 'water', A:{x:680, y:500}, B:{x:700, y:600}}
		],
	},
	{
		sources: [
			{element: 'earth', x:250, y:100},
			{element: 'fire', x:400, y:100},
			{element: 'air', x:550, y:100},
			{element: 'water', x:100, y:300}
		],
		drains: [
			{element: 'earth', x:250, y:500},
			{element: 'fire', x:400, y:500},
			{element: 'air', x:550, y:500},
			{element: 'water', x:700, y:300}
		],
		converters: [],
		obstacles: [
			{element: 'wall', A:{x:50, y:250}, B:{x:220, y:270}},
			{element: 'wall', A:{x:50, y:330}, B:{x:220, y:350}},

			{element: 'wall', A:{x:280, y:250}, B:{x:370, y:270}},
			{element: 'wall', A:{x:280, y:330}, B:{x:370, y:350}},
			
			{element: 'wall', A:{x:430, y:250}, B:{x:520, y:270}},
			{element: 'wall', A:{x:430, y:330}, B:{x:520, y:350}},

			{element: 'wall', A:{x:580, y:250}, B:{x:750, y:270}},
			{element: 'wall', A:{x:580, y:330}, B:{x:750, y:350}},

			
			{element: 'wall', A:{x:200, y:50}, B:{x:220, y:251}},
			{element: 'wall', A:{x:280, y:50}, B:{x:300, y:251}},
			{element: 'wall', A:{x:200, y:349}, B:{x:220, y:550}},
			{element: 'wall', A:{x:280, y:349}, B:{x:300, y:550}},

			{element: 'wall', A:{x:350, y:50}, B:{x:370, y:251}},
			{element: 'wall', A:{x:430, y:50}, B:{x:450, y:251}},
			{element: 'wall', A:{x:350, y:349}, B:{x:370, y:550}},
			{element: 'wall', A:{x:430, y:349}, B:{x:450, y:550}},

			{element: 'wall', A:{x:580, y:50}, B:{x:600, y:251}},
			{element: 'wall', A:{x:500, y:50}, B:{x:520, y:251}},
			{element: 'wall', A:{x:580, y:349}, B:{x:600, y:550}},
			{element: 'wall', A:{x:500, y:349}, B:{x:520, y:550}},
		],
	},
	{
		sources: [
			{element: 'earth', x:75, y:75},
			{element: 'fire', x:75, y:225},
			{element: 'water', x:75, y:375},
			{element: 'air', x:75, y:525}
		],
		drains: [
			{element: 'earth', x:725, y:75},
			{element: 'fire', x:725, y:225},
			{element: 'water', x:725, y:375},
			{element: 'air', x:725, y:525}
		],
		converters: [],
		obstacles: [
			{element: 'air', A:{x:150, y:0}, B:{x:170, y:150}},
			{element: 'water', A:{x:150, y:150}, B:{x:170, y:300}},
			{element: 'fire', A:{x:150, y:300}, B:{x:170, y:450}},
			{element: 'earth', A:{x:150, y:450}, B:{x:170, y:600}},

			{element: 'water', A:{x:390, y:0}, B:{x:410, y:140}},

			{element: 'wall', A:{x:170, y:140}, B:{x:240, y:160}},
			{element: 'wall', A:{x:330, y:140}, B:{x:470, y:160}},
			{element: 'wall', A:{x:560, y:140}, B:{x:630, y:160}},

			{element: 'air', A:{x:390, y:160}, B:{x:410, y:290}},

			{element: 'wall', A:{x:170, y:290}, B:{x:240, y:310}},
			{element: 'wall', A:{x:330, y:290}, B:{x:470, y:310}},
			{element: 'wall', A:{x:560, y:290}, B:{x:630, y:310}},

			{element: 'earth', A:{x:390, y:310}, B:{x:410, y:440}},

			{element: 'wall', A:{x:170, y:440}, B:{x:240, y:460}},			
			{element: 'wall', A:{x:330, y:440}, B:{x:470, y:460}},
			{element: 'wall', A:{x:560, y:440}, B:{x:630, y:460}},	

			{element: 'fire', A:{x:390, y:460}, B:{x:410, y:600}},

			{element: 'air', A:{x:650, y:0}, B:{x:630, y:150}},
			{element: 'water', A:{x:650, y:150}, B:{x:630, y:300}},
			{element: 'fire', A:{x:650, y:300}, B:{x:630, y:450}},
			{element: 'earth', A:{x:650, y:450}, B:{x:630, y:600}},
		],
	},
	{
		sources: [
			{element: 'fire', x:250, y:300}
		],
		drains: [
			{element: 'water', x:550, y:300}
		],
		converters: [
			{element: 'water', x:400, y:300}
		],
		obstacles: []
	}
]