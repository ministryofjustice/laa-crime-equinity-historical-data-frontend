# CLA Express nunjucks prototype

This project is a proof of concept that a government website can be created using express.js with Nunjucks. Through
this project we can see the pros and cons of using this in production. This prototype is **NOT** a production ready project
and should **NOT** be treated as one.

There are many aspects in this project that are just ideas and loosely written concepts.

## Project set up information

- Node version: 20.10.0
- [Node Version Management](https://github.com/nvm-sh/nvm)

## Learning resources

- [HMPPS Typescript Template](https://github.com/ministryofjustice/hmpps-template-typescript)
- [How to set up Express.js TypeScript](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
- [How to use Express session](https://expressjs.com/en/resources/middleware/session.html)
- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Express Database](https://expressjs.com/en/guide/database-integration.html)
- [Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
- [GDS Components](https://design-system.service.gov.uk/components/)
- [GDS for production](https://design-system.service.gov.uk/get-started/production/)
- [GOVUK Frontend V5](https://frontend.design-system.service.gov.uk/changes-to-govuk-frontend-v5/)

## Build in Docker

Execute within main repo to build and spin up containers. 
`docker-compose up -d --build`

Once built, you can then make local changes in your IDE which will be reflected in the docker conatiner.

## How to run for development purposes

Before starting anything, make sure your Node version is set to the projects Node version, you can use NVM to help
change your node version between projects.

Install the projects package.json
`npm install`

Before starting development, it's recommended to have two terminal tabs open. One for running the build, which collects
and moved updated file to the dist folder (The compiled JS that is served to the browser / server). Second is to just
run a local server in your browsers. 

Step 1 in your first terminal tab:
`npm run build`

Step 2 in your second terminal tab: 

`npm run dev`

A message should be displayed in your terminal for which port it's running on (localhost:3000)

Nodemon is set up to watch for JS file changes, so you don't have to execute `npm run build` everytime. You should
however run `npm run build` when you've made changes to the njk files. (Work still needs to be done to make this
easier for the developer).

## Running unit tests

`npm run test`

## Running e2e tests (Cypress)

To run headless:

`npm run int-test`

To run in Cypress UI

`int-test-ui`

## Deploying the project

`npm run build`

This will create a dist folder which contains all the relevant files needed in order to run the project. This folder
is also used when developing locally on your machine.

Ensure that the asset's directory is also included in your deployment, this is separate and outside the dist directory.


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
files. This file is used in local development and then Uglified and converted with Babel for production.
3) `uglify-js`: Uglify-js is a JavaScript parser, minifier, and mangler that helps reduce the size of JavaScript files by removing
unnecessary characters, whitespace, and renaming variables to shorter names. It's commonly used for optimising
JavaScript code for production environments. This is the final step on the `main.js` file to create a min.js for
production.

## FAQ 

**- My port is already being used:**

Use to reveal what's using your port.
`lsof -i :3000`

Use to kill the port ID shown in the table from the command above.
`kill -9 PID`

**- Template is not changing or updating:**

Did you run `npm run build`? Still not working, there could be something wrong with the way the build commands 
are being called / run. Check the package.json file scripts and try running each part of the
build command separately to work out which one is not working.

**- No files are being generated when I run dev and build:**
Did you make changes to the `tsconig.json`? Some settings conflict and cause odd side effects in the project, review
your git history to see if anything has changed.

## Acknowledgement

Big thank you to hmpps-template-typescript
[HMPPS Typescript Template](https://github.com/ministryofjustice/hmpps-template-typescript)

Many ideas and solutions have been used from this project and has been a massive help in
getting our prototype off the ground.






