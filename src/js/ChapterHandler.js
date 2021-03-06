import lerp from '../js/Tools/Lerp'
import ease from '../js/Tools/Ease'
import clamp from '../js/Tools/Clamp'
import normalizeWheel from 'normalize-wheel'
import GlobalInteractions from './GlobalInteractions'

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'

export default class ChapterHandler {
  constructor(options) {
    this.options = options
    this.scene = options.scene
    this.world = options.world
    this.time = options.time
    this.assets = options.assets
    this.mouse = options.mouse
    this.scene = options.scene
    this.renderer = options.renderer
    this.debug = options.debug
    this.starship = options.starship
    this.lensflareContainer = options.lensflareContainer
    this.bloomPass = options.bloomPass
    this.soundHandlers = options.soundHandlers,
      this.subtitlesHandlers = options.subtitlesHandlers,
      this.globalInteractions = new GlobalInteractions(this.options)

    //default chapter params
    this.allowScroll = false
    this.autoScroll = false
    this.workingChapter = 0
    this.autoScrollSpeed = 0.0001

    //chapter progression
    this.chapProgress = 0
    this.globProgress = this.workingChapter
    this.realProgress = this.workingChapter
    this.currentChapter = this.workingChapter

    //import all chapters
    this.chapters = []
    this.longestDuration = 0
    this.chapters = this.importAll()

    this.chapterTransition = document.querySelector('.chapter-transition')

    this.switchHDRI = options.switchHDRI
    this.changeFog = options.changeFog
    this.nextChapter = this.nextChapter.bind(this)
    this.showChapter = this.showChapter.bind(this)
    this.hideChapter = this.hideChapter.bind(this)
    this.showObjects = this.showObjects.bind(this)
    this.hideObjects = this.hideObjects.bind(this)
    this.createCams = this.createCams.bind(this)
    this.deleteCams = this.deleteCams.bind(this)
    this.disableCam = this.disableCam.bind(this)
    this.enableCam = this.enableCam.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.mouseWheel = this.mouseWheel.bind(this)

  }

  setUI() {
    //creates timeline UI bar an populates it with the imported chapters
    this.timelineChapters = document.getElementById('timelineChapters')
    this.timelineChapElems = document.getElementsByClassName('timelineChap')
    this.timelineChapDisplay = document.getElementById('timelineChapterDisplay')
    this.chapters.forEach(chap => {
      let container = document.createElement('span')
      container.classList.add('timelineChap')

      let tri = document.createElement('span')
      tri.classList.add('timelineTriangle')

      let title = document.createElement('span')
      title.classList.add('timelineTitle')
      title.textContent = chap.title
      title.onclick = () => {
        this.realProgress = chap.index + 0.01
      }

      let subtitle = document.createElement('span')
      subtitle.classList.add('timelineSubtitle')
      subtitle.textContent = chap.subtitle

      container.append(tri, title, subtitle)
      this.timelineChapters.append(container)
    })
    this.spacing = (window.innerHeight * 0.85) / this.chapters.length
    this.timelineChapElems[this.currentChapter].classList.add('current')
    this.timelineChapDisplay.innerHTML = this.timelineChapElems[this.currentChapter].innerHTML
    this.timelineChapDisplay.style.marginTop = `${this.spacing / 2}px`
    for (let i = 0; i < this.chapters.length; i++) {
      this.timelineChapElems[i].style.marginTop = `${this.spacing / 2}px`
      this.timelineChapElems[i].style.marginBottom = `${this.spacing / 2}px`
    }
  }

  setup() {
    this.setUI()
    this.chapters[this.currentChapter].start()

    this.timelineChapDisplay.innerHTML = this.timelineChapElems[this.currentChapter].innerHTML
    this.timelineChapDisplay.childNodes[1].style.background =
      this.chapters[this.currentChapter].timelineColor

    this.time.on('tick', () => {
      this.updateProgress()
      this.updateCurrentChapter()
    })
    window.addEventListener('wheel', e => this.mouseWheel(e))
    let now = Date.now()
    this.time.on('tick', () => {
      if (!this.autoScroll) return
      let delta = Date.now() - now
      this.realProgress = clamp(
        (this.realProgress += this.autoScrollSpeed * delta / 16.7),
        0,
        this.chapters.length - 0.001
      )
      now = Date.now()
    })
  }

  updateCurrentChapter() {
    if (!this.chapters[this.currentChapter]) return
    this.chapters[this.currentChapter].update()
  }

  updateProgress() {
    //eases globProgress towards realProgress and updates timeline UI
    for (let i = 0; i < this.chapters.length; i++) {
      let c = this.timelineChapElems[i]
      let offset = i < this.currentChapter ? this.spacing : 0
      let prog = -(this.globProgress * this.spacing - 0.1) + offset
      let value = lerp(
        0,
        prog,
        ease(clamp((this.globProgress * this.spacing - 0.1) / this.spacing - i + 1, 0, 1))
      )
      c.style.transform = `translateY(${value}px`
    }
    this.globProgress = lerp(this.globProgress, this.realProgress, 0.03)

    //switches chapters when relevant
    if (this.currentChapter != Math.floor(this.globProgress)) {
      this.chapters[this.currentChapter].end()
      this.timelineChapElems[this.currentChapter].classList.remove('current')

      this.currentChapter = Math.floor(this.globProgress)
      this.chapters[this.currentChapter].start()
      this.timelineChapElems[this.currentChapter].classList.add('current')

      this.timelineChapDisplay.innerHTML = this.timelineChapElems[this.currentChapter].innerHTML
      this.timelineChapDisplay.childNodes[1].style.background =
        this.chapters[this.currentChapter].timelineColor
    }
    this.chapProgress = this.globProgress % 1
    this.chapters[this.currentChapter].progress = this.chapProgress
    // const duration = this.chapters[this.currentChapter].duration

    if (this.chapProgress > 0.95 && this.currentChapter != 4) {
      this.chapterTransition.style.opacity = (this.chapProgress - 0.95) * 40
    } else if (this.chapProgress < 0.05 && this.currentChapter != 0) {
      this.chapterTransition.style.opacity = 1 - this.chapProgress * 40
    } else {
      this.chapterTransition.style.opacity = 0
    }
  }

  updateTimelineDisplay(title, subtitle) {
    this.timelineChapDisplay.childNodes[1].textContent = title
    this.timelineChapDisplay.childNodes[2].textContent = subtitle
  }

  nextChapter() {
    this.realProgress = Math.trunc(this.realProgress) + 1.01
  }

  showChapter(chapter) {
    const chapterHTML = document.querySelector(`.${chapter}`)
    chapterHTML.classList.add('is-active')
  }

  hideChapter(chapter) {
    const chapterHTML = document.querySelector(`.${chapter}`)
    chapterHTML.classList.remove('is-active')
  }

  hideObjects(objects) {
    objects.forEach(object => {
      object.visible = false
    })
  }

  showObjects(objects) {
    objects.forEach(object => {
      object.visible = true
    })
  }

  createCams(cams) {
    cams.forEach((cam, i) => this.createCamHtml(i))
  }

  deleteCams() {
    this.deleteCamHtml()
  }

  createCamHtml(i) {
    const middleRightWrapper = document.querySelector('.middle-right-wrapper')
    const cameraWrapper = document.createElement('div')
    const overflowHiddenRelative = document.createElement('div')
    const span = document.createElement('span')
    const circle = document.createElement('div')
    const redCircle = document.createElement('div')
    const whiteCircle = document.createElement('div')

    cameraWrapper.classList.add('camera-wrapper')
    cameraWrapper.dataset.cameraIndex = i
    overflowHiddenRelative.classList.add('overflow-hidden')
    overflowHiddenRelative.classList.add('relative')
    circle.classList.add('circle')
    redCircle.classList.add('red-circle')
    whiteCircle.classList.add('white-circle')

    span.innerHTML = `cam-0${i}`

    overflowHiddenRelative.appendChild(span)
    circle.appendChild(redCircle)
    circle.appendChild(whiteCircle)

    cameraWrapper.appendChild(overflowHiddenRelative)
    cameraWrapper.appendChild(circle)

    middleRightWrapper.appendChild(cameraWrapper)

    cameraWrapper.addEventListener('click', () => {
      this.toggleCamera(cameraWrapper)
    })
  }

  deleteCamHtml() {
    const middleRightWrapper = document.querySelector('.middle-right-wrapper')
    const cameraWrappers = document.querySelectorAll('.camera-wrapper')
    cameraWrappers.forEach(cameraWrapper => middleRightWrapper.removeChild(cameraWrapper))
  }

  toggleCamera(camera) {
    const cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
    cameraButtons.forEach(cameraButton => cameraButton.classList.remove('is-active'))
    camera.classList.toggle('is-active')
    this.renderer.switchCam(this.chapters[this.currentChapter].cams[camera.dataset.cameraIndex])
    this.chapters[this.currentChapter].activeCam = Number(camera.dataset.cameraIndex)
  }

  disableCam(i) {
    const cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
    cameraButtons[i].classList.add('is-disabled')
  }

  enableCam(i) {
    const cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
    cameraButtons[i].classList.remove('is-disabled')
  }

  mouseWheel(event) {
    const normalized = normalizeWheel(event)
    if (!this.allowScroll) return
    this.realProgress = clamp(
      (this.realProgress += normalized.pixelY * 0.0001),
      0,
      this.chapters.length - 0.001
    )
  }


  setAutoScrollSpeed(duration) {
    this.autoScrollSpeed = 1 / 60 / duration
  }

  async importAll() {
    let r = require.context('./chapters/', true, /\.js$/)
    let a = []
    r.keys().forEach(k => {
      import(`./chapters${k.substring(1)}`).then(chap => {
        chap.default.handler = this

        chap.default.scene = this.scene
        chap.default.world = this.world
        chap.default.time = this.time
        chap.default.mouse = this.mouse
        chap.default.lensflareContainer = this.lensflareContainer
        chap.default.globalInteractions = this.globalInteractions
        chap.default.bloomPass = this.bloomPass

        chap.default.switchHDRI = this.switchHDRI
        chap.default.changeFog = this.changeFog
        chap.default.nextChapter = this.nextChapter
        chap.default.showChapter = this.showChapter
        chap.default.hideChapter = this.hideChapter
        chap.default.showObjects = this.showObjects
        chap.default.hideObjects = this.hideObjects
        chap.default.createCams = this.createCams
        chap.default.deleteCams = this.deleteCams
        chap.default.enableCam = this.enableCam
        chap.default.disableCam = this.disableCam
        chap.default.soundHandlers = this.soundHandlers
        chap.default.subtitlesHandlers = this.subtitlesHandlers
        chap.default.progress = 0
        chap.default.init(this.options)
        a.push(chap.default)
        // if(chap.default.animationDuration && (chap.default.animationDuration > this.longestDuration) ) {
        //   this.longestDuration = chap.default.animationDuration  
        // }
        if (a.length == r.keys().length) {
          this.chapters = a
          this.setup()
        }
      })
    })
  }
}
