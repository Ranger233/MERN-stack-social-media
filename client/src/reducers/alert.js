import { SET_ALERT, REMOVE_ALERT } from '../actions/types'
// Reducers: a function that take in a previous state and an action, and returns a new state. It specify how the actions transform the state tree
const initialState = []

export default function(state = initialState, action){
  const { type, payload } = action
  
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default: 
      return state
  }
 
}