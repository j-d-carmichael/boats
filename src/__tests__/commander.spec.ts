import program from '../commander'

test('check the right stuff is returned', () => {
  const commanderReturn = program([
    'node','myscript',
    '--init',
    '-i', 'bill',
    '-o', 'ben',
    '-x',
  ])
  expect(commanderReturn.init).toBe(true)
  expect(commanderReturn.input).toBe('bill')
  expect(commanderReturn.output).toBe('ben')
  expect(commanderReturn.exclude_version).toBe(true)
})
