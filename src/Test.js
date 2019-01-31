import hello from './templates/hello.mustache'

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for (const number of numbers) {
  console.log(number)
}

numbers.forEach(num => console.log(num))

console.log(hello)

console.log(hello.render({
  firstName: 'Test',
  lastName: 'Tester',
  age: 25,
  job: 'dev',
  hobby: 'tennis'
}))