import lerp from '../js/Tools/Lerp'
import ease from '../js/Tools/Ease'
import clamp from '../js/Tools/Clamp'
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
    this.mars = options.mars

    this.allowScroll = false;
    this.autoScroll = false;
    this.autoScrollSpeed = 0.0001
    this.workingChapter = 0

    this.chapProgress = 0
    this.globProgress = this.workingChapter
    this.realProgress = this.workingChapter
    this.currentChapter = this.workingChapter

    this.chapters = []
    this.chapters = this.importAll()

    this.nextChapter = this.nextChapter.bind(this)
    this.showChapter = this.showChapter.bind(this)
    this.hideChapter = this.hideChapter.bind(this)
    this.showObjects = this.showObjects.bind(this)
    this.hideObjects = this.hideObjects.bind(this)
    this.updateProgress = this.updateProgress.bind(this)
    this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.mouseWheel = this.mouseWheel.bind(this)

  }

  setUI() {
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
      title.textContent = `Chapter ${chap.index + 1}`
      title.onclick = () => { this.realProgress = chap.index + 0.01 }

      let subtitle = document.createElement('span')
      subtitle.classList.add('timelineSubtitle')
      subtitle.textContent = chap.title

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
    this.time.on('tick', () => {
      this.updateProgress()
      this.updateCurrentChapter()
    })
    window.addEventListener('mousewheel', e => this.mouseWheel(e))
    this.time.on('tick', () => {
      if (!this.autoScroll) return;
      this.realProgress = clamp(
        (this.realProgress += this.autoScrollSpeed),
        0,
        this.chapters.length - 0.001
      )
    })
  }

  updateCurrentChapter() {
    if (!this.chapters[this.currentChapter]) return
    this.chapters[this.currentChapter].update()
  }

  updateProgress() {
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
    this.chapProgress = this.globProgress % 1
    this.chapters[this.currentChapter].progress = this.chapProgress

    if (this.currentChapter != Math.floor(this.globProgress)) {
      this.chapters[this.currentChapter].end()
      this.timelineChapElems[this.currentChapter].classList.remove('current')

      this.currentChapter = Math.floor(this.globProgress)
      this.chapters[this.currentChapter].start()
      this.timelineChapElems[this.currentChapter].classList.add('current')
      this.timelineChapDisplay.innerHTML = this.timelineChapElems[this.currentChapter].innerHTML
    }
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

  mouseWheel(event) {
    if (!this.allowScroll) return;
    this.realProgress = clamp(
      (this.realProgress += event.deltaY * 0.0001),
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

        chap.default.nextChapter = this.nextChapter
        chap.default.showChapter = this.showChapter
        chap.default.hideChapter = this.hideChapter
        chap.default.showObjects = this.showObjects
        chap.default.hideObjects = this.hideObjects
        chap.default.progress = 0
        chap.default.init(this.options)
        a.push(chap.default)
        if (a.length == r.keys().length) {
          this.chapters = a
          this.setup()
        }
      })
    })
  }
}
