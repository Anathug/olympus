// import Time from '@tools/Time'
import lerp from '../js/Tools/Lerp'
import clamp from '../js/Tools/Clamp'
// import Chapter from './Chapter'
import regeneratorRuntime from "regenerator-runtime";


//import * as chapters from './chapters'

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

    this.globProgress = 0
    this.realProgress = 0
    this.chapProgress = 0
    this.currentChapter = 0

    this.chapters = []

    this.chapters = this.importAll()
    this.updateProgress = this.updateProgress.bind(this)
    this.updateCurrentChapter = this.updateCurrentChapter.bind(this)
    this.mouseWheel = this.mouseWheel.bind(this)
  }

  setUI() {
    this.infoSpan = document.getElementById('info')
    this.globProgressLabel = document.createElement('p')
    this.chapProgressLabel = document.createElement('p')
    this.realProgressLabel = document.createElement('p')
    this.chapLabel = document.createElement('p')
    this.infoSpan.append(this.realProgressLabel, this.globProgressLabel, this.chapProgressLabel, this.chapLabel)

    this.timelineSlider = document.getElementById('timelineSlider');
    this.timelineSlider.max = this.chapters.length
    this.timelineSlider.addEventListener("input", () => {
      this.realProgress = parseFloat(this.timelineSlider.value)
      this.updateCurrentChapter()
    });
  }

  setup() {
    this.setUI()
    this.chapters[this.currentChapter].start()
    this.time.on('tick', () => {
      this.updateProgress()
      this.updateCurrentChapter()
    })
    window.addEventListener('mousewheel', e => this.mouseWheel(e))
  }

  updateCurrentChapter() {
    if (!this.chapters[this.currentChapter]) return
    this.chapters[this.currentChapter].update()
  }

  updateProgress() {
    this.chapters[this.currentChapter].progress = this.chapProgress
    this.globProgress = lerp(this.globProgress, this.realProgress, 0.03)
    this.chapProgress = this.globProgress % 1
    if (this.currentChapter != Math.floor(this.globProgress)) {
      this.chapters[this.currentChapter].end()
      this.currentChapter = Math.floor(this.globProgress)

      this.chapters[this.currentChapter].start()
    }

    this.realProgressLabel.textContent = 'real progress: ' + Math.round(this.realProgress * 100) / 100
    this.globProgressLabel.textContent = 'glob progress: ' + Math.round(this.globProgress * 100) / 100
    this.chapProgressLabel.textContent = 'chap progress: ' + Math.round(this.chapProgress * 100) / 100
    this.chapLabel.textContent = 'chap : ' + this.currentChapter
  }

  mouseWheel(event) {
    this.realProgress += event.deltaY / 2000
    this.realProgress = clamp(this.realProgress, 0, this.chapters.length)
    this.timelineSlider.value = this.realProgress
    this.updateCurrentChapter()
  }

  async importAll() {
    let r = require.context('./chapters/', true, /\.js$/)
    let a = []
    r.keys().forEach(k => {
      import(`./chapters${k.substring(1)}`)
        .then(chap => {
          chap.default.scene = this.scene
          chap.default.world = this.world
          chap.default.init(this.options)
          a.push(chap.default)
          if (a.length == r.keys().length) {
            this.chapters = a
            this.setup()
          }
        })
    });
  }



}

