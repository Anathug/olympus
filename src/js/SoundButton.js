import gsap from 'gsap'

export default class SoundButton {
  constructor() {
    this.canvas = document.querySelector('#sound')
    this.context = this.canvas.getContext('2d')
    this.canvas.middle = this.canvas.height / 2
    this.wave = {
      yPosition: this.canvas.middle,
      length: 0.5,
      amplitude: 10,
      frequency: 0.1,
    }
    this.increment = this.wave.frequency
    this.draw = this.draw.bind(this)
    this.toggleSound = this.toggleSound.bind(this)
    this.soundOn = true

    this.setEvents()
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.beginPath()
    this.context.strokeStyle = 'white'
    this.context.lineWidth = 1
    this.context.moveTo(0, this.canvas.height / 2)
    for (let i = 0; i < this.canvas.width; i++) {
      this.context.lineTo(
        i,
        this.wave.yPosition + Math.sin(i * this.wave.length + this.increment) * this.wave.amplitude
      )
    }
    this.context.stroke()
    this.increment += this.wave.frequency
  }

  setEvents() {
    this.canvas.addEventListener('click', this.toggleSound)
  }

  toggleSound() {
    if (this.soundOn) {
      gsap.to(this.wave, {
        amplitude: 0,
        ease: 'power3.out',
      })
      this.soundOn = false
    } else {
      gsap.to(this.wave, {
        amplitude: 10,
        ease: 'power3.out',
      })
      this.soundOn = true
    }
  }
}
