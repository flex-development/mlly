/**
 * @file Unit Tests - findDynamicImports
 * @module mlly/utils/tests/unit/findDynamicImports
 */

import { dedent } from 'ts-dedent'
import testSubject from '../find-dynamic-imports'

describe('unit:utils/findDynamicImports', () => {
  it('should return DynamicImport object array', () => {
    // Arrange
    const code: string = dedent`
      await import('foo')
      await import("/modules/my-module.js")
      await import('foo.json', { assert: { type: 'json' } })

      const foo = await import(bar)

      let myModule;

      if (typeof window === "undefined") {
        myModule = await import("module-used-on-server");
      } else {
        myModule = await import("module-used-in-browser");
      }

      Array.from({ length: 10 }).map((_, index) => {
        return import(\`/modules/module-\${index}.js\`)
      })

      const {
        default: myDefault,
        addFive,
        addFour,
        addThree,
        addTwo,
        squareFive,
        squareFour,
        squareThree,
        squareTwo
      } = await import('./lib')

      <script>
        const main = document.querySelector("main");

        for (const link of document.querySelectorAll("nav > a")) {
          link.addEventListener("click", (e) => {
            e.preventDefault();

            import("/modules/my-module.js")
              .then((module) => {
                module.loadPageInto(main);
              })
              .then((module) => {
                module.loadPageInto(main);
              })
              .then((module) => {
                module.loadPageInto(main);
              })
              .catch((err) => {
                main.textContent = err.message;
              });
          });
        }
      </script>
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').that.is.not.empty
    expect(results).toMatchSnapshot()
  })
})
