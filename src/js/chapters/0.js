import Chapter from '../Chapter'
import gsap from 'gsap'
import data from '../../../static/database/chap0'
import clamp from '../Tools/Clamp'


const c = new Chapter(0)
const expositionImagesContainer = document.querySelector('.exposition-images-container')
const images = document.querySelectorAll('.exposition-images img')
const imagePosition = []


c.init = () => {
  c.unnormalizedMouse = c.mouse.unnormalizedMouse
  c.mouse = c.mouse.mouse
  c.currentImageIndex = 0
  c.objects.forEach(object => {
    object.visible = false
  })
  createInfos()
  createImagePosition()

}

c.start = () => {
  setEvents()
  c.showChapter('chapter_0')
  c.time.stopTicker()
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
}

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
    ease: 'power3.out'
  })

  images.forEach((image, i) => {
    const distance = calculateDistance(images[i], c.unnormalizedMouse.x, c.unnormalizedMouse.y)
    const normalizedDistance = clamp(1, (window.innerWidth - distance) / window.innerWidth + 0.2, 1.2)

    gsap.to(image, {
      scale: normalizedDistance,
      duration: 1,
      ease: 'power3.out'
    })
  })


}

const setEvents = () => {
  const blackoverlaybutton = document.querySelector('.black-overlay button')
  blackoverlaybutton.addEventListener('click', () => hideInfos(c.currentImageIndex))
  const startexperience = document.querySelector('.start-experience')
  startexperience.addEventListener('click', () => chapterEnd())

  window.addEventListener('mousemove', mouseMove)

  images.forEach(image => {
    image.addEventListener('click', () => showInfos(image.dataset.index))
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
    const imageCenter = { x: imageParam.imageLeft + imageParam.imageW / 2, y: imageParam.imageTop + imageParam.imageH / 2 }
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

  }, 2000);

  c.nextChapter()
}

const showInfos = (i) => {
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  c.currentImageIndex = i
  blackoverlay.classList.add('is-active')
  container.classList.add('is-active')
}

const hideInfos = (i) => {
  const blackoverlay = document.querySelector('.black-overlay')
  const container = document.querySelector(`.container-${i}`)
  blackoverlay.classList.remove('is-active')
  container.classList.remove('is-active')
}

const calculateDistance = (elem, mouseX, mouseY) => {
  return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.getBoundingClientRect().left + (elem.getBoundingClientRect().width / 2)), 2) + Math.pow(mouseY - (elem.getBoundingClientRect().top + (elem.getBoundingClientRect().height / 2)), 2)));
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
