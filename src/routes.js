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
import LoginPage from './components/LoginPage';
import ContentPage from './components/ContentPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';
import AnswerPage from './components/AnswerPage';
import HomePage from './components/HomePage';
import {routechange} from './actions/route';
import {questionansweringfull} from '../src/actions/qanary';
import {pushQueries} from '../src/actions/qanary_push';
import {setLanguage} from '../src/actions/language';
import {setKnowledgebase} from '../src/actions/knowledgebase';

import { Provider } from 'react-redux';
import store from './stores';
import {simpleUri} from "./actions/simpleUri";

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    console.log(state.query.lang );
    var lang;
    var kb;
    if ((typeof state.query.lang != 'undefined') && (typeof state.query.kb != 'undefined')) {
      console.log(state.query.lang.toString());
       lang = state.query.lang.split(",");
       kb = state.query.kb.split(",");
    }
    store.dispatch(routechange(state.path, state.query.query, lang, kb));
    var isBrowser=new Function("try {return this===window;}catch(e){ return false;}");
    if (state.query.uri != null && isBrowser()==true){ //this is the case where the user click on the link of topk
      store.dispatch({type: 'SET_QUESTION', question: state.query.query});
      store.dispatch(setKnowledgebase(kb));
      store.dispatch(setLanguage(lang));
      store.dispatch(simpleUri(state.query.query, state.query.uri, kb[0]));
    } else if (state.query.query != null && isBrowser()==true){
      store.dispatch({type: 'SET_QUESTION', question: state.query.query});
      store.dispatch(setKnowledgebase(kb));
      store.dispatch(setLanguage(lang));
      store.dispatch(questionansweringfull(state.query.query, lang, kb));
    }

    return component && <Provider store={store}><App query={state.query} context={state.context}>{component}</App></Provider>;
  });

  on('', async () => <HomePage/>);

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
