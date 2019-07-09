const inquirer = require('inquirer')
const fs = require('fs-extra')
const pwd = process.cwd()
const path = require('path')
const srcPath = path.join(pwd, '/src')
const srcAlreadyExists = fs.pathExistsSync(srcPath)
const buildPath = path.join(pwd, '/build')
const buildAlreadyExists = fs.pathExistsSync(srcPath)

if (srcAlreadyExists || buildAlreadyExists) {
  return console.error('Process stopped as ' + srcAlreadyExists + ' &/or' + buildPath + 'already found. Installation cannot run with these folders existing.')
} else {

  const localPkgJsonPath = path.join(pwd, 'package.json')
  if (!fs.pathExistsSync(localPkgJsonPath)) {
    return console.error('Error: No package.json file found. Please add a package.json file to continue')
  }
  let localPkgJson = require(localPkgJsonPath)

  const questions = [{
    type: 'input',
    name: 'name',
    message: 'Enter the name of the api file, press enter to use the current package.json name attribute:',
    default: localPkgJson.name,
    validate: function (value) {
      return (typeof value === 'string' && value.length > 1) || 'Please enter a name longer than 1 character'
    },
  }, {
    type: 'confirm',
    name: 'updateName',
    message: 'The current package.json name does not match the api name entered. Would you the package.json name to be updated too?',
    when: function (answers) {
      return answers.name !== localPkgJson.name
    }
  }, {
    type: 'list',
    name: 'oaType',
    choices: [
      'Swagger 2.0',
      'OpenAPI 3.0.0'
    ]
  }, {
    type: 'confirm',
    name: 'installConfirm',
    message: 'Press Y and enter to install. This will make a copy of the template files to ./src, an output directory ./build and a config file ./.boatsrc',
    default: false
  }]

  inquirer.prompt(questions).then((answers) => {
    if (answers.installConfirm) {
      fs.copySync(path.join(__dirname, '.boatsrc'), path.join(pwd, '/.boatsrc'))
      console.log('Completed: Injected a .boatsrc file')
      fs.copySync(path.join(__dirname, (answers.oaType === 'Swagger 2.0') ? 'srcOA2' : 'srcOA3'), srcPath)
      console.log('Completed: Installed boats skeleton files to ' + srcPath)
      fs.ensureDirSync(buildPath)
      console.log('Completed: Created a build output directory')
      const name = answers.name
      if (answers.updateName) {
        localPkgJson.name = name
      }
      localPkgJson.scripts['build:json'] = 'boats -i ./src/index.yml -o ./build/api.json'
      localPkgJson.scripts['build:yaml'] = 'boats -i ./src/index.yml -o ./build/api.yml'
      localPkgJson.scripts['build:all'] = 'npm run build:json && npm run build:yaml'

      // Write the new json object to file
      fs.writeFileSync(localPkgJsonPath, JSON.stringify(localPkgJson, null, 4))
      console.log('Completed: BOATS build scripts added to your package.json')
      if (answers.updateName) {
        return console.log('Completed: Package json name attr updated')
      }
    } else {
      return console.log('BOATS Installation cancelled.')
    }
  }).catch((e) => {
    console.log('Aborting installation:')
    console.error(e)
  })
}
