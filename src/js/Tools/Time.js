// Steal from https://github.com/brunosimon/folio-2019
import EventEmitter from './EventEmitter'
import gsap from 'gsap'

export default class Time extends EventEmitter {
  constructor() {
    super()

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
    gsap.ticker.fps(60)
  }
  startTicker() {
    this.tick()
    // this.trigger('tick')
  }
  tick() {
    const current = Date.now()
    this.delta = current - this.current
    this.elapsed = current - this.start
    this.current = current


    if (this.delta > 60) {
      this.delta = 60
    }
    this.trigger('tick')
  }

  stopTicker() {
    gsap.ticker.remove(this.startTicker)
  }
}
