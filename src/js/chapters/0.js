import Chapter from '../Chapter'
import Image from '../World/chapter_0/Image.js'

let c = new Chapter(0)


c.init = (options) => {
  c.camera = options.world.camera.camera
  c.world = options.world
  createImages(c.camera)
}

c.start = () => {
}

c.update = () => {
}

function createImages(camera) {
  const images = importAll(require.context('../../images/chapter_0', false, /\.(png|jpe?g|svg)$/));
  const section = document.querySelector('.chapter_0')

  images.forEach((image, i) => {

    //creating image in html
    const img = document.createElement('img')
    img.src = image.default
    img.classList.add(`img-${i}`)
    section.appendChild(img);

    //creating three image
    const threeimg = new Image(img)
    threeimg.createImage(camera)
    c.world.container.add(threeimg.container)
  })

}

function importAll(r) {
  return r.keys().map(r);
}


export default c;
