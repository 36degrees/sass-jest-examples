/* eslint-env jest */

const glob = require('glob')
const sass = require('node-sass')

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

// Test that the settings file does not output any CSS

describe('sass/_settings.scss', () => {
  it('does not output CSS', async () => {
    return render({
      file: 'sass/_settings.scss'
    }).then(output => {
      expect(output.css.toString()).toEqual('')
    })
  })
})

// Testing Sass functions

describe('functions/_half.scss', () => {
  it('halves a given even number', async () => {
    const data = `
      @import "functions/half";

      .foo {
        width: half(10px);
      }
    `

    return render({ data }).then(output => {
      expect(output.css.toString().trim()).toBe('.foo { width: 5px; }')
    })
  })

  it('errors when trying to half something that is not a number', async () => {
    const data = `
      @import "functions/half";

      .foo {
        width: half("trollolol");
      }
    `

    return expect(render({ data })).rejects.toThrow(
      'Cannot half something which is not a number!'
    )
  })

  it('warns when result is not a whole number', async () => {
    const data = `
      @import "functions/half";

      .foo {
        width: half(9px);
      }
    `

    // Create a mock warn function that we can use to override the native @warn
    // function, that we can make assertions about post-render.
    const mockWarnFunction = jest.fn()
      .mockReturnValue(sass.NULL)

    return render({
      data,
      functions: {
        '@warn': mockWarnFunction
      }
    }).then(() => {
      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      return expect(mockWarnFunction.mock.calls[0][0].getValue())
        .toEqual('Halving 9px returns a non-whole number')
    })
  })
})
