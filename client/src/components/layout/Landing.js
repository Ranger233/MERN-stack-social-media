import React from 'react'
import { Link, Redirect } from 'react-router-dom'

// connect to Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Landing = ({ isAuthenticated }) => {
  if(isAuthenticated){
    return <Redirect to='/dashboard' />
  }
  
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">LinkedOut</h1>
          <p className="lead">
            A MERN stack social app where users share/discuss posts and display their profiles
          </p>
          <div className="buttons">
            <Link to="register" className="btn btn-primary">Sign Up</Link>
            <Link to="login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}


// connect to Redux and access states in it
Landing.propTypes = {
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
