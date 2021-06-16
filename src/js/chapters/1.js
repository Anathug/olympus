import Chapter from '../Chapter'
import Cockpit from '../World/chapter_1/Cockpit'
import gsap from 'gsap'

let c = new Chapter(1)
c.title = 'Step A01'
c.subtitle = 'Pre-launch countdown'
c.timelineColor = '#2ecc71'
const startButton = document.querySelector('.chapter_1 button')

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.world = options.world
  c.mouse = c.world.mouse.mouse
  c.debug = options.debug
  c.allowMouseMove = false
  createCockpit(options)
  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_1')
  c.showObjects(c.objects)
  c.allowMouseMove = true
  setCameraPosition()
  setEvents()
}

c.update = () => {
  if (!c.debug && c.allowMouseMove) {
    // mouseMove(c.camera)
  }
}

c.end = () => {
  c.hideChapter('chapter_1')
  c.hideObjects(c.objects)
  removeEvents()
}

const setCameraPosition = () => {
  c.camera.position.set(0, 0.3, 1.3)
  c.camera.rotation.x = -0.1
}

const createCockpit = (options) => {
  c.cockpit = new Cockpit(options)
  c.objects.push(c.cockpit.container)
  c.world.container.add(c.cockpit.container)
}
const mouseMove = (camera) => {
  gsap.to(camera.position, {
    x: c.mouse.x / 5,
    duration: 2,
    ease: 'power3.out'
  })
}

const setEvents = () => {
  startButton.addEventListener('click', chapterEnd, {
    once: true
  })
}

const removeEvents = () => {
  startButton.removeEventListener('click', chapterEnd)
}

const chapterEnd = () => {
  c.nextChapter()
}


export default c;
