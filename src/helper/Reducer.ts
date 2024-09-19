export const initialState = {
  user: null,
  message: null,
};

interface State {
  user: object;
}

interface Action {
  type: string;
  payload?: {
    user?: object;
    message?: string;
  };
}

export function AuthenticateReducer(
  state: State = initialState,
  action: Action,
) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload?.user,
        message: action.payload?.message,
      };
    case "logout":
      return null;
    case "register":
      return {
        ...state,
        user: action.payload?.user,
        message: action.payload?.message,
      };
    default:
      return state;
  }
}
