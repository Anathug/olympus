export default class EncryptedText {
  constructor(elClass) {
    this.el = document.querySelector(elClass)
    this.text = this.el.innerHTML
    this.randomLetters = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
    ]
    this.much = 100
    this.encryptedText = []
    this.encrypt(this.text)
  }

  encrypt(text) {
    text = text.split('')
    text.forEach((letter, i) => this.encryptLetter(letter, i))
  }

  encryptLetter(letter, i) {
    const originalLetter = letter
    let much = this.much
    setInterval(() => {
      much--
      if (much > 0) {
        if (letter !== ' ') {
          letter = this.randomLetters[Math.floor(Math.random() * this.randomLetters.length)]
        }
        this.encryptedText[i] = letter
        this.el.innerHTML = this.encryptedText.join('')
      }
      if (much === 0) {
        letter = originalLetter
        this.encryptedText[i] = letter
        this.el.innerHTML = this.encryptedText.join('')
      }
    }, 10)
  }
}
