import Chapter from '../Chapter'
import Cockpit from '../World/chapter_1/Cockpit'
import gsap from 'gsap'

let c = new Chapter(1)
const startButton = document.querySelector('.chapter_1 button')

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.world = options.world
  c.mouse = c.world.mouse.mouse
  c.starship = options.starship
  c.mars = options.mars
  c.debug = options.debug
  c.allowMouseMove = false

  c.cockpit = new Cockpit(options)
  c.objects.push(c.cockpit.container)
  c.world.container.add(c.cockpit.container)

  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  setCameraPosition()
  setEvents()
  c.allowMouseMove = true
  c.showChapter('chapter_1')
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
  if (!c.debug && c.allowMouseMove) {
    // mouseMove(c.camera)
  }
}

c.end = () => {
  removeEvents()
  c.hideChapter('chapter_1')
  c.objects.forEach(object => {
    object.visible = false
  });
}

const setCameraPosition = () => {
  c.camera.position.set(0, 0.3, 1.3)
  c.camera.rotation.x = -0.1
}

const mouseMove = (camera) => {
  gsap.to(camera.position, {
    x: c.mouse.x / 5,
    duration: 2,
    ease: 'power3.out'
  })
}

const setEvents = () => {
  startButton.addEventListener('click', chapterEnd)
}

const removeEvents = () => {
  startButton.removeEventListener('click', chapterEnd)
}

const chapterEnd = () => {
  c.nextChapter()
}


export default c;
