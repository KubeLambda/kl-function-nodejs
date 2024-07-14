const { TrailingComma } = require('projen/lib/javascript')
const { javascript } = require('projen')

const author = 'Bohdan Frankovskyi'
const project = new javascript.NodeProject({
  authorName: author,
  defaultReleaseBranch: 'main',
  name: 'kl-function-nodejs',
  deps: ['nats'],
  description: 'KubeLambda JavaScript function',
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 100,
      semi: false,
      singleQuote: true,
      trailingComma: TrailingComma.ALL,
    },
  },
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
})
project.synth()
