import Chapter from '../Chapter'
let c = new Chapter(2)

c.init = (options) => {
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
}

c.start = () => {
}

c.update = () => {
}

export default c;
