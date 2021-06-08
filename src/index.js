import '@style/style.scss'
import App from '@js/App'
import Assets from './js/Tools/Loader'

const createApp = () => {
  new App({
    canvas: document.querySelector('#_canvas'),
    assets: assets
  })
}

const assets = new Assets()
const setLoader = () => {
  let loadDiv = document.querySelector('#loader')
  let timerContainer = document.querySelector('#timerContainer')
  let headphones = document.querySelector('#headphones')

  if (assets.total === 0) {
    createApp()
    loadDiv.remove()
  }

  assets.on('ressourcesReady', () => {
    createApp()
    timerContainer.classList.add('fadeout')
    headphones.classList.add('fadeout')
      setTimeout(() => {
        loadDiv.classList.add('openScene')
        setTimeout(() => {
          loadDiv.remove()
        }, 1000)
      }, 2000)
  })
}


setLoader()



