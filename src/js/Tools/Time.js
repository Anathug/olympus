// Steal from https://github.com/brunosimon/folio-2019
import EventEmitter from './EventEmitter'
import gsap from 'gsap'

export default class Time extends EventEmitter {
  constructor() {
    // Get parent methods
    super()

    // Set up
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    this.tick = this.tick.bind(this)
    this.setTicker = this.setTicker.bind(this)
    this.startTicker = this.startTicker.bind(this)
    this.stopTicker = this.stopTicker.bind(this)
    this.setTicker()
  }

  setTicker() {
    gsap.ticker.add(this.startTicker)
  }
  startTicker() {
    this.tick()
    this.trigger('tick')
  }
  // on('tick')
  tick() {
    // Get current time
    const current = Date.now()
    // delta
    this.delta = current - this.current
    // elapsed = time between start and now
    this.elapsed = current - this.start
    // current = current time
    this.current = current

    if (this.delta > 60) {
      this.delta = 60
    }
    // Add trigger event
    this.trigger('tick')
  }

  // Cancel animation frame
  stopTicker() {
    gsap.ticker.add(this.startTicker)
  }
}
