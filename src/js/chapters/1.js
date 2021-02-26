import Chapter from '../Chapter'
let c = new Chapter()

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
