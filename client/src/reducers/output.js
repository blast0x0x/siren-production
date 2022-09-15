import {
  OUTPUT_ERROR,
  GET_OUTPUTS,
  GET_OUTPUT
} from '../actions/types';

const initialState = {
  outputs: [],
  output: null,
  outputloading: true,
  error: {}
};

function outputReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_OUTPUT:
      return {
        ...state,
        output: payload,
        outputloading: false
      };
    case GET_OUTPUTS:
      return {
        ...state,
        outputs: payload,
        outputloading: false
      };
    case OUTPUT_ERROR:
      return {
        ...state,
        error: payload,
        outputloading: false
      };
    default:
      return state;
  }
}

export default outputReducer;
