const fse = require('fs-extra')

module.exports = () => {
  const { name, description, version } = require('../package.json')
  const manifest = Object.assign(
    require('../src/manifest'),
    {name, description, version}
  )
  fse.outputFileSync('build/manifest.json', JSON.stringify(manifest))
}
