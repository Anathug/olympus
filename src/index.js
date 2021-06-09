import '@style/style.scss'
import App from '@js/App'
import Assets from './js/Tools/Loader'
import GlobalInteractions from './js/GlobalInteracions'

const createApp = () => {
  new App({
    canvas: document.querySelector('#_canvas'),
    assets: assets
  })

  new GlobalInteractions()
}

const assets = new Assets()
const setLoader = () => {
  let loadDiv = document.querySelector('.loadScreen')
  let loadModels = loadDiv.querySelector('.load')
  let progress = loadDiv.querySelector('.progress')

  if (assets.total === 0) {
    createApp()
    loadDiv.remove()
  } else {
    assets.on('ressourceLoad', () => {
      progress.style.width = loadModels.innerHTML = `${Math.floor((assets.done / assets.total) * 100) +
        Math.floor((1 / assets.total) * assets.currentPercent)
        }%`
    })

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
}

setLoader()



