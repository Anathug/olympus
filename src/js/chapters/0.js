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
  console.log(interaction)
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
  const images = importAll(require.context('../../images/chapter_0', false, /\.(png|jpe?g|svg)$/));
  const section = document.querySelector('.chapter_0')

  images.forEach((image, i) => {

    const img = document.createElement('img')
    img.src = image.default
    img.classList.add(`img`)
    img.classList.add(`img-${i}`)
    section.appendChild(img);

    const threeimg = new Image(img)
    threeimg.createImage(camera)
    c.objects.push(threeimg.mesh)
    c.world.container.add(threeimg.container)
  })

}

function importAll(r) {
  return r.keys().map(r);
}


export default c;
