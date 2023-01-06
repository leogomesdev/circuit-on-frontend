# PropagandaScheduler

This project was generated with Angular

## Main technologies used

- [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1
- [Commitizen command line tool](https://github.com/commitizen/cz-cli)
- [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)

## Requirements

### For local usage:

- [Node.js](https://nodejs.org) (v18.12)

### For local usage with Docker:

- [Docker Engine](https://docs.docker.com/install)

## Running

### With Docker

- Make sure you have [Docker](https://docs.docker.com/get-docker) installed

- Run `docker-compose up`

- Navigate to [http://localhost:4200/](http://localhost:4200/)

### Without Docker (Development server)

- Make sure you have [Node.js v18.12](https://nodejs.org/en/download/) installed
  - If you have [nvm - Node Version Manager](https://github.com/nvm-sh/nvm) installed, you could just run `nvm install` and it will install the correct version of Node.js based on file `.npmrc`

- Run `npm install` for installing dependencies

- Run `ng serve` for a dev server

- Navigate to [http://localhost:4200/](http://localhost:4200/)
  - The application will automatically reload if you change any of the source files

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deployment for Production Environment

1) Declare env variables:
````bash
export NG_APP_PROPAGANDA_APP_BACKEND_BASE_URL="ENTER_YOUR_BACK_END_APP_URL"
````

2) Install libs:
````bash
npm install
````

3) Build:
````bash
npm run build:ssr
````

4) Run:
````bash
npm run serve:ssr
````

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
