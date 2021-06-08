import Chapter from '../Chapter'
import gsap from 'gsap'
import data from '../../../static/database/chap0'
import clamp from '../Tools/Clamp'
import SoundButton from '../SoundButton'

const c = new Chapter(0)
const expositionImagesContainer = document.querySelector('.exposition-images-container')
const images = document.querySelectorAll('.exposition-images img')
const imagePosition = []
const soundButton = new SoundButton()

c.init = () => {
  c.unnormalizedMouse = c.mouse.unnormalizedMouse
  c.mouse = c.mouse.mouse
  c.currentImageIndex = 0
  c.opened = false
  c.objects.forEach(object => {
    object.visible = false
  })
  createInfos()
  createImagePosition()
}

c.start = () => {
  setEvents()
  gsap.ticker.add(soundButton.draw)
  c.showChapter('chapter_0')
  c.time.stopTicker()
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {}

c.end = () => {
  removeEvents()
  c.hideChapter('chapter_0')
  c.objects.forEach(object => {
    object.visible = false
  })
}

const mouseMove = () => {
  gsap.to(expositionImagesContainer, {
    x: -c.mouse.x * 100,
    y: c.mouse.y * 100,
    duration: 1,
    ease: 'power3.out',
  })

  if (!c.opened) {
    images.forEach((image, i) => {
      const distance = calculateDistance(images[i], c.unnormalizedMouse.x, c.unnormalizedMouse.y)
      const normalizedDistance = clamp(
        1,
        (window.innerWidth - distance) / window.innerWidth + 0.2,
        1.2
      )
      gsap.to(image, {
        scale: normalizedDistance,
        duration: 1,
        ease: 'power3.out',
      })
    })
  }
}

const setEvents = () => {
  const blackoverlaybutton = document.querySelector('.black-overlay button')
  blackoverlaybutton.addEventListener('click', () => hideInfos(c.currentImageIndex))
  const startexperience = document.querySelector('.start-experience')
  startexperience.addEventListener('click', () => chapterEnd())

  window.addEventListener('mousemove', mouseMove)

  images.forEach(image => {
    image.addEventListener('click', () => showInfos(image.dataset.index, image))
  })
}

const removeEvents = () => {
  window.removeEventListener('mousemove', mouseMove)
}

const createImagePosition = () => {
  images.forEach(image => {
    const imageBCR = image.getBoundingClientRect()

    let imageParam = {
      imageH: imageBCR.height,
      imageW: imageBCR.width,
      imageTop: imageBCR.top,
      imageLeft: imageBCR.left,
    }
    const imageCenter = {
      x: imageParam.imageLeft + imageParam.imageW / 2,
      y: imageParam.imageTop + imageParam.imageH / 2,
    }
    const trueImageCenter = { x: 0, y: 0 }
    imageParam.imageCenter = imageCenter
    imageParam.trueImageCenter = trueImageCenter

    imagePosition.push(imageParam)
  })
}

const chapterEnd = () => {
  const toplayout = document.querySelector('.movie-layout .top')
  const bottomlayout = document.querySelector('.movie-layout .bottom')

  toplayout.classList.add('is-active')
  bottomlayout.classList.add('is-active')

  setTimeout(() => {
    toplayout.classList.add('is-leaving')
    bottomlayout.classList.add('is-leaving')
    c.time.setTicker()
  }, 2000)

  c.nextChapter()
}

const showInfos = (i, image) => {
  c.opened = true
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  c.currentImageIndex = i

  const toImageDom = container.querySelector('img')
  const toImageBCR = toImageDom.getBoundingClientRect()

  const toImageH = toImageBCR.height
  const toImageW = toImageBCR.width
  const toImageTop = toImageBCR.top
  const toImageLeft = toImageBCR.left

  const fromImageBCR = image.getBoundingClientRect()

  const fromImageH = fromImageBCR.height
  const fromImageW = fromImageBCR.width
  const fromImageTop = fromImageBCR.top
  const fromImageLeft = fromImageBCR.left

  const transformOrigin = '0% 0%'

  const tl = gsap.timeline()

  tl.addLabel('setImage')
  tl.set(toImageDom, {
    transformOrigin,
    transform: 'translate(0%, 0%) rotate(-10deg)',
    width: fromImageW,
    height: fromImageH,
    left: fromImageLeft,
    top: fromImageTop,
  })

  tl.to(toImageDom, {
    width: toImageW,
    height: toImageH,
    top: toImageTop,
    left: toImageLeft,
    transform: 'rotate(0deg)',
    duration: 1,
    ease: 'power3.out',
  })

  blackoverlay.classList.add('is-active')
  container.classList.add('is-active')
}

const hideInfos = i => {
  c.opened = false
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  blackoverlay.classList.remove('is-active')
  container.classList.remove('is-active')
}

const calculateDistance = (elem, mouseX, mouseY) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(
        mouseX - (elem.getBoundingClientRect().left + elem.getBoundingClientRect().width / 2),
        2
      ) +
        Math.pow(
          mouseY - (elem.getBoundingClientRect().top + elem.getBoundingClientRect().height / 2),
          2
        )
    )
  )
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

export default c
