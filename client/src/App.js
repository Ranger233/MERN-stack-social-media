import React, { Fragment, useEffect } from 'react'
import './App.css';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Alert from './components/layout/Alert'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

// to use Redux
import { Provider } from 'react-redux'
import store from './store'

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser())
  }, []) //the empty bracket makes store.dispatch only run once

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* <Landing /> */}
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/Register" component={Register} />
              <Route exact path="/Login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}
export default App;
