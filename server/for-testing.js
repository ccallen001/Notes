function reverse(str) {
  return str.split('').reverse().join('');
}

function average(numberArr) {
  return numberArr.length
    ? numberArr.reduce((a, b) => a + b, 0) / numberArr.length
    : 0;
}

module.exports = {
  reverse,
  average
};
