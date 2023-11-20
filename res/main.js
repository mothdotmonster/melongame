// aliases
var Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Body = Matter.Body,
		Events = Matter.Events,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		Composite = Matter.Composite,
		Bodies = Matter.Bodies

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
var leftWall = Bodies.rectangle((vw/2-200), (vh/2), 10, 500, { isStatic: true })
var rightWall = Bodies.rectangle((vw/2+200), (vh/2), 10, 500, { isStatic: true })
var ground = Bodies.rectangle((vw/2), (vh/2+250), 410, 10, { isStatic: true });

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

Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
	var mousePosition = event.mouse.position
	console.log('click at ' + mousePosition.x + ' ' + mousePosition.y)
	var circle = Bodies.circle (mousePosition.x, mousePosition.y, 15)
	Composite.add(engine.world, circle)
})