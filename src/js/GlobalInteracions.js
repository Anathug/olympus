export default class GlobalInteractions {
  constructor() {
    this.cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
    this.autoScrollButtonOn = document.querySelector('.top-right-wrapper .on')
    this.autoScrollButtonOff = document.querySelector('.top-right-wrapper .off')
    this.setEvent()
  }

  setEvent() {
    this.cameraButtons.forEach((cameraButton) => cameraButton.addEventListener('click', () => this.toggleCamera(cameraButton)))
    this.autoScrollButtonOn.addEventListener('click', () => this.autoScrollOn())
    this.autoScrollButtonOff.addEventListener('click', () => this.autoScrollOff())
  }

  autoScrollOn() {
    this.autoScrollButtonOff.classList.remove('is-active')
    this.autoScrollButtonOn.classList.add('is-active')
  }

  autoScrollOff() {
    this.autoScrollButtonOn.classList.remove('is-active')
    this.autoScrollButtonOff.classList.add('is-active')
  }


  toggleCamera(camera) {
    this.cameraButtons.forEach((cameraButton) => cameraButton.classList.remove('is-active'))
    camera.classList.toggle('is-active')
  }

}
