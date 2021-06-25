import '@style/style.scss'
import App from '@js/App'
import Assets from './js/Tools/Loader'
import GlobalInteractions from './js/GlobalInteracions'
import Sizes from './js/Tools/Sizes'
import Time from './js/Tools/Time'
import Mouse from './js/Mouse'
import Howl from 'howler'

const time = new Time()
const sizes = new Sizes()
const mouse = new Mouse()

const createApp = () => {
  new App({
    canvas: document.querySelector('#_canvas'),
    assets: assets,
    time: time,
    sizes: sizes,
    mouse: mouse
  })
}

const createGlobalInteractions = () => {
  new GlobalInteractions({
    time: time,
    sizes: sizes,
    mouse: mouse
  })
}

const assets = new Assets()
const setLoader = () => {
  let loadDiv = document.querySelector('#loader')
  let timerContainer = document.querySelector('#timerContainer')
  let headphones = document.querySelector('#headphones')
  let clickToStart = document.querySelector('#clickToStart')

  assets.on('ressourcesReady', () => {

    headphones.classList.add('fadeout')
    clickToStart.classList.add('fadein')

    const onStart = () => {
      timerContainer.classList.add('fadeout')
      clickToStart.classList.remove('fadein')

      createApp()
      createGlobalInteractions()
      setTimeout(() => {
        loadDiv.classList.add('openScene')
        setTimeout(() => {
          loadDiv.remove()
        }, 1000)
      }, 2000)
    }

    document.addEventListener("click", onStart, { once: true })

  })
}


setLoader()