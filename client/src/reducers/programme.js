import {
  PROGRAMME_ERROR,
  GET_PROGRAMMES,
  GET_PROGRAMME
} from '../actions/types';

const initialState = {
  programmes: [],
  programme: null,
  programmeloading: true,
  error: {}
};

function programmeReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROGRAMME:
      return {
        ...state,
        programme: payload,
        programmeloading: false
      };
    case GET_PROGRAMMES:
      return {
        ...state,
        programmes: payload,
        programmeloading: false
      };
    case PROGRAMME_ERROR:
      return {
        ...state,
        error: payload,
        programmeloading: false
      };
    default:
      return state;
  }
}

export default programmeReducer;
