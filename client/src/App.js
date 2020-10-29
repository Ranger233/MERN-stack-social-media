import React, { Fragment } from 'react'
import './App.css';
import Navibar from './components/layout/Navibar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const App = () => 
  <Router>
    <Fragment>
      <Navibar />
      {/* <Landing /> */}
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/Register" component={Register} />
          <Route exact path="/Login" component={Login} />
        </Switch>
      </section>
    </Fragment>
  </Router>


export default App;
