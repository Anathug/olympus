import Chapter from '../Chapter'
let c = new Chapter(1)

c.init = () => {
}

c.start = () => {
    console.log("started 1")
    console.log(c)
}

c.update = () => {
    console.log(c.progress)
}

export default c;
