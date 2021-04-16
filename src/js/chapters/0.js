import Chapter from '../Chapter'
import Image from '../World/chapter_0/Image.js'
import gsap from 'gsap'
import { Interaction } from '../../assets/lib/threeinteraction'

let c = new Chapter(0)
let defaultScaleValues;
let interaction;

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.world = options.world
  c.scene = options.scene
  c.assets = options.assets.textures.images.chapter0
  c.renderer = c.world.renderer
  c.mouse = c.world.mouse.mouse
  createImages(c.camera)
}

c.start = () => {
  setEvent()
  defaultScaleValues = c.objects.map(object => object.scale)
  interaction = new Interaction(c.renderer, c.scene, c.camera);
  c.objects.forEach(chapterImage => {
    chapterImage.visible = true
  })
}

c.update = () => {
  mouseMove(c.camera)
}

c.end = () => {
  interaction.destroy()
  c.objects.forEach(chapterImage => {
    chapterImage.visible = false
  })
}

const mouseMove = (camera) => {
  gsap.to(camera.position, {
    x: c.mouse.x * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    y: c.mouse.x / 6,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.to(camera.position, {
    y: c.mouse.y * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    x: -c.mouse.y / 6,
    duration: 1,
    ease: 'power3.out'
  })
}

const setEvent = () => {
  for (let i = 0; i < c.objects.length; i++) {
    c.objects[i].on('mouseover', () => scaleUp(c.objects[i], i))
    c.objects[i].on('mouseout', () => scaleDown(c.objects[i], i))
  }
}

const scaleUp = (mesh, i) => {
  let scaleX = defaultScaleValues[i].x
  let scaleY = defaultScaleValues[i].y
  gsap.to(mesh.scale, {
    x: scaleX * 1.1,
    y: scaleY * 1.1,
    duration: 0.3
  })
}

const scaleDown = (mesh, i) => {
  let scaleX = defaultScaleValues[i].x
  let scaleY = defaultScaleValues[i].y
  gsap.to(mesh.scale, {
    x: scaleX * 0.9,
    y: scaleY * 0.9,
    duration: 0.3
  })
}

const createImages = (camera) => {
  const images = document.querySelectorAll('.chapter_0 img')
  images.forEach((image, i) => {
    const threeimg = new Image(image, c.assets[i])
    threeimg.createImage(camera)
    c.objects.push(threeimg.mesh)
    c.world.container.add(threeimg.container)
  })
}

export default c;
