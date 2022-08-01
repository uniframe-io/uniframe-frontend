# name-matching-frontend

## Project setup

```
yarn install
```

## Compiles and hot-reloads for development

```
yarn serve
```

## Compiles and minifies for production

```
yarn build
```

<!-- TODO: writ proper test for components -->

<!-- Unit test is not working,  for now -->

## End to end Test with Cypress

**Please note during Cypress testing your server must running**

- for visual test please run

```
yarn cypress-open
```

after window opens click on test that you want to run

- For headless test please run

```
  yarn cypress-run
```

- ### 💥Possible error with Cypress
  If you run Cypress for the first time you may want to run (on Windows OS):

```
  ./node_modules/.bin/cypress install --force
```

**this will download and install Cypress**

for more info visit [Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress#Running-tests).

---

## Lints and fixes files

```
yarn lint
```

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Mock server

To run the mock server please cd into _mock/server_ and refer to [README](mock/server/README.md) file in _mock/server_ directory

## 💥Possible error with Tailwind

If you see this error

<span style="color: red">_Error: PostCSS plugin tailwindcss requires PostCSS 8_</span>

please refer [Tailwind docs](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build)

They say they will handel it later

## Dependencies descriptions

As dependencies could need more descriptions go [Dependency Document](./Documents/DEPENDENCIES.md) to see more

## Git strategy

For the git guideline please read [Git Strategy Document](Documents/GIT_STRATEGY.md)

## Deployment

### Local docker deployment

```sh
docker build -t vue-nginx .
docker run --rm -it -p 8080:80 vue-nginx
```
