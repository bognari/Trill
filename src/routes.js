/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Router from 'react-routing/src/Router';
import fetch from './core/fetch';
import App from './components/App';
import ContentPage from './components/ContentPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import AnswerPage from './components/AnswerPage';
import HomePage from './components/HomePage';
import {startQuestionAnsweringWithTextQuestion} from './actions/queryBackend';
import {routechange} from './actions/route';

import { Provider } from 'react-redux';
import store from './stores';

// export const ROUTE_CHANGE = 'ROUTE_CHANGE';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    //store.dispatch({type: ROUTE_CHANGE, location: state.path, question: state.query.query}); //may want to remove this if there is a looping problem from audio question, since this will cause state updates, causing the loop

    store.dispatch(routechange(state.path, state.query.query));
    return component && <Provider store={store}><App query={state.query} context={state.context}>{component}</App></Provider>;
  });

  on('', async () => <HomePage/>);

  //on('/contact', async () => <ContactPage />);

  on('/login', async () => <LoginPage />);

  on('/register', async () => <RegisterPage />);

  on('/question', async (state) => <AnswerPage query={state.query}/>);

  on('*', async (state) => {
    const query = `/graphql?query={content(path:"${state.path}"){path,title,content,component}}`;
    const response = await fetch(query);
    const { data } = await response.json();
    return data && data.content && <ContentPage {...data.content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );

});

export default router;
