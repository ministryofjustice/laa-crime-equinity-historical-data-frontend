# LAA crime Equinity historical data frontend 

This is the frontend displaying the data from laa-crime-equinity-historical-data backend.

## Setup

Before you begin, ensure you have met the following requirements:
* `node.js` = v20.11.0
* `npm` = 10.2.4

## Build in Docker

Execute within main repo to build and spin up containers. 
`docker-compose up -d --build`

Once built, you can then make local changes in your IDE which will be reflected in the docker container.

## Run for development

Install the projects package.json
`npm install`

`npm run build`

`npm run dev`

A message should be displayed in your terminal for which port it's running on (localhost:4000)

## Running unit tests

`npm run test`

## Running e2e tests (Cypress)

`npm run int-test`

To run in Cypress UI

`int-test-ui`

## Deploying the project

`npm run build`

This will create a `dist` folder which will used to display in the browser.

## Node packages

Within the node `package.json` file are scripts, these scripts are used for various tasks, such as compiling the JS and Scss, to
building the project or executing tests. Below are a list of what some commands do and why we are using certain
packages.

### Compile-js script command

1) `copy-js`: Copy the GOVUK frontend JS `govuk-frontend.min.js` file. This file is required to trigger the JS behaviours of all GOV components 
used within the project.
2) `concat-js`: Concat-js will combine a list of JS files into one JS file. The command will need to be modified in order 
combine all listed JS files into `main.js`. The `main.js` is used across the whole site, so be sure to only include JS that
is required across your site.
3) `uglify-js`: Uglify-js is a JavaScript parser, minifier, and mangler that helps reduce the size of JavaScript files by removing unecessary characters, whitespace, and renaming variables to shorter names. It's commonly used for optimising JavaScript code for production environments. This is the final step on the `main.js` file to create a min.js for
production.





