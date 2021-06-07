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
  let loadDiv = document.querySelector('#timerContainer')

  if (assets.total === 0) {
    createApp()
    loadDiv.remove()
  }

  assets.on('ressourcesReady', () => {
    setTimeout(() => {
      createApp()
      loadDiv.style.opacity = 0
      setTimeout(() => {
        loadDiv.remove()
      }, 550)
    }, 1000)
  })
}


setLoader()



