import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Route, Router, browserHistory} from 'react-router';

import Error from './container/Error';
import Frame from './container/Frame';
import Home from './container/Home';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Frame}>
      <IndexRoute component={Home} />
      <Route path="*" component={Error} />
    </Route>
  </Router>,
  document.getElementById('root')
);
