import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock } from 'three'
import gsap from 'gsap'

let c = new Chapter(1)
let updateThrusters = false
const startButton = document.querySelector('.chapter_1 button')
let clock = new Clock()

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.mouse = c.world.mouse.mouse
  c.debug = options.debug
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
  c.allowScroll = false
  c.allowMouseMove = false

  c.launcher = new Launcher({
    time: options.time,
    assets: options.assets,
    world: options.world,
    debug: options.debug
  })

  c.objects.push(c.launcher.container)
  c.world.container.add(c.launcher.container)
  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.showChapter('chapter_1')
  setEvents()
  c.starship.container.visible = true
  c.starship.createStarship()
  c.starship.createThrusters()
  c.starship.container.position.set(0, 0, 0)
  c.objects.forEach(object => {
    object.visible = true
  })
  chapterBegin()
}

c.update = () => {
  if (!c.debug && c.allowMouseMove) {
    // mouseMove(c.camera)
  }
  if (updateThrusters) {
    c.starship.container.position.y = clock.getElapsedTime()
    c.camera.position.y = clock.getElapsedTime()
    c.starship.thrusters.update()
  }
}

c.end = () => {
  removeEvents()
  c.hideChapter('chapter_1')
  removeStarship()
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  });
}

const chapterBegin = () => {
  const beginnintl = gsap.timeline({ ease: "power2.inOut" })
  c.camera.rotation.set(0, -7.9, 0)
  c.camera.position.set(-2, 7, 0)

  beginnintl
    .to(c.camera.position, {
      y: 1,
      delay: 0.5,
      duration: 5,
    })
    .to(c.camera.position, {
      x: -13,
      duration: 4,
    }, 4)

  setTimeout(() => {
    c.allowMouseMove = true
  }, 9000);
}

const setEvents = () => {
  startButton.addEventListener('click', launchStarship)
}

const removeEvents = () => {
  startButton.removeEventListener('click', launchStarship)
}

const mouseMove = (camera) => {
  gsap.to(camera.position, {
    x: -2 + c.mouse.x * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    y: -7.9 + c.mouse.x / 6,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.to(camera.position, {
    y: 7 + c.mouse.y * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    x: -c.mouse.y / 6,
    duration: 1,
    ease: 'power3.out'
  })
}

const removeStarship = () => {
  c.starship.thrusters.renderers[0].container.clear()
  c.starship.thrusters.destroy()
  updateThrusters = false
}

const launchStarship = () => {
  clock.start()
  c.allowMouseMove = false
  c.allowScroll = true
  updateThrusters = true
}

export default c;
