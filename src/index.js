import '@style/style.scss'
import App from '@js/App'
import Assets from './js/Tools/Loader'
import GlobalInteractions from './js/GlobalInteractions'
import Sizes from './js/Tools/Sizes'
import Time from './js/Tools/Time'
import Mouse from './js/Mouse'
import SoundHandler from './js/Tools/SoundHandler'
import SubtitlesHandler from './js/Tools/SubtitlesHandler'


const time = new Time()
const sizes = new Sizes()
const mouse = new Mouse()
const assets = new Assets()

let soundHandlers = []
let subtitlesHandlers = []
let loadedSound = 0


const createApp = () => {
  new App({
    canvas: document.querySelector('#_canvas'),
    assets: assets,
    time: time,
    sizes: sizes,
    mouse: mouse,
    soundHandlers: soundHandlers,
    subtitlesHandlers: subtitlesHandlers
  })
}

const createGlobalInteractions = () => {
  new GlobalInteractions({
    time: time,
    sizes: sizes,
    mouse: mouse
  })
}

const createAudio = () => {
  for (let i = 0; i <= 4; i++) {
    soundHandlers.push(new SoundHandler(`./sounds/chap0${i}.mp3`, `./sounds/chap0${i}_r.mp3`))
    soundHandlers[i].soundN.once('load', () => {
      loadedSound++
      if (loadedSound == 8) {
        setLoader()
      }
    })
    soundHandlers[i].soundR.once('load', () => {
      loadedSound++
      if (loadedSound == 8) {
        setLoader()
      }
    })
  }
}

const createSubtitles = () => {
  for (let i = 0; i <= 4; i++) {
    if (i != 1) {
      subtitlesHandlers.push(new SubtitlesHandler(`./subtitles/chap0${i}.tsv`))
    } else {
      subtitlesHandlers.push(null)
    }
  }
}

createSubtitles()

const setLoader = () => {
  let loadDiv = document.querySelector('#loader')
  let timerContainer = document.querySelector('#timerContainer')
  let headphones = document.querySelector('#headphones')
  const loaderLineWrapper = document.querySelector('.loaderLine')

  assets.on('ressourcesReady', () => {

    headphones.classList.add('fadeout')

    timerContainer.classList.add('fadeout')

    loaderLineWrapper.style.opacity = 0
    createApp()
    createGlobalInteractions()
    setTimeout(() => {
      loadDiv.classList.add('openScene')
      setTimeout(() => {
        loadDiv.remove()
      }, 2000)
    }, 3000)
  })
}

createAudio()
