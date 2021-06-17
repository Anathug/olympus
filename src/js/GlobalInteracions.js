import SoundButton from '../js/SoundButton'

export default class GlobalInteractions {
  constructor(options) {
    this.time = options.time
    this.sizes = options.sizes
    this.mouse = options.mouse
    this.autoScrollButtonOn = document.querySelector('.top-right-wrapper .on')
    this.autoScrollButtonOff = document.querySelector('.top-right-wrapper .off')
    this.soundButton = new SoundButton()
    this.setEvent()
  }

  setEvent() {
    this.autoScrollButtonOn.addEventListener('click', () => this.autoScrollOn())
    this.autoScrollButtonOff.addEventListener('click', () => this.autoScrollOff())
    this.time.on('tick', () => {
      this.soundButton.draw()
    })
  }

  autoScrollOn() {
    this.autoScrollButtonOff.classList.remove('is-active')
    this.autoScrollButtonOn.classList.add('is-active')
  }

  autoScrollOff() {
    this.autoScrollButtonOn.classList.remove('is-active')
    this.autoScrollButtonOff.classList.add('is-active')
  }
}
