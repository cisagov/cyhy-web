# cyhy-web

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Things To Do

- [ ] Add [IntrospectionFragmentMatcher](https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher)
- [ ] Handle expired `accessToken` with interceptors, try to refresh
  - These seem to be part of axios. So NoGo.
    - https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex
    - https://github.com/pagekit/vue-resource/blob/master/docs/http.md#interceptors
  - This is what we want:
    - https://www.apollographql.com/docs/react/advanced/network-layer.html#linkAfterware
- [x] Break up `store.js` into modules https://vuex.vuejs.org/guide/modules.html
- [ ] Get semantic-ui working with vue
- [ ] Install [apollo-link-retry](https://www.apollographql.com/docs/link/links/retry.html)
- [ ] Integrate [Token Refresh Link](https://github.com/newsiberian/apollo-link-token-refresh)
  - [ ] or https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068
  - [ ] from: https://github.com/apollographql/apollo-link/issues/646
- [x] Use refreshToken when context says to. How do we read the context?
- [ ] Refresh request if being made
  - [x] Refresh token sent correctly
  - [x] valid access token is being returned. (new, not fresh)
  - [x] new access token is being saved in the stored
  - [ ] click actions continue to work

## Link dump:

- Manual retry link: https://stackoverflow.com/questions/50965347/how-to-execute-an-async-fetch-request-and-then-retry-last-failed-request/51321068#51321068
