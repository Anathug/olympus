import SoundButton from './SoundButton'

export default class GlobalInteractions {
  constructor(options) {
    console.log(options);
    this.time = options.time
    this.sizes = options.sizes
    this.mouse = options.mouse
    this.autoScrollButtonOn = document.querySelector('.top-right-wrapper .on')
    this.autoScrollButtonOff = document.querySelector('.top-right-wrapper .off')
    this.timeLayout = document.querySelector('.bottom-right-wrapper .infos:nth-child(1) .pas-infos-details')
    this.velocityLayout = document.querySelector('.bottom-right-wrapper .infos:nth-child(2) .infos-details')
    this.distanceLayout = document.querySelector('.bottom-right-wrapper .infos:nth-child(3) .infos-details')
    this.chapterTransition = document.querySelector('.chapter-transition p')

    this.soundButton = new SoundButton()
    this.updateVelocityLayout = this.updateVelocityLayout.bind(this)
    this.updateDistanceLayout = this.updateDistanceLayout.bind(this)
    this.transitionTitle = this.transitionTitle.bind(this)
    this.setEvent()
  }

  setEvent() {
    this.autoScrollButtonOn.addEventListener('click', () => this.autoScrollOn())
    this.autoScrollButtonOff.addEventListener('click', () => this.autoScrollOff())
    this.time.on('tick', () => {
      this.soundButton.draw()
    })
    setInterval(() => {
      this.updateTimeLayout(new Date())
    }, 1000);
  }

  autoScrollOn() {
    this.autoScrollButtonOff.classList.remove('is-active')
    this.autoScrollButtonOn.classList.add('is-active')
  }

  autoScrollOff() {
    this.autoScrollButtonOn.classList.remove('is-active')
    this.autoScrollButtonOff.classList.add('is-active')
  }

  updateTimeLayout(date) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const formatedHours = this.checkDecimals(hours)
    const formatedMinutes = this.checkDecimals(minutes)
    const formatedSeconds = this.checkDecimals(seconds)

    this.timeLayout.innerHTML = `+${formatedHours} ${formatedMinutes} ${formatedSeconds}`
  }

  updateVelocityLayout(number) {
    this.velocityLayout.innerHTML = `${number} km/h`
  }

  updateDistanceLayout(number) {
    this.distanceLayout.innerHTML = `${number} km`
  }

  transitionTitle(string) {
    this.chapterTransition.innerHTML = string
  }

  checkDecimals(number) {
    number.toString().length === 1 ? number = `0${number}` : ''
    return number
  }
}
