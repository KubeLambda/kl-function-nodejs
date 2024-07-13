const { javascript } = require("projen");
const project = new javascript.NodeProject({
  authorName: "Bohdan Frankovskyi",
  defaultReleaseBranch: "main",
  name: "kl-function-nodejs",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();