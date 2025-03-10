# Equiniti historical data frontend
[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-template-typescript)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-template-typescript "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/laa-crime-equinity-historical-data-frontend/tree/main.svg?style=svg)](https://app.circleci.com/pipelines/github/ministryofjustice/laa-crime-equinity-historical-data-frontend)

# Instructions

The base of this project has been created following the [HMPPS-template-typescript project](https://github.com/ministryofjustice/hmpps-template-typescript)

This bootstrap is community managed by the mojdt `#typescript` Slack channel.
Please raise any questions or queries there. Contributions welcome!


## Running the application

### Dependencies
The app requires:
* redis - session store and token caching (optional - use REDIS_ENABLED=true in .env to enable usage)

### Running the application dependencies
The easiest way to run the app is to use docker compose to create the service and all dependencies.

Create a `docker-compose.override.yml` in the project root directory.

Add the following to specify the environment variables for the external APIs:-
```
services:
  app:
    environment:
      - EQ_API_URL=xxxxxxxxxxx
      - EQ_API_CLIENT_ID=xxxxxxxxxxx
      - EQ_API_SECRET=xxxxxxxxxxx
      - SDS_API_URL=xxxxxxxxxxx
      - SDS_AUTH_SCOPE=xxxxxxxxxxx
      
      # Optionally, specify to enable SSO
      - SSO_DISABLED=false
      - SSO_ALLOWED_USER_PROFILE_GROUPS=xxxxxxxxxxx
      - SSO_CLIENT_ID=xxxxxxxxxxx
      - SSO_CLIENT_SECRET=xxxxxxxxxxx
      - SSO_CLOUD_INSTANCE=https://login.microsoftonline.com/
      - SSO_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
      - SSO_PROVIDER_REPORTING_USER_PROFILE_GROUP=xxxxxxxxxxx
      - SSO_REDIRECT_URI=http://localhost:3000/auth/redirect
      - SSO_REPORTING_USER_PROFILE_GROUP=xxxxxxxxxxx
      - SSO_TENANT_ID=xxxxxxxxxxx
```


`docker compose build`

`docker compose up`


### Running the app for development

To start the main services excluding the example typescript template app: 

`docker compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v9.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`
 
Or run tests with the cypress UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)


## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
