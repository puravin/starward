import React from 'react';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import manifest from '../../public/assets/build/manifest.json';

console.log('manifest vendor file', manifest['0']);
console.log('manifest apps file', manifest['1']);
const VENDOR = `/assets/build/${manifest['0']}`;
const MAIN = `/assets/build/${manifest['1']}`;

const createApp = (store, props) => {
  try {
    return renderToString(
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    );
  } catch (err) {
    console.error(err);
    return '';
  }
};

const styles = process.env.NODE_ENV === 'production' ? '<link rel="stylesheet" href="/assets/build/css/styles.css">' : '';

const buildPage = ({ componentHTML, initialState, headAssets }) => {
  return `
<!doctype html>
<html>
  <head>
    ${headAssets.title.toString()}
    ${headAssets.meta.toString()}
    ${headAssets.link.toString()}
    ${styles}
  </head>
  <body>
    <div id="app">${componentHTML}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
    <script src="https://cdn.polyfill.io/v2/polyfill.js?features=default,es6"></script>
    <script type="text/javascript" charset="utf-8" src=${VENDOR}></script>
    <script type="text/javascript" charset="utf-8" src=${MAIN}></script>
  </body>
</html>`;
};

export default (store, props) => {
  const initialState = store.getState();
  const componentHTML = createApp(store, props);
  const headAssets = Helmet.rewind();
  return buildPage({ componentHTML, initialState, headAssets });
};
