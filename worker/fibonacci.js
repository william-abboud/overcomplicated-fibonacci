function fibonacciSequence(num) {
    if (num === 0) {
      return 0;
    }
  
    if (num === 1 || num === 2) {
      return 1;
    }
  
    return fibonacciSequence(num - 1) + fibonacciSequence(num - 2);
}

module.exports = { fibonacciSequence };