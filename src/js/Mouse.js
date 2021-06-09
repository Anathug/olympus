import threeDecimals from './Tools/Decimals'

export default class Mouse {
  constructor() {
    this.mouse = { x: 0, y: 0 }
    this.unnormalizedMouse = { x: 0, y: 0 }
    this.layoutHorizontalLine = document.querySelector('.experience-layout .horizontal-line')
    this.layoutVerticalLine = document.querySelector('.experience-layout .vertical-line')
    this.layoutCoordinate = document.querySelector('.experience-layout .coordinate')
    this.layoutCoordinateX = this.layoutCoordinate.querySelector('.x')
    this.layoutCoordinateY = this.layoutCoordinate.querySelector('.y')
    this.mouseMove = this.mouseMove.bind(this)
    this.setEvent()
  }

  setEvent() {
    window.addEventListener('mousemove', this.mouseMove)
  }

  mouseMove(e) {
    this.unnormalizedMouse.x = e.clientX
    this.unnormalizedMouse.y = e.clientY
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.layoutVerticalLine.style.transform = `translateX(${this.unnormalizedMouse.x}px)`
    this.layoutHorizontalLine.style.transform = `translateY(${this.unnormalizedMouse.y}px)`

    this.layoutCoordinate.style.transform = `translate3d(${this.unnormalizedMouse.x}px, ${this.unnormalizedMouse.y}px, 0)`

    this.layoutCoordinateX.innerHTML = `x: ${threeDecimals(this.mouse.x)}`
    this.layoutCoordinateY.innerHTML = `y: ${threeDecimals(-this.mouse.y)}`
  }
}
