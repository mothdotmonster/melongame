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

let scoreDisplay = document.querySelector('#score')
let nextDisplay = document.querySelector('#next')
let uiOuter = document.querySelector('#ui-outer')

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
var leftWall = Bodies.rectangle((vw/2-250), (vh/2), 100, 500, { isStatic: true, friction: 0 })
var rightWall = Bodies.rectangle((vw/2+250), (vh/2), 100, 500, { isStatic: true, friction: 0 })
var ground = Bodies.rectangle((vw/2), (vh/2+300), 600, 100, { isStatic: true, friction: 0 })
var deathplane = Bodies.rectangle((vw/2), (vh/2+500), 100000, 100, { isStatic: true, friction: 0, render: { visible: false }, label: 'deathplane' })

Composite.add(engine.world, [ground, leftWall, rightWall, deathplane]);

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

// start score counting
let score = 0

// initialize click timeout
let lastClick = 0

// seed RNG
nextBall = 0

// spawn balls on click
Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
	var mousePosition = event.mouse.position

	let dropX // drop X position is limited to inside the play area
	mousePosition.x > (vw/2+185) ? 
		dropX = (vw/2+185) : 
	mousePosition.x < (vw/2-185) ? 
		dropX = (vw/2-185) : dropX = mousePosition.x

	// ste up the balls for dropping
	var circle0 = Bodies.circle ( dropX, (vh/2-400), 15, {
		render: {
			fillStyle: 'red'
		},
		friction: 0
	})
	var circle1 = Bodies.circle ( dropX, (vh/2-400), 15 * 1.25, {
		render: {
			fillStyle: 'orange'
		},
		friction: 0
	})
	var circle2 = Bodies.circle ( dropX, (vh/2-400), 15 * 1.25 * 1.25, {
		render: {
			fillStyle: 'yellow'
		},
		friction: 0
	})

	// only drop if it's been 1 seconds since the last drop
	if (lastClick < Date.now()-1000) {
		nextBall == 0 ?
			Composite.add(engine.world, circle0) :
		nextBall == 1 ?
			Composite.add(engine.world, circle1) :
			Composite.add(engine.world, circle2)
		nextBall = Math.floor(Math.random() * 2.1)

		// change next ball display
		nextBall == 0 ?
			nextDisplay.innerHTML = "red" :
		nextBall == 1 ?
			nextDisplay.innerHTML = "orange" :
			nextDisplay.innerHTML = "yellow"

		lastClick = Date.now()
	}
})

// handle collisions
Events.on(engine, 'collisionStart', function(event) {
	var pairs = event.pairs;
	// iterate over collision pairs
	for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			// check if the collision is between two same-size objects
			if (pair.bodyA.render.fillStyle == pair.bodyB.render.fillStyle && pair.bodyA.render.fillStyle != 'olive') {
				Composite.remove(engine.world, pair.bodyB) // remove one of them
				Body.scale(pair.bodyA, 1.25, 1.25) // enlarge the other one

				// change color (TODO: add sprites instead)
				switch (pair.bodyA.render.fillStyle) {
					case 'red':
						pair.bodyA.render.fillStyle = 'orange'
						break
					case 'orange':
						pair.bodyA.render.fillStyle = 'yellow'
						break
					case 'yellow':
						pair.bodyA.render.fillStyle = 'yellowgreen'
						break
					case 'yellowgreen':
						pair.bodyA.render.fillStyle = 'lime'
						break
					case 'lime':
						pair.bodyA.render.fillStyle = 'green'
						break
					case 'green':
						pair.bodyA.render.fillStyle = 'blue'
						break
					case 'blue':
						pair.bodyA.render.fillStyle = 'indigo'
						break
					case 'indigo':
						pair.bodyA.render.fillStyle = 'blueviolet'
						break
					case 'blueviolet':
						pair.bodyA.render.fillStyle = 'purple'
						break
					case 'purple':
						pair.bodyA.render.fillStyle = 'magenta'
						break
					case 'magenta':
						pair.bodyA.render.fillStyle = 'pink'
						break
					case 'pink':
						pair.bodyA.render.fillStyle = 'aliceblue'
						break
					case 'aliceblue':
						pair.bodyA.render.fillStyle = 'lightgreen'
						break
					case 'lighrgreen':
						pair.bodyA.render.fillStyle = 'gold'
						break
					case 'gold':
						pair.bodyA.render.fillStyle = 'olive'
						break
				}
				
				// temporary score system, add some combos and stuff later
				score += 1
				scoreDisplay.innerHTML = score
			}
			
			// game over
			if (pair.bodyA.label == 'deathplane' || pair.bodyB.label == 'deathplane') {
				Runner.stop(runner) // stop game
				nextDisplay.innerHTML = "game over" // let the player know what happen
				uiOuter.style.cssText += 'background-image: linear-gradient(0deg, lightgrey 16.67%, transparent 16.67%, transparent 50%, lightgrey 50%, lightgrey 66.67%, transparent 66.67%, transparent 100%); background-size: 12.00px 12.00px;;'
			}
	}
});

// TOOD: figure out how to not copy and paste so much code like a moron
Events.on(engine, 'collisionActive', function(event) {
	var pairs = event.pairs;
	// iterate over collision pairs
	for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			// check if the collision is between two same-size objects
			if (pair.bodyA.render.fillStyle == pair.bodyB.render.fillStyle && pair.bodyA.render.fillStyle != 'olive') {
				Composite.remove(engine.world, pair.bodyB) // remove one of them
				Body.scale(pair.bodyA, 1.25, 1.25) // enlarge the other one

				// change color (TODO: add sprites instead)
				switch (pair.bodyA.render.fillStyle) {
					case 'red':
						pair.bodyA.render.fillStyle = 'orange'
						break
					case 'orange':
						pair.bodyA.render.fillStyle = 'yellow'
						break
					case 'yellow':
						pair.bodyA.render.fillStyle = 'yellowgreen'
						break
					case 'yellowgreen':
						pair.bodyA.render.fillStyle = 'lime'
						break
					case 'lime':
						pair.bodyA.render.fillStyle = 'green'
						break
					case 'green':
						pair.bodyA.render.fillStyle = 'blue'
						break
					case 'blue':
						pair.bodyA.render.fillStyle = 'indigo'
						break
					case 'indigo':
						pair.bodyA.render.fillStyle = 'blueviolet'
						break
					case 'blueviolet':
						pair.bodyA.render.fillStyle = 'purple'
						break
					case 'purple':
						pair.bodyA.render.fillStyle = 'magenta'
						break
					case 'magenta':
						pair.bodyA.render.fillStyle = 'pink'
						break
					case 'pink':
						pair.bodyA.render.fillStyle = 'aliceblue'
						break
					case 'aliceblue':
						pair.bodyA.render.fillStyle = 'lightgreen'
						break
					case 'lightgreen':
						pair.bodyA.render.fillStyle = 'gold'
						break
					case 'gold':
						pair.bodyA.render.fillStyle = 'olive'
						break
				}

				score += 1
				scoreDisplay.innerHTML = score
			}
	}
});