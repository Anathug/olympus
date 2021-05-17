import Chapter from '../Chapter'
import Image from '../World/chapter_0/Image'
import Background from '../World/chapter_0/Background'
import gsap from 'gsap'
import { Interaction } from '../../assets/lib/threeinteraction'
import data from '../../../static/database/chap0'


let c = new Chapter(0)
let defaultScaleValues
let interaction
let imagesArray = []

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.starship = options.starship
  c.world = options.world
  c.scene = options.scene
  c.assets = options.assets.textures.chapter0
  c.debug = options.debug
  c.renderer = c.world.renderer
  c.mouse = c.world.mouse.mouse
  c.allowScroll = true
  c.currentImageIndex = null

  const blackoverlaybutton = document.querySelector('.black-overlay button')
  blackoverlaybutton.addEventListener('click', () => hideInfos(c.currentImageIndex))

  createImages(c.camera)
  createBackground(options)
  createInfos()
  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.starship.container.visible = false
  interaction = new Interaction(c.renderer, c.scene, c.camera);
  setEvent()
  defaultScaleValues = c.objects.map(object => object.scale)
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
  if (!c.debug) {
    mouseMove(c.camera)
  }
}

c.end = () => {
  interaction.destroy()
  c.objects.forEach(object => {
    object.visible = false
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
  for (let i = 0; i < imagesArray.length; i++) {
    imagesArray[i].on('mouseover', () => scaleUp(imagesArray[i], i))
    imagesArray[i].on('mouseout', () => scaleDown(imagesArray[i], i))
    imagesArray[i].on('click', (e) => showInfos(e.data.target.index))
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
    const imageName = `board-${i + 1}`
    const threeimg = new Image(image, c.assets[imageName])
    threeimg.createImage(camera)
    threeimg.mesh.index = i
    threeimg.setPosition()
    c.objects.push(threeimg.mesh)
    imagesArray.push(threeimg.mesh)
    c.world.container.add(threeimg.container)
  })
}

const createBackground = (options) => {
  const background = new Background(options)
  c.background = background
  c.objects.push(background.mesh)
  c.world.container.add(background.container)
}

const showInfos = (i) => {
  interaction.destroy()
  c.currentImageIndex = i
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  blackoverlay.classList.add('is-active')
  container.classList.add('is-active')
}

const hideInfos = (i) => {
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  blackoverlay.classList.remove('is-active')
  container.classList.remove('is-active')
  interaction = new Interaction(c.renderer, c.scene, c.camera);
  setEvent()
}

const createInfos = () => {
  const container = document.querySelector('.zoomed-image-container')

  data.images.forEach((image, i) => {

    const indexdiv = document.createElement('div')
    indexdiv.classList.add(`container`)
    indexdiv.classList.add(`container-${i}`)

    const left = document.createElement('div')
    left.classList.add('left-container')

    const right = document.createElement('div')
    right.classList.add('right-container')

    indexdiv.appendChild(left)
    indexdiv.appendChild(right)

    container.appendChild(indexdiv)

    const innerright = document.createElement('div')
    innerright.classList.add('right')

    const innerleft = document.createElement('div')
    innerleft.classList.add('left')

    const img = document.createElement('img')
    img.src = image.src

    innerleft.appendChild(img)

    const infos = document.createElement('div')
    infos.classList.add('infos')

    const h2 = document.createElement('h2')
    h2.innerHTML = image.title


    const p = document.createElement('p')
    p.innerHTML = image.description

    infos.appendChild(h2)
    infos.appendChild(p)

    innerright.appendChild(infos)

    left.appendChild(innerleft)
    right.appendChild(innerright)
  })

}

export default c;
