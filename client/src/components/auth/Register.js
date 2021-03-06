import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux' // connect react to redux
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types' // shortcut: write "impt" to generate

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData

  // when input fields are changed
  const onChange = event => setFormData({
    ...formData,
    [event.target.name]: event.target.value // use [] to to use "event.target.name" as a key
  })

  // when submit button is clicked
  const onSubmit = event => {
    event.preventDefault() // prevent refresh
    if(password !== password2){
      setAlert('passwords do not match', 'danger');
    } else {
      register({ name, email, password })
    }
  }

  // if logged in, redirect to dashboard
  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={event => onSubmit(event)}>
        <div className="form-group">
          <input 
            value={name} 
            onChange={event => onChange(event)}
            type="text" 
            placeholder="Name" 
            name="name" 
            required
          />
        </div>
        <div className="form-group">
          <input 
            value={email} 
            onChange={event => onChange(event)} 
            type="email" 
            placeholder="Email Address" 
            name="email" 
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className="form-group">
          <input
            value={password2} 
            onChange={event => onChange(event)}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/Login">Sign In</Link>
      </p>
    </Fragment>
  )
}

// This code declares which type the props of the React component "Register" are in 
// eg, props "setAlert" is a function, and it's required
Register.propTypes = {
  setAlert: PropTypes.func.isRequired, // shortcut: write "ptfr" to generate
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({ 
  isAuthenticated: state.auth.isAuthenticated
})

// to connect react to redux, write "export default connect()(Register)" 
// instead of "export default Register"
// because connect() allows us to access setAlert by "props.setAlert"
export default connect(
  mapStateToProps, 
  { setAlert, register }
)(Register)
