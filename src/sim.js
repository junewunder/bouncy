const width = 1080
const height = 720

class Bouncy {
  constructor(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vx = Math.random() * 3
    this.vy = Math.random() * 3
    this.boundVelocity = bound(TERMINAL_VELOCITY * -1)(TERMINAL_VELOCITY)

    this.collisions = [] // debug
    this.colorSeed = Math.random() * 2 - 1
  }

  collide(others) {
    this.collisions = [] // debug
    for (let other of others) {
      const dx = other.x - this.x
      const dy = other.y - this.y
      const collisionDistance = this.radius + other.radius

      if (dist(dx, dy) > collisionDistance) continue
      this.collisions.push(other) // debug

      const angle = Math.atan(dy / dx)
      const targetX = this.x + Math.cos(angle)
      const targetY = this.y + Math.sin(angle)

      const ax = (targetX - other.x) * SPRING
      const ay = (targetY - other.y) * SPRING
      this.vx += ax * this.radius / collisionDistance
      this.vy += ay * this.radius / collisionDistance
      other.vx -= ax * other.radius / collisionDistance
      other.vy -= ay * other.radius / collisionDistance
    }
  }

  move() {
    this.colorSeed += Math.random() - 0.5

    // this.vx = this.boundVelocity(this.vx)
    // this.vy = this.boundVelocity(this.vy)
    this.vy += GRAVITY
    this.x += this.vx
    this.y += this.vy

    if (this.x + this.radius > width) {
      this.x = width - this.radius
      this.vx *= FRICTION
    }
    else if (this.x - this.radius < 0) {
      this.x = this.radius
      this.vx *= FRICTION
    }
    else if (this.y + this.radius > height) {
      this.y = height - this.radius
      this.vy *= FRICTION
    }
    else if (this.y - this.radius < 0) {
      this.y = this.radius
      this.vy *= FRICTION
    }
  }

  display(ctx) {
    ctx.fillStyle = rgba(Math.cos(this.x / width), Math.sin(this.y / height), this.colorSeed, 1)

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    // ctx.stroke()
    ctx.fill()
  }

  displayDebug(ctx) {
    for (let other of this.collisions) {
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(other.x, other.y)
      ctx.stroke()
    }
  }
}

const clear = ctx => ctx.fillRect(0, 0, width, height)

const dist = (dx, dy) => Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

const rgba = (r, g, b, a) => `rgba(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)}, ${Math.min(Math.max(a, 0), 1)})`

const bound = min => max => x => Math.min(Math.max(x, min), max)

const NUM_ENTITIES = 50
const SPRING = 0.01
const GRAVITY = 0
const FRICTION = -1
const scale = 1
const TERMINAL_VELOCITY = 3

// const clearColor = radio({
//   title: 'Clear Color',
//   options: [
//     { label: 'White', value: 'white' },
//     { label: 'Black', value: 'black' },
//     { label: 'Transparent', value: rgba(1, 1, 1, .01) },
//     { label: 'Transparent Black', value: rgba(0, 0, 0, .01) },
//   ],
//   value: rgba(1, 1, 1, .01)
// })
// clearFrames = DOM.input("checkbox")
// running = DOM.input("checkbox")
const clearColor = rgba(0, 0, 0, .01)
const clearFrames = {checked: true}
const running = {checked: true}
const entities = []

async function mainloop() {
  let current
  const collisions = entities.concat()
  while (current = collisions.pop()) {
    current.collide(collisions)
  }

  entities.forEach(entity => entity.move())
}

async function renderloop(ctx, state, dispatch) {
  requestAnimationFrame(() => renderloop(ctx, state, dispatch))

  // if (!state.running) return
  ctx.fillStyle = clearColor
  // if (state.clearFrames) clear(ctx)
  clear(ctx)

  ctx.fillStyle = 'grey'
  ctx.strokeStyle = 'yellow'

  ctx.font = '48px sans-serif'
  ctx.fillText(state.count, 100, 100)

  // if (Math.random() < 0.1) dispatch('plus')

  entities.forEach(entity => entity.display(ctx))
  // entities.forEach(entity => entity.displayDebug(ctx))
}

export function init(state, dispatch) {
  const canvas = document.getElementById('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  for (let i = 0; i < NUM_ENTITIES; i++) entities.push(
    new Bouncy(width * Math.random(), height * Math.random(), 15 + 15 * Math.random())
  )

  requestAnimationFrame(() => renderloop(context, state, dispatch))
  setInterval(() => mainloop(state, dispatch), 1000 / 60)
}