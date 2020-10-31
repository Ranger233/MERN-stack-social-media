// An action is a plain JavaScript object that has a type field. You can think of an action as an event that describes something that happened in the application.
import { SET_ALERT, REMOVE_ALERT } from '../actions/types'
//import uuid from 'uuid'
import { v4 as uuidv4 } from 'uuid'

export const setAlert = (msg, alertType) => dispatch => { // able to use double arrow because of the "thunk" middleware
  const id = uuidv4()
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  })

  // remove alert after 5 seconds
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id}), 3000)
}
