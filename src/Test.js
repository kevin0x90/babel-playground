const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for (const number of numbers) {
  console.log(number)
}

numbers.forEach(num => console.log(num))

const iterable1 = new Object()

iterable1[Symbol.iterator] = function* () {
  yield 1
  yield 2
  yield 3
}

console.log([...iterable1])