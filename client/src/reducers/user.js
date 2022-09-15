import {
  USER_ERROR,
  GET_USERS,
  GET_USER
} from '../actions/types';

const initialState = {
  users: [],
  user: null,
  userloading: true,
  error: {}
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return {
        ...state,
        user: payload,
        userloading: false
      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        userloading: false
      };
    case USER_ERROR:
      return {
        ...state,
        error: payload,
        userloading: false
      };
    default:
      return state;
  }
}

export default userReducer;
