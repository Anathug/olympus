function threeDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(3)
}

module.exports = threeDecimals
