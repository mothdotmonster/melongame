// aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Body = Matter.Body,
	Events = Matter.Events,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Common = Matter.Common,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Bodies = Matter.Bodies;

const vw = window.innerWidth
const vh = window.innerHeight

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
		options: {
			wireframes: false,
			background: 'transparent',
			height: vh,
			width: vw
		}		
});

// create playfield
var leftWall = Bodies.rectangle((vw/2-250), (vh/2), 100, 500, { isStatic: true })
var rightWall = Bodies.rectangle((vw/2+250), (vh/2), 100, 500, { isStatic: true })
var ground = Bodies.rectangle((vw/2), (vh/2+300), 600, 100, { isStatic: true });

Composite.add(engine.world, [ground, leftWall, rightWall]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
				stiffness: 0,
				angularStiffness: 0,
				render: {
						visible: false
				}
		}
});

Composite.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


// spawn balls on click
Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
	var mousePosition = event.mouse.position
	//console.log('click at ' + mousePosition.x + ' ' + mousePosition.y)

	let dropX // drop X position is limited to inside the play area
	mousePosition.x > (vw/2+185) ? 
		dropX = (vw/2+185) : 
	mousePosition.x < (vw/2-185) ? 
		dropX = (vw/2-185) : dropX = mousePosition.x

	var circle = Bodies.circle ( dropX, (vh/2-280), 15, {
		render: {
			fillStyle: 'red'
		}
	})
	Composite.add(engine.world, circle)
})

// handle collisions
Events.on(engine, 'collisionStart', function(event) {
	var pairs = event.pairs;
	// iterate over collision pairs
	for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			// check if the collision is between two same-size objects
			if (pair.bodyA.render.fillStyle == pair.bodyB.render.fillStyle && pair.bodyA.render.fillStyle != 'pink') {
				Composite.remove(engine.world, pair.bodyB) // remove one of them
				Body.scale(pair.bodyA, 1.5, 1.5) // enlarge the other one
				// change color (this is a bad way to do it)
				pair.bodyA.render.fillStyle == 'red' ?
					pair.bodyA.render.fillStyle = 'orange' :
				pair.bodyA.render.fillStyle == 'orange' ?
					pair.bodyA.render.fillStyle = 'yellow' :
				pair.bodyA.render.fillStyle == 'yellow' ?
					pair.bodyA.render.fillStyle = 'green' :
				pair.bodyA.render.fillStyle == 'green' ?
					pair.bodyA.render.fillStyle = 'blue' :
				pair.bodyA.render.fillStyle == 'blue' ?
					pair.bodyA.render.fillStyle = 'purple' :
					pair.bodyA.render.fillStyle = 'pink'
			}
	}
});

Events.on(engine, 'collisionActive', function(event) {
	var pairs = event.pairs;
	// iterate over collision pairs
	for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			// check if the collision is between two same-size objects
			if (pair.bodyA.render.fillStyle == pair.bodyB.render.fillStyle && pair.bodyA.render.fillStyle != 'pink') {
				Composite.remove(engine.world, pair.bodyB) // remove one of them
				Body.scale(pair.bodyA, 1.5, 1.5) // enlarge the other one
				// change color (this is a bad way to do it)
				pair.bodyA.render.fillStyle == 'red' ?
					pair.bodyA.render.fillStyle = 'orange' :
				pair.bodyA.render.fillStyle == 'orange' ?
					pair.bodyA.render.fillStyle = 'yellow' :
				pair.bodyA.render.fillStyle == 'yellow' ?
					pair.bodyA.render.fillStyle = 'green' :
				pair.bodyA.render.fillStyle == 'green' ?
					pair.bodyA.render.fillStyle = 'blue' :
				pair.bodyA.render.fillStyle == 'blue' ?
					pair.bodyA.render.fillStyle = 'purple' :
					pair.bodyA.render.fillStyle = 'pink'
			}
	}
});