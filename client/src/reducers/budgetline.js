import {
  BUDGETLINE_ERROR,
  GET_BUDGETLINES,
  GET_BUDGETLINE
} from '../actions/types';

const initialState = {
  budgetlines: [],
  budgetline: null,
  budgetlineloading: true,
  error: {}
};

function budgetlineReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BUDGETLINE:
      return {
        ...state,
        budgetline: payload,
        budgetlineloading: false
      };
    case GET_BUDGETLINES:
      return {
        ...state,
        budgetlines: payload,
        budgetlineloading: false
      };
    case BUDGETLINE_ERROR:
      return {
        ...state,
        error: payload,
        budgetlineloading: false
      };
    default:
      return state;
  }
}

export default budgetlineReducer;
