/* eslint-env jest */

const glob = require('glob')

const { render } = require('./helpers')

// Test that the index.css entry point compiles without throwing any errors.

describe('sass/index.scss', () => {
  it('compiles to CSS', () => {
    return render({
      file: 'sass/index.scss'
    })
  })
})

// Test that components can be compiled individually without throwing errors.

describe('sass/components/', () => {
  const components = glob.sync('sass/components/*.scss')

  it.each(components)('%s compiles to CSS', (file) => {
    return render({ file })
  })
})
