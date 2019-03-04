# Testing Javascript Applications Demo

A demo app with static analysis and unit/integration/end-to-end tests.

## System Requirements

- [git](https://git-scm.com/) v2.14.1 or greater
- [node](https://nodejs.org/) v8.9.4 or greater
- [npm](https://www.npmjs.com/) v5.6.0 or greater

## Setup

```
git clone https://github.com/colinrcummings/testing-javascript-applications-demo.git
cd testing-javascript-applications-demo
npm run setup
```

## About the app

This app has a home page, a login page and a series of feature pages (Feature 1 and Feature 2) for authorized users. Users can be created, updated and destroyed by admin users on the Manage Users page.

## Running the app

### Development

Optimized for DX.

```
npm run db:reset:dev
npm run start:dev
```

Visit [localhost:3000](http://localhost:3000/); login with username "admin" and password "password".

### Test

Optimized for end-to-end testing (see below).

```
npm run db:reset:test
npm run build:test
npm run start:test
```

Visit [localhost:3000](http://localhost:3000/); login with username "cypress" and password "password".

### Production

Optimized for UX.

```
npm run db:init
npm run build
npm start
```

Visit [localhost:80](http://localhost:80/); login with username "admin" and password "password".

## Running tests

_Scripts included in the `precommit` and `validate` scripts are indicated below._

### Static Analysis

Run [eslint](https://eslint.org/) against the codebase for a list of exceptions (staged files are checked in the `precommit` script; all files are checked in the `validate` script):

```
npm run lint
```

Run [prettier](https://prettier.io/) against the codebase for a list of exceptions (staged files are checked in the `precommit` script; all files are checked in the `validate` script):

```
npm run format:check
```

Run prettier against the codebase and automatically fix exceptions:

```
npm run format:fix
```

### Unit & Integration

Run [jest](https://jestjs.io/) tests (included in the `precommit` and `validate` scripts):

```
npm run test
```

Run jest tests in watch mode:

```
npm run test:watch
```

Run jest tests and generate code coverage via [istanbul](https://istanbul.js.org/) (add `:open` to open the LCOV report):

```
npm run coverage
```

### End-to-end

Run [cypress](https://www.cypress.io/) tests (included in the `validate` scripts):

```
npm run test:e2e
```

Run cypress tests in interactive mode:

```
test:e2e:interactive
```

_Both commands reset the database, generate a build and start the server first._
