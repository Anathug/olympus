export default class Mouse {
  constructor() {
    this.mouse = { x: 0, y: 0 }
    this.mouseMove = this.mouseMove.bind(this)
    this.setEvent()
  }

  setEvent() {
    window.addEventListener('mousemove', this.mouseMove)
  }

  mouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
}