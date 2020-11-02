// Start dashboard at 3:00PM, Nov, 2
// shortcut "rafcp": Creates a React Arrow Function Component with ES7 module system with PropTypes 
import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import { Link } from 'react-router-dom'


const Dashboard = ({ 
  getCurrentProfile, 
  auth:{ user }, 
  profile: { profile, loading } 
}) => {
  
  useEffect(() => {
    getCurrentProfile()
  }, [])
  
  return loading && profile === null ? <Spinner /> : <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user"></i>
      Welcome { user && user.name }
    </p>

    { profile == null ? 
      <Fragment>
        <p>You have not yet set up your profile</p>
        <Link to="/create-profile" className="btn btn-primary my-1">
          Create Profile
        </Link>
      </Fragment> 
      :  
      <Fragment>You have a profile now</Fragment> }
  </Fragment>
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard)
