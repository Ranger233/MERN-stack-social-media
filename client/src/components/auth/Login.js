import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
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
    console.log(formData);
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

export default Login
