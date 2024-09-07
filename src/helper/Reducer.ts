export const initialState = {
  user:null
}

interface State {
  user:object
}

interface Action {
  type:string
  payload:object
}

export function AuthenticateReducer(state:State=initialState, action: Action) {
  switch (action.type) {
    case "login":
      return action.payload
    case "logout":
      return null
    case "register":
      return action.payload
    default:
      return state
  }
}