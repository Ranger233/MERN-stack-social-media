// if there's a token, add it to the header, is there's isn't, delete token from header
import axios from 'axios'

const setAuthToken = token => {
  // is there's a token in localStorage
  if(token){
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken