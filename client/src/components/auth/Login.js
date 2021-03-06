import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData

  // when input fields are changed
  const onChange = event => setFormData({
    ...formData,
    [event.target.name]: event.target.value // use [] to to use "event.target.name" as a key
  })

  // when submit button is clicked
  const onSubmit = event => {
    event.preventDefault() // prevent refresh
    login(email, password) // call login action defined in redux src/actions/auth
  }

  // if logged in, redirect to dashboard
  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Account</p>
      <form className="form" onSubmit={event => onSubmit(event)}>
        <div className="form-group">
          <input 
            value={email} 
            onChange={event => onChange(event)} 
            type="email" 
            placeholder="Email Address" 
            name="email" />
        </div>
        <div className="form-group">
          <input
            value={password} 
            onChange={event => onChange(event)}
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Sign in" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/Register">Register</Link>
      </p>
    </Fragment>
  )
}

// This code declares which type the props are in 
// eg, props "login" is a function, and it's required. "isAuthenticated" is a boolean
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}


// Your mapStateToProps function should return a plain object that contains the data the component needs:
// Each field in the object will become a prop for your actual component
// The values in the fields will be used to determine if your component needs to re-render
// It receives the entire store state, and should return an object of data this component needs.
// detailed tutorial: https://react-redux.js.org/introduction/quick-start
const mapStateToProps = state => ({ 
  // we can use 'mapStateToProps' function to access redux state in react component
  // we can assign states to props like
  // props: state
  isAuthenticated: state.auth.isAuthenticated
})

//'React Redux' provides a connect function for you to connect your component to the store.
export default connect(mapStateToProps, {login})(Login)
