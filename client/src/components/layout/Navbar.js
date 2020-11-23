import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

// to connect to redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  // #! means the link will go no where
  const authLinks = (
    <ul>
      <li>
        <Link to="/posts">
          Posts
        </Link>
      </li>
      <li>
        <Link to="/profiles">
          See user profiles
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={ logout } href="#!"> 
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Log out</span>
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
        <li><Link to="/profiles">See user profiles</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
    </ul>
  )
  
  return (
    <div>
      <nav className="navbar bg-dark">
      <h1>
        <Link to="">
          <i className="fas fa-space-shuttle"></i> LinkedOut
        </Link>
      </h1>
      {!loading && (<Fragment>{ isAuthenticated? authLinks : guestLinks }</Fragment>)}
    </nav>
    </div>
  )
}


// connect to Redux and access states in it
Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
